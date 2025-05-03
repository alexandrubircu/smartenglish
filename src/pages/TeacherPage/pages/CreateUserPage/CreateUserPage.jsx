import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Select, MenuItem, Modal, CircularProgress
} from "@mui/material";
import styles from "./CreateUserPage.module.scss";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTeacherData } from "../../../../contexts/TeacherDataContext";

const CreateUserPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { addStudent, quizzes } = useTeacherData();

  const handleCreate = async () => {
    if (!user?.uid) return alert("Authentication required.");
    if (!name || !email) return alert("Please fill in all fields.");

    try {
      const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);
      const quizName = selectedQuiz?.title || "Test";
      const { student, assignedQuizId } = await addStudent(user.uid, name, email, selectedQuizId, quizName);

      if (selectedQuizId) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          const link = `${window.location.origin}/start-test/${student.id}/${assignedQuizId}`;
          console.log(`Generated link: ${link}`);
        }, 1500);
      } else {
        alert("User created without assigned test.");
      }

      setName("");
      setEmail("");
      setSelectedQuizId("");
    } catch (err) {
      console.error("Error creating student:", err);
      alert("Failed to save student to the database.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Create new user</h3>

      <Box className={styles.form}>
        <TextField
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          className={styles.input}
          sx={{
            '& label': { color: '#ffcc80' },
            '& label.Mui-focused': { color: '#fb8c00' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderRadius: '12px', borderColor: '#ffcc80' },
              '&:hover fieldset': { borderColor: '#ffa726' },
              '&.Mui-focused fieldset': { borderColor: '#fb8c00' },
            },
          }}
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          className={styles.input}
          sx={{
            '& label': { color: '#ffcc80' },
            '& label.Mui-focused': { color: '#fb8c00' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderRadius: '12px', borderColor: '#ffcc80' },
              '&:hover fieldset': { borderColor: '#ffa726' },
              '&.Mui-focused fieldset': { borderColor: '#fb8c00' },
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
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffcc80' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ffa726' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fb8c00' },
            '& .MuiSelect-outlined': { padding: '10.5px 14px' },
          }}
        >
          <MenuItem value="">No test assigned</MenuItem>
          {quizzes.map((quiz) => (
            <MenuItem key={quiz.id} value={quiz.id}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>

        <Button variant="outlined" onClick={handleCreate} className={styles.createBtn}>
          Create user
        </Button>
      </Box>

      <Modal open={showModal}>
        <Box className={styles.modal}>
          <CircularProgress />
          <Typography className={styles.modalText}>Generating assigned test...</Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateUserPage;
