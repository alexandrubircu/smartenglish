import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from "./StudentProfile.module.scss";

import { deleteStudentById, deleteCompletedTest, deleteActiveTest, assignQuizToStudent } from "../../../../../../api/teacherService";
import { observeCompletedTests } from "../../../../../../api/observeCompletedTests";
import { observeActiveTests } from "../../../../../../api/observeActiveTests";

import { useNavigate } from "react-router-dom";

const StudentProfile = ({ professorId, student, quizzes, onDeleteStudent }) => {
  const navigate = useNavigate();
  const [liveCompletedTests, setLiveCompletedTests] = useState({});
  const [liveActiveTests, setLiveActiveTests] = useState({});
  useEffect(() => {
    if (!student?.id) return;

    const unsubscribe = observeCompletedTests(student.id, (updatedTests) => {
      setLiveCompletedTests(updatedTests);
    });

    return () => unsubscribe();
  }, [student?.id]);
  useEffect(() => {
    if (!student?.id) return;

    const unsubscribe = observeActiveTests(student.id, (updatedQuizzes) => {
      setLiveActiveTests(updatedQuizzes);
    });

    return () => unsubscribe();
  }, [student?.id]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [activeTab, setActiveTab] = useState("completed");
  const [searchTerm, setSearchTerm] = useState("");

  const completedTests = useMemo(() => {
    return Object.entries(liveCompletedTests).map(([testId, test]) => ({
      id: testId,
      quizId: test.id,
      title: test.quizName,
      assignedAt: new Date(test.assignedAt).toLocaleString(),
      completedAt: new Date(test.completedAt).toLocaleString(),
    }));
  }, [liveCompletedTests]);

  const activeTests = useMemo(() => {
    return Object.entries(liveActiveTests).map(([assignedQuizId, quiz]) => ({
      id: assignedQuizId,
      quizId: quiz.quizId,
      title: quiz.quizName,
      assignedAt: new Date(quiz.timestamp).toLocaleString(),
    }));
  }, [liveActiveTests]);

  const filteredTests = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter((test) =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, quizzes]);

  const numberOfCompletedTests = completedTests.length;
  const numberOfAssignTests = activeTests.length;

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDeleteStudent = async () => {
    try {
      await deleteStudentById(student.id);
      handleClose();
      if (onDeleteStudent) onDeleteStudent(student.id);
    } catch (error) {
      console.error("Eroare la ștergerea studentului:", error);
    }
  };

  const handleAssign = async (test) => {
    try {
      const assignment = {
        quizId: test.id,
        quizName: test.title,
        assignedBy: professorId
      };

      await assignQuizToStudent(student.id, assignment);
      alert("✅ Test assigned cu succes!");
    } catch (err) {
      console.error("❌ Eroare la asignare test:", err);
      alert("❌ A apărut o eroare la asignare.");
    }
  };

  if (!student) return <div className={styles.empty}>Selectează un student</div>;

  const renderTestCard = (test, showCompleted = false) => (
    <div key={test.id} className={styles.testCard}>
      <div className={styles.testDates} onClick={() => {
        if (showCompleted) {
          navigate(`/dashboard/results/${student.id}/${test.id}`);
        }
      }}>
        <div className={styles.testCardTitle}>{test.title}</div>
        <p>Assigned: {test.assignedAt}</p>
        {showCompleted && <p>Completed: {test.completedAt}</p>}
      </div>
      <div className={styles.testCardActions}>
        <IconButton
          onClick={async () => {
            try {
              if (showCompleted) {
                await deleteCompletedTest(student.id, test.id);
              } else {
                await deleteActiveTest(student.id, test.id);
              }
            } catch (err) {
              console.error("Error deleting test:", err);
            }
          }}
          className={styles.deleteBtn}
          size="small"
          aria-label="delete"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        {!showCompleted && (
          <IconButton
            onClick={() => {
              const link = `${window.location.origin}/start-test/${student.id}/${test.id}`;
              navigator.clipboard.writeText(link);
            }}
            className={styles.copyBtn}
            size="small"
            aria-label="copy-link"
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.profileCard}>
      <Box className={styles.cardWrapper}>
        <Avatar alt={student.name} src="/avatar.png" className={styles.avatar} />
        <Box className={styles.details}>
          <Typography variant="h6" className={styles.name}>
            {student.name || "Unknown name"}
          </Typography>
          <Typography className={styles.email}>
            Email: {student.email || "unknown"}
          </Typography>
        </Box>
        <IconButton onClick={handleMenuClick} className={styles.menuBtn}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleDeleteStudent}>Delete student</MenuItem>
        </Menu>
      </Box>

      <div className={styles.studentFunctionalityWrapper}>
        <Box className={styles.tabs}>
          {["completed", "active", "assign"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.activeTab : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "completed"
                ? `Completed Tests: ${numberOfCompletedTests}`
                : tab === "active"
                  ? `Active Tests: ${numberOfAssignTests}`
                  : "Assign Test"}
            </button>
          ))}
        </Box>

        {activeTab === "completed" && (
          <div className={styles.completedTestWrapper}>
            <div className={styles.tabTitile}>
              <p>Completed Tests</p>
            </div>
            <div className={styles.complitedContent}>
              {completedTests.length === 0 ? (
                <p className={styles.emptyText}>No completed tests.</p>
              ) : (
                <div className={styles.testGrid}>
                  {completedTests.map((test) => renderTestCard(test, true))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "active" && (
          <div className={styles.activeTestWrapper}>
            <div className={styles.tabTitile}>
              <p>Active Tests</p>
            </div>
            <div className={styles.activeContent}>
              {activeTests.length === 0 ? (
                <p className={styles.emptyText}>No active tests.</p>
              ) : (
                <div className={styles.testGrid}>
                  {activeTests.map((test) => renderTestCard(test))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "assign" && (
          <div className={styles.asignTestWrapper}>
            <div className={styles.tabTitile}>
              <p>Assign Test</p>
            </div>
            <div className={styles.assignSearch}>
              <TextField
                label="Search test by title..."
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                sx={{
                  "& label": { color: "#ffcc80" },
                  "& label.Mui-focused": { color: "#fb8c00" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: "12px",
                      borderColor: "#ffcc80",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ffa726",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fb8c00",
                    },
                  },
                }}
              />
            </div>
            <div className={styles.testList}>
              {filteredTests.length === 0 ? (
                <p className={styles.emptyText}>No tests found.</p>
              ) : (
                filteredTests.map((test) => (
                  <div key={test.id} className={styles.testItem}>
                    <span className={styles.testTitle}>{test.title}</span>
                    <Button
                      variant="outlined"
                      size="small"
                      className={styles.assignBtn}
                      onClick={() => handleAssign(test)}
                    >
                      Assign Test
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
