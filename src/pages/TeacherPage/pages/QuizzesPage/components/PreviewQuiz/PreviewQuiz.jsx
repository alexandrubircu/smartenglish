import React, { useState } from 'react';
import styles from './PreviewQuiz.module.scss';
import { useSnackbar } from 'notistack';
import {
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteQuizById } from '../../../../../../api/teacherService';

const PreviewQuiz = ({ quiz, refresh, setSelectedId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  if (!quiz) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const handleDeleteQuiz = async () => {
    handleClose();
    try {
      await deleteQuizById(quiz.id);
      refresh();
      enqueueSnackbar('Quiz deleted successfully.', { variant: 'success' });
      setSelectedId(null);
    } catch (error) {
      enqueueSnackbar('Failed to delete quiz.', { variant: 'error' });
    }
  };

  return (
    <div className={styles.previewWrapper}>
      <h3 className={styles.pageTitle}>Quiz Preview</h3>
      <p className={styles.quizTitle}>Title:{quiz.title}</p>
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
        <MenuItem onClick={handleDeleteQuiz}>Delete quiz</MenuItem>
      </Menu>
      <div className={styles.questionsList}>
        {quiz.questions.map((q, i) => (
          <div key={i} className={styles.questionPreview}>
            <p><strong> {q.questionText}</strong></p>
            <p><strong>Type:</strong> {q.type === 'choose' ? 'Choose the correct answer' : 'Write the answer'}</p>

            {q.type === 'choose' && (
              <table className={styles.answersTable}>
                <thead>
                  <tr>
                    <th>Answer</th>
                    <th>Correct</th>
                  </tr>
                </thead>
                <tbody>
                  {q.answers.map((answer, idx) => (
                    <tr
                      key={idx}
                      className={q.correctAnswer === idx ? styles.correctAnswerRow : ''}
                    >
                      <td>{answer.text || answer}</td>
                      <td>{q.correctAnswer === idx ? '✔' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {q.type === 'write' && (
              <p><strong>Correct answers:</strong> {q.correctTextAnswers?.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewQuiz;
