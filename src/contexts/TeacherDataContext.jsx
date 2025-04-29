import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchAllStudents,
  fetchAllQuizzes,
  createStudentInFirestore,
  createQuizInFirestore
} from '../api/teacherService';

const TeacherDataContext = createContext();

export const useTeacherData = () => useContext(TeacherDataContext);

export const TeacherDataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [studentsData, quizzesData] = await Promise.all([
        fetchAllStudents(),
        fetchAllQuizzes()
      ]);
      setStudents(studentsData);
      setQuizzes(quizzesData);
    } catch (err) {
      console.error('❌ Eroare la încărcarea datelor:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ Funcție corectată: întoarce și assignedQuizId
  const addStudent = async (professorId, name, email, quizId = null, quizName = null) => {
    const { student, assignedQuizId } = await createStudentInFirestore(professorId, name, email, quizId, quizName);

    setStudents(prev => [...prev, student]);

    return { student, assignedQuizId }; // 🛠️ întoarcem obiectul corect
  };

  const addQuiz = async (professorId, quizData) => {
    const newQuiz = await createQuizInFirestore(professorId, quizData);
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz;
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <TeacherDataContext.Provider
      value={{ students, quizzes, loading, refresh, addStudent, addQuiz }}
    >
      {children}
    </TeacherDataContext.Provider>
  );
};
