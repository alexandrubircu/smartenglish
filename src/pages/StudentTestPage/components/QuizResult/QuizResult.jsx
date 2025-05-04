import React, { useEffect, useState } from 'react';
import styles from './QuizResult.module.scss';

const QuizResult = ({ score, quizName }) => {
  const [filledHeight, setFilledHeight] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilledHeight(score);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const getFeedback = () => {
    if (score >= 80) return "Excellent work! 🎉";
    if (score >= 50) return "Good job! Keep practicing. 💪";
    return "Don't give up!";
  };

  return (
    <div className={styles.resultWrapper}>
      <h2 className={styles.quizTitle}>{quizName}</h2>
      <div className={styles.tubeContainer}>
        <div className={styles.tube}>
          <div
            className={styles.filler}
            style={{ height: `${filledHeight}%` }}
          />
          <span className={styles.percentage}>{score}%</span>
        </div>
        <div className={styles.feedback}>
          {getFeedback()}
          <p>Please wait for your teacher's response. They will review your submission and get back to you shortly.</p>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
