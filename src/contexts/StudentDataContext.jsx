import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStudentById, getQuizById } from '../api/studentService';
import { useParams } from 'react-router-dom';

const StudentDataContext = createContext();
export const useStudentData = () => useContext(StudentDataContext);

export const StudentDataProvider = ({ children }) => {
  const { studentId, assignedQuizId } = useParams();
  const [student, setStudent] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentAndQuiz = async () => {
    setLoading(true);
    try {
      const studentData = await getStudentById(studentId);

      const assignedEntry = studentData.quizzes?.[assignedQuizId];

      if (!assignedEntry) {
        setError('Testul nu a fost găsit pentru acest utilizator.');
        return;
      }

      const { quizId, assignedBy, timestamp } = assignedEntry;

      const fetchedQuizData = await getQuizById(quizId);

      setStudent(studentData);
      setQuizData({
        ...fetchedQuizData,
        assignedBy,
        assignedTimestamp: timestamp
      });
    } catch (e) {
      console.error(e);
      setError('Eroare la încărcarea datelor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentAndQuiz();
  }, [studentId, assignedQuizId]);

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
