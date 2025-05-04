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
  const [score, setScore] = useState(() => {
    const stored = sessionStorage.getItem('quizScore');
    return stored ? parseInt(stored, 10) : null;
  });
  const [quizName, setQuizName] = useState(() => sessionStorage.getItem('quizName') || null);

  const fetchStudentAndQuiz = async () => {
    setLoading(true);
    try {
      const studentData = await getStudentById(studentId);
      const assignedEntry = studentData.quizzes?.[assignedQuizId];

      if (!assignedEntry) {
        setError('The test was not found for this user.');
        return;
      }

      const { quizId, assignedBy, timestamp } = assignedEntry;
      const fetchedQuizData = await getQuizById(quizId);

      setStudent(studentData);
      setQuizData({
        ...fetchedQuizData,
        assignedBy,
        assignedTimestamp: timestamp,
      });
      setQuizName(fetchedQuizData.title);
      sessionStorage.setItem('quizName', fetchedQuizData.title);

    } catch (e) {
      console.error(e);
      setError('Error loading data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = { studentId, assignedQuizId };
    const storedParamsRaw = sessionStorage.getItem('quizSessionParams');
    const storedParams = storedParamsRaw ? JSON.parse(storedParamsRaw) : null;

    const paramsChanged =
      !storedParams ||
      storedParams.studentId !== studentId ||
      storedParams.assignedQuizId !== assignedQuizId;

    if (paramsChanged) {
      Object.keys(sessionStorage).forEach((key) => {
        if (
          key.startsWith('quizScore') ||
          key.startsWith('quizName') ||
          key.startsWith('userAnswers') ||
          key.startsWith('currentQuestionIndex')
        ) {
          sessionStorage.removeItem(key);
        }
      });
      setScore(null);
      setQuizName(null);
      sessionStorage.setItem('quizSessionParams', JSON.stringify(currentParams));
    }

    const storedScore = sessionStorage.getItem('quizScore');
    const storedName = sessionStorage.getItem('quizName');

    if (!storedScore || !storedName) {
      fetchStudentAndQuiz();
    } else {
      setScore(parseInt(storedScore, 10));
      setQuizName(storedName);
      setLoading(false);
    }
  }, [studentId, assignedQuizId]);

  return (
    <StudentDataContext.Provider
      value={{
        student,
        quizData,
        assignedQuizId,
        loading,
        error,
        score,
        setScore,
        quizName,
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
};
