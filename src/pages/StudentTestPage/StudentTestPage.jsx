import React from 'react';
import { useStudentData } from '../../contexts/StudentDataContext';
import styles from './StudentTestPage.module.scss';
import QuizRunner from './components/QuizRunner/QuizRunner'

const StudentTestPage = () => {
  const { student, quizData, loading, error } = useStudentData();

  if (loading) return <p>Se încarcă testul...</p>;
  if (error) return <p>{error}</p>;
  if (!quizData) return <p>Testul nu a fost găsit.</p>;
  return (
    <div className={styles.testWrapper}>
      <QuizRunner quizData={quizData} student={student} />
      {/* <h2>{quiz.title}</h2>
      <p>Total întrebări: {quiz.questions.length}</p>

      <hr />
      <p><strong>Elev:</strong> {student?.name}</p>
      <p><strong>Email:</strong> {student?.email}</p> */}
    </div>
  );
};

export default StudentTestPage;
