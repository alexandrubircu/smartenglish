import React, { useEffect, useState } from "react";
import styles from './ResultPage.module.scss';
import { useParams } from "react-router-dom";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  TextareaAutosize,
  Button
} from "@mui/material";
import {
  fetchCompletedTestByStudent,
  markNotificationAsRead,
} from "../../../../api/teacherService";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ResultPage = () => {
  const { studentId, completedTestId, notifId } = useParams();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [copyText, setCopyText] = useState("");

  useEffect(() => {
    const loadTest = async () => {
      try {
        const data = await fetchCompletedTestByStudent(studentId, completedTestId);
        setTestData(data);

        if (notifId) {
          await markNotificationAsRead(notifId);
        }
      } catch (err) {
        console.error("❌", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [studentId, completedTestId, notifId]);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpenDialog = () => {
    if (!testData) return;

    let content = `🌟 Test: ${testData.quizName} 🌟\nStudent: ${testData.studentName}\n\n`;

    testData.answersQuestion?.forEach((item, index) => {
      const isCorrect = item.correct ? "✅ Correct" : "❌ Wrong";
      content += `${index + 1}. ${item.question}\n   ➡️ ${item.userAnswer || "-"}  ${isCorrect}\n`;
      if (!item.correct && item.correctTextAnswers?.length > 0) {
        content += `   ✅ Correct answers: ${item.correctTextAnswers.join(", ")}\n`;
      }
      content += `\n`;
    });

    setCopyText(content);
    setOpenDialog(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText);
  };

  if (loading) return (
    <div className={styles.loadingWrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
  if (!testData) {
    return (
      <div className={styles.notFoundWrapper}>
        <p className={styles.notFoundText}>Test not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.resultPageWrapper}>
      <Box className={styles.cardWrapper}>
        <Avatar alt={testData.studentName} src="/avatar.png" className={styles.avatar} />
        <Box className={styles.details}>
          <Typography variant="h6" className={styles.name}>
            {testData.studentName || "Unknown name"}
          </Typography>
          <Typography className={styles.email}>
            {testData.quizName || "Unknown quiz"}
          </Typography>
        </Box>
      </Box>
      <Box className={styles.testListWrapper}>
        <IconButton onClick={handleMenuClick} className={styles.menuBtn}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleOpenDialog}>Copy test result</MenuItem>
        </Menu>
        <div className={styles.resultList}>
          {testData.answersQuestion?.map((item, index) => (
            <div
              key={index}
              className={`${styles.resultItem} ${item.correct ? styles.correct : styles.wrong}`}
            >
              <p className={styles.question}><b>{index + 1}.</b> {item.question}</p>
              <p className={styles.answer}>
                Student answer: <b>{item.userAnswer || "-"}</b>
              </p>
              {!item.correct && item.correctTextAnswers?.length > 0 && (
                <p className={styles.correctAnswers}>
                  Correct answers: <b>{item.correctTextAnswers.join(", ")}</b>
                </p>
              )}
            </div>
          ))}
        </div>
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ className: styles.customDialog }}
      >
        <Box className={styles.dialogContent}>
          <Typography className={styles.dialogTitle}>Test summary</Typography>
          <TextareaAutosize
            minRows={10}
            className={styles.dialogTextarea}
            value={copyText}
            onChange={(e) => setCopyText(e.target.value)}
          />
          <Box className={styles.dialogActions}>
            <Button
              className={styles.modalBtn}
              style={{ backgroundColor: "transparent" }}
              onClick={() => setOpenDialog(false)}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={styles.modalBtn}
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default ResultPage;
