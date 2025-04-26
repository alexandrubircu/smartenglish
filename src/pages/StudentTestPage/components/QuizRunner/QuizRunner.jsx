import React, { useState } from 'react';
import styles from "./QuizRunner.module.scss"
import {addFinalAnswersToStudent} from '../../../../api/studentService';

const QuizRunner = (props) => {
  const { quizData, student } = props;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(parseInt(sessionStorage.getItem('currentQuestionIndex'), 10) || 0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState(JSON.parse(sessionStorage.getItem('userAnswers')) || []);
  const [transitioning, setTransitioning] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  
  const handleAnswerSelect = (index) => {
    setSelectedAnswerIndex(index);
    setCustomAnswer('');
  };

  const handleCustomAnswerChange = (e) => {
    const normalizeApostrophes = (input) => {
      const apostrophes = /[‘’`´]/g;
      return input.replace(apostrophes, "'");
    };

    const normalizedValue = normalizeApostrophes(e.target.value);
    setCustomAnswer(normalizedValue);
    setSelectedAnswerIndex(null);
  };


  const handleNextQuestion = () => {
    if (selectedAnswerIndex !== null || customAnswer.trim() !== '') {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[currentQuestionIndex] = selectedAnswerIndex !== null
        ? quizData.questions[currentQuestionIndex].answers[selectedAnswerIndex]
        : customAnswer;

      setUserAnswers(updatedAnswers);
      sessionStorage.setItem('userAnswers', JSON.stringify(updatedAnswers));
      sessionStorage.setItem('currentQuestionIndex', currentQuestionIndex + 1);

      setSelectedAnswerIndex(null);
      setCustomAnswer('');
      setTransitioning(true);

      setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTransitioning(false);
      }, 500);
    }
  };

  const normalizeAnswer = (answer) => answer?.toLowerCase().replace(/\s/g, "");

  const verifyAnswers = (answers) => {
    return quizData.questions.map((question, i) => {
      const userAnswer = normalizeAnswer(answers[i]);
      const correctAnswer = question.type === 'write'
        ? question.correctTextAnswers?.map(normalizeAnswer) || []
        : normalizeAnswer(question.answers?.[question.correctAnswer]);

      const correct = question.type === 'write'
        ? correctAnswer.includes(userAnswer)
        : userAnswer === correctAnswer;

      return {
        type: question.type || "",
        correctTextAnswers: question.correctTextAnswers || [question.answers[question.correctAnswer]],
        answers: question.answers || [],
        userAnswer: answers[i] || "",
        question: question.questionText || "Unknown question",
        correct,
      };
    });
  };

  const handleFinishQuiz = async () => {
    if (isButtonDisabled || (selectedAnswerIndex === null && customAnswer.trim() === '')) return;
  
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = selectedAnswerIndex !== null
      ? quizData.questions[currentQuestionIndex].answers[selectedAnswerIndex]
      : customAnswer;
  
    sessionStorage.setItem('userAnswers', JSON.stringify(updatedAnswers));
    setIsButtonDisabled(true);
  
    const verificationData = verifyAnswers(updatedAnswers);
  
    const studentCurrentQuiz = student.quizzes.find(testObj => Object.keys(testObj).includes(quizData.title));
  
    const uniqueId = crypto.randomUUID(); 
  
    const finalAnswers = {
      id: uniqueId,
      quizName: quizData.title,
      completedAt: new Date().toISOString(),
      assignedAt: studentCurrentQuiz ? studentCurrentQuiz[quizData.title].timestamp : null,
      teacherId: quizData.createdBy,
      answersQuestion: verificationData,
    };
  
    await addFinalAnswersToStudent(student.id, finalAnswers, student.name);
  };
  
  const currentQuestion = quizData.questions[currentQuestionIndex];

  return(
    <div className={styles.QuizMani}>
      <div className={styles.quizBox}>
        <div className={styles.quizTitle}>
          <p translate="no">{quizData.title}</p> 
        </div>
        <div className={styles.quizProgres}>
          <p>Progres:</p>
          <div className={styles.progresLine}>
            <div className={styles.line} style={{ width: `${(currentQuestionIndex + 1) / quizData.questions.length * 100}%` }} />
          </div>
        </div>
        <div className={`${styles.quizContetn} ${transitioning ? styles.shrink : styles.expand}`}>
          <div className={styles.question}>
            <p translate="no">{currentQuestion.questionText}</p>
          </div>
          <div className={styles.answers}>
            {currentQuestion.type === 'choose' && currentQuestion.answers && (
              currentQuestion.answers.map((variant, index) => (
                <div
                  key={index}
                  className={`${styles.answer} ${selectedAnswerIndex === index ? styles.selected : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <p translate="no">{variant}</p>
                </div>
              ))
            )}

            {currentQuestion.type === 'write' && (
              <div className={styles.customAnswer}>
                <input
                  type="text"
                  placeholder="Enter your answer"
                  value={customAnswer}
                  onChange={handleCustomAnswerChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.actionButton}>
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <button onClick={handleNextQuestion}>Next</button>
          ) : (
            <button
              onClick={handleFinishQuiz}
              disabled={isButtonDisabled || (selectedAnswerIndex === null && customAnswer.trim() === '')}
            >
              Finish Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizRunner