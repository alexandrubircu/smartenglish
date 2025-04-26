import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Select, MenuItem, Modal, CircularProgress
} from "@mui/material";
import styles from "./CreateUserPage.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import { useTeacherData } from "../../contexts/TeacherDataContext";

const CreateUserPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const { addStudent, quizzes } = useTeacherData();

  const handleCreate = async () => {
    if (!user?.uid) return alert("Autentificare necesară.");
    if (!name || !email) return alert("Completează toate câmpurile.");
  
    try {
      const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);
      const quizName = selectedQuiz?.title || "Test";
      const student = await addStudent(user.uid, name, email, selectedQuizId, quizName);
  
      if (selectedQuizId) {
       
  
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          const link = `${window.location.origin}/start-test/${student.id}/${selectedQuizId}`;
          console.log(`Link generat: ${link}`);
        }, 1500);
      } else {
        alert("Utilizator creat fără test.");
      }
  
      setName("");
      setEmail("");
      setSelectedQuizId("");
    } catch (err) {
      console.error("Eroare creare student:", err);
      alert("Eroare la salvare student în baza de date.");
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <Typography variant="h5" className={styles.title}>Creare utilizator nou</Typography>

      <Box className={styles.form}>
        <TextField
          label="Nume complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          className={styles.input}
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          className={styles.input}
        />

        <Select
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
          displayEmpty
          fullWidth
          className={styles.select}
        >
          <MenuItem value="">Fără test atribuit</MenuItem>
          {quizzes.map((quiz) => (
            <MenuItem key={quiz.id} value={quiz.id}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={handleCreate} className={styles.createBtn}>
          Creează utilizator
        </Button>
      </Box>

      <Modal open={showModal}>
        <Box className={styles.modal}>
          <CircularProgress />
          <Typography className={styles.modalText}>Se generează testul atribuit...</Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateUserPage;
