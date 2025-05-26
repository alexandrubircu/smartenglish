import React from 'react';
import styles from './QuizResult.module.scss';

const QuizResult = ({ score, quizName, filledHeight, feedback }) => {
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
          {feedback}
          <p>Please wait for your teacher's response. They will review your submission and get back to you shortly.</p>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
