import React, { useState, useMemo, useEffect } from "react";
import { useSnackbar } from 'notistack';
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
import noData from '../../../../../../assets/images/noData.png'
import styles from "./StudentProfile.module.scss";

import { deleteStudentById, deleteCompletedTest, deleteActiveTest, assignQuizToStudent } from "../../../../../../api/teacherService";
import { observeCompletedTests } from "../../../../../../api/observeCompletedTests";
import { observeActiveTests } from "../../../../../../api/observeActiveTests";

import { useNavigate } from "react-router-dom";

const StudentProfile = ({ professorId, student, quizzes, onDeleteStudent }) => {
  const { enqueueSnackbar } = useSnackbar();
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
      enqueueSnackbar('Student deleted successfully.', { variant: 'success' });
      if (onDeleteStudent) onDeleteStudent(student.id);
    } catch (error) {
      enqueueSnackbar('Failed to delete student.', { variant: 'error' });
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
      enqueueSnackbar('Test assigned successfully!', { variant: 'success' });
    } catch (err) {
      console.error("❌ Eroare la asignare test:", err);
      enqueueSnackbar('Error assigning test.', { variant: 'error' });
    }
  };

  if (!student) return <div className={styles.empty}>Selectează un student</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year}, ${hour}:${minute}`;
  };

  const renderTestCard = (test, showCompleted = false) => (
    <div key={test.id} className={styles.testCard}>
      <div className={styles.testDates} onClick={() => {
        if (showCompleted) {
          navigate(`/dashboard/results/${student.id}/${test.id}`);
        }
        if (!showCompleted) {
          navigate(`/dashboard/quizprev/${test.quizId}`);
        }
      }}>
        <div className={styles.testCardTitle}>{test.title}</div>
        <p style={{ fontWeight: 'bold' }}>
          Assigned:
          <span style={{ fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>{formatDate(test.assignedAt)}</span>
        </p>
        {showCompleted &&
          <p style={{ fontWeight: 'bold' }}>
            Completed:
            <span style={{ fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>{formatDate(test.completedAt)}</span>
          </p>
        }
      </div>
      <div className={styles.testCardActions}>
        <IconButton
          onClick={async () => {
            try {
              if (showCompleted) {
                await deleteCompletedTest(student.id, test.id);
                enqueueSnackbar('Completed test deleted.', { variant: 'success' });
              } else {
                await deleteActiveTest(student.id, test.id);
                enqueueSnackbar('Active test deleted.', { variant: 'success' });
              }
            } catch (err) {
              enqueueSnackbar('Failed to delete test.', { variant: 'error' });
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
              enqueueSnackbar('Link copied to clipboard!', { variant: 'info' });
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
                <div className={styles.noDataWrapp}>
                  <img src={noData} alt='img' />
                  <p className={styles.emptyText}>No completed tests.</p>
                </div>
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
                <div className={styles.noDataWrapp}>
                  <img src={noData} alt='img' />
                  <p className={styles.emptyText}>No active tests.</p>
                </div>
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
                placeholder="Search test by title"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '12px',
                    },
                    '&:hover fieldset': {
                      borderRadius: '12px',
                      borderColor: '#ffa726',
                    },
                    '&.Mui-focused fieldset': {
                      borderRadius: '12px',
                      borderColor: '#fb8c00',
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '20px',
                    },
                  },
                }}
              />
            </div>
            <div className={styles.testList}>
              {filteredTests.length === 0 ? (
                <div className={styles.noDataWrapp}>
                  <img src={noData} alt='img' />
                  <p className={styles.emptyText}>No tests found.</p>
                </div>
              ) : (
                filteredTests.map((test) => (
                  <div key={test.id} className={styles.testItem}>
                    <div className={styles.testInfoWrapp}>
                      <p style={{ fontWeight: 'bold' }}>
                        Test title:
                        <span style={{ marginLeft: '8px' }}>{test.title}</span>
                      </p>
                      <p style={{ fontWeight: 'bold' }}>
                        Assigned:
                        <span style={{ fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>{formatDate(test.createdAt)}</span>
                      </p>
                    </div>
                    <div className={styles.actionasignTest}>
                      <Button
                        variant="outlined"
                        size="small"
                        className={styles.previewBtn}
                        onClick={() => {
                          navigate(`/dashboard/quizprev/${test.id}`);
                        }}
                      >
                        Preview Test
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        className={styles.assignBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssign(test);
                        }}
                      >
                        Assign Test
                      </Button>
                    </div>
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
