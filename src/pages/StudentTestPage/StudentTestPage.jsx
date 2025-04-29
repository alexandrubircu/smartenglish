import React from 'react';
import { useStudentData } from '../../contexts/StudentDataContext';
import styles from './StudentTestPage.module.scss';
import QuizRunner from './components/QuizRunner/QuizRunner'

const StudentTestPage = () => {
  const { student, quizData, assignedQuizId, loading, error } = useStudentData();
  console.log(assignedQuizId);
  if (loading) return <p>Se încarcă testul...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className={styles.testWrapper}>
      <QuizRunner quizData={quizData} student={student} assignedQuizId={assignedQuizId} />
    </div>
  );
};

export default StudentTestPage;
