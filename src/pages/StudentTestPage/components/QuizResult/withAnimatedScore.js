import React, { useEffect, useState } from 'react';

const withAnimatedScore = (WrappedComponent) => {
  return ({ score, quizName }) => {
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
      <WrappedComponent
        score={score}
        quizName={quizName}
        filledHeight={filledHeight}
        feedback={getFeedback()}
      />
    );
  };
};

export default withAnimatedScore;
