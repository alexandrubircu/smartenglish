import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchAllStudents,
  fetchAllQuizzes,
  createStudentInFirestore,
  createQuizInFirestore
} from '../api/teacherService';
import { useAuth } from './AuthContext';
import { observeNotifications } from '../api/observeNotifications';

const TeacherDataContext = createContext();

export const useTeacherData = () => useContext(TeacherDataContext);

export const TeacherDataProvider = ({ children }) => {
  const { user } = useAuth();
  const professorId = user?.uid;
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  const refresh = async () => {
    try {
      const [studentsData, quizzesData] = await Promise.all([
        fetchAllStudents(),
        fetchAllQuizzes()
      ]);
      setStudents(studentsData);
      setQuizzes(quizzesData);
    } catch (error) {
      throw error;
    } finally {
    }
  };

  useEffect(() => {
    if (!professorId) return;
    const unsubscribe = observeNotifications(professorId, setNotifications);

    return () => unsubscribe();
  }, [professorId]);

  const addStudent = async (professorId, name, email, quizId = null, quizName = null) => {
    const { student, assignedQuizId } = await createStudentInFirestore(professorId, name, email, quizId, quizName);

    setStudents(prev => [...prev, student]);

    return { student, assignedQuizId };
  };

  const addQuiz = async (professorId, quizData) => {
    const newQuiz = await createQuizInFirestore(professorId, quizData);
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await refresh();
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  return (
    <TeacherDataContext.Provider
      value={{
        professorId,
        students,
        quizzes,
        notifications,
        loading,
        refresh,
        addStudent,
        addQuiz
      }}
    >
      {children}
    </TeacherDataContext.Provider>

  );
};
