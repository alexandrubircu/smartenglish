import React, { useEffect, useState } from "react";
import styles from './ResultPage.module.scss';
import { useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
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
  getQuizById,
} from "../../../../api/teacherService";
import { Quiz } from '../../../../composite/QuizComponent';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import noData from '../../../../assets/images/noData.png';

const ResultPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { studentId, completedTestId, notifId } = useParams();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [prevDataLoading, setPrevDataLoading] = useState(false);
  const [noPrevData, setNoPrevData] = useState(null);
  const [prevTestData, setPrevTestData] = useState(null);
  const [scorePercentage, setScorePercentage] = useState(0);
  useEffect(() => {
    const loadTest = async () => {
      try {
        const data = await fetchCompletedTestByStudent(studentId, completedTestId);
        setTestData(data);
        setScorePercentage(0);

        setTimeout(() => {
          setScorePercentage(data.scorePercentage);
        }, 100);
        if (notifId) {
          await markNotificationAsRead(notifId);
        }
        if (data) {
          previewData(data);
        }
      } catch (err) {
        enqueueSnackbar('Failed to load test data.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [studentId, completedTestId, notifId]);

  const previewData = async (data) => {
    setPrevDataLoading(true);
    try {
      const prevData = await getQuizById(data?.quizId);
      prevData && setPrevTestData(Quiz.fromJSON(prevData));
    } catch (err) {
      setNoPrevData(true);
    } finally {
      setPrevDataLoading(false);
    }
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year}, ${hour}:${minute}`;
  };

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
    enqueueSnackbar('Copied to clipboard!', { variant: 'info' });
  };

  if (loading) return (
    <div className={styles.loadingWrapper}>
      <div className={styles.spinner}></div>
    </div>
  );
  if (!testData) {
    return (
      <div className={styles.noDataWrapp}>
        <img src={noData} alt='img' />
        <p className={styles.emptyText}>Test not found.</p>
      </div>
    );
  }
  return (
    <div className={styles.resultPageWrapper}>
      <div className={styles.fastData}>
        <Box className={styles.cardWrapper}>
          <div className={styles.studentData}>
            <Avatar alt={testData.studentName} src="/avatar.png" className={styles.avatar} />
            <Typography variant="h6" className={styles.name}>
              {testData.studentName || "Unknown name"}
            </Typography>
          </div>
          <div className={styles.testData}>
            <Typography className={styles.testCardTitle}>{testData.title}</Typography>
            <Typography style={{ fontWeight: 'bold', marginBottom: "4px", fontSize: "18px" }}>
              Test title:
              <span style={{ marginLeft: '8px' }}>{testData.quizName || "Unknown quiz"}</span>
            </Typography>
            <Typography style={{ fontWeight: 'bold' }}>
              Assigned:
              <span style={{ fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>{formatDate(testData.assignedAt)}</span>
            </Typography>

            <Typography style={{ fontWeight: 'bold' }}>
              Completed:
              <span style={{ fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>{formatDate(testData.completedAt)}</span>
            </Typography>
            <Typography style={{ fontWeight: 'bold' }}>
              Number of question:
              <span style={{ fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>{testData.answersQuestion.length}</span>
            </Typography>
          </div>
          <div className={styles.studentScore}>
            <div
              className={styles.wave}
              style={{ height: `${scorePercentage}%` }}
            />
            <div className={styles.scoreNumber}>
              {Math.round((testData?.scorePercentage || 0) / 100 * 9 + 1)}
            </div>
          </div>
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
          <div className={styles.resultTestTitle}>Student answers</div>
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
      </div>
      <div className={styles.prevWrapp}>
        {prevDataLoading && (
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {prevTestData && (
          <div
            className={styles.quizPreview}
            dangerouslySetInnerHTML={{ __html: prevTestData.renderPreview() }}
          />
        )}
        {noPrevData && (
          <div className={styles.noDataWrapp}>
            <img src={noData} alt='img' />
            <p className={styles.emptyText}>
              The test you're trying to preview was not found or may have been deleted.
            </p>
          </div>
        )}
      </div>
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
