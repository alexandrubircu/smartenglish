import React from 'react';
import { useStudentData } from '../../contexts/StudentDataContext';
import styles from './StudentTestPage.module.scss';
import QuizRunner from './components/QuizRunner/QuizRunner'

const StudentTestPage = () => {
  const { student, quizData, loading, error } = useStudentData();

  if (loading) return <p>Se încarcă testul...</p>;
  if (error) return <p>{error}</p>;
  console.log("student", student);
  console.log("quizData", quizData);
  return (
    <div className={styles.testWrapper}>
      <QuizRunner quizData={quizData} student={student} />
    </div>
  );
};

export default StudentTestPage;
