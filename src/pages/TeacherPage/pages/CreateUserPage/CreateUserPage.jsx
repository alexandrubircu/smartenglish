import React, { useState } from "react";
import { useSnackbar } from 'notistack';
import {
  Box, Typography, TextField, Button, Select, MenuItem, Modal
} from "@mui/material";
import styles from "./CreateUserPage.module.scss";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTeacherData } from "../../../../contexts/TeacherDataContext";

const CreateUserPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { addStudent, quizzes } = useTeacherData();
  const [generatedLink, setGeneratedLink] = useState("");

  const handleCreate = async () => {
    if (!user?.uid) return enqueueSnackbar('Authentication required.', { variant: 'error' });
    if (!name || !email) return enqueueSnackbar('Please fill in all fields.', { variant: 'error' });
    setGeneratedLink("");
    try {
      const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);
      const quizName = selectedQuiz?.title || "Test";
      const { student, assignedQuizId } = await addStudent(user.uid, name, email, selectedQuizId, quizName);
      enqueueSnackbar('User created successfully!', { variant: 'success' });
      if (selectedQuizId) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          const link = `${window.location.origin}/start-test/${student.id}/${assignedQuizId}`;
          setGeneratedLink(link);
        }, 1500);
      } else {
        enqueueSnackbar('User created without assigned test.', { variant: 'warning' });
      }

      setName("");
      setEmail("");
      setSelectedQuizId("");
    } catch (err) {
      enqueueSnackbar('Failed to save student to the database.', { variant: 'error' });
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.formWrapp}>
          <h3 className={styles.title}>Create new student</h3>

          <Box className={styles.form}>
            <TextField
              placeholder="Full name"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              className={styles.input}
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

            <TextField
              placeholder="Email"
              size="small"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              className={styles.input}
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

            <Select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              displayEmpty
              fullWidth
              className={styles.select}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ffa726'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fb8c00'
                },
                '& .MuiSelect-outlined': {
                  padding: '10.5px 14px'
                },
              }}
            >
              <MenuItem value="">No test assigned</MenuItem>
              {quizzes.map((quiz) => (
                <MenuItem key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="outlined"
              onClick={handleCreate}
              disabled={showModal}
              className={styles.createBtn}
            >
              Create user
            </Button>
          </Box>
        </div>
        {generatedLink && (
          <Box className={styles.linkBox}>
            <Typography variant="body1" className={styles.linkText}>
              Generated test link:
            </Typography>
            <Box className={styles.linkContent}>
              <TextField
                value={generatedLink}
                InputProps={{ readOnly: true }}
                fullWidth
                size="small"
                className={styles.generatedLink}
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
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  enqueueSnackbar("Link copied to clipboard!", { variant: "info" });
                }}
                className={styles.copyBtn}
                variant="contained"
              >
                Copy
              </Button>
            </Box>
          </Box>
        )}
        <Modal open={showModal}>
          <Box className={styles.modal}>
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner}></div>
            </div>
            <Typography className={styles.modalText}>Generating assigned test...</Typography>
          </Box>
        </Modal>

      </div>
    </>
  );
};

export default CreateUserPage;
