import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStudentById, getQuizById } from '../api/studentService';
import { useParams } from 'react-router-dom';

const StudentDataContext = createContext();
export const useStudentData = () => useContext(StudentDataContext);

export const StudentDataProvider = ({ children }) => {
  const { studentId, quizId } = useParams();
  const [student, setStudent] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentAndQuiz = async () => {
    setLoading(true);
    try {
      const studentData = await getStudentById(studentId);
  
      const assignedEntry = studentData.quizzes?.find((entry) => {
        const quizName = Object.keys(entry)[0];
        return entry[quizName].quizId === quizId;
      });
  
      if (!assignedEntry) {
        setError('Testul nu a fost găsit pentru acest utilizator.');
        return;
      }
  
      const quizData = await getQuizById(quizId);
      setStudent(studentData);
      setQuizData(quizData);
    } catch (e) {
      console.error(e);
      setError('Eroare la încărcarea datelor.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchStudentAndQuiz();
  }, [studentId, quizId]);

  return (
    <StudentDataContext.Provider
      value={{
        student,
        quizData,
        loading,
        error
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
};
