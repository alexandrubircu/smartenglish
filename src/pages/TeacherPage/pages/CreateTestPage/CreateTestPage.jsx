import React, { useState } from 'react';
import styles from './CreateTestPage.module.scss';
import { useSnackbar } from 'notistack';
import { useAuth } from "../../../../contexts/AuthContext";
import { useTeacherData } from "../../../../contexts/TeacherDataContext";
import { Quiz, Question, Answer } from '../../../../composite/QuizComponent';
import { createQuizInFirestore } from '../../../../api/teacherService';
import './QuizComponent.scss'
import { Button } from "@mui/material";
import previewTestI from '../../../../assets/images/previewTest.png'

const CreateTestPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { refresh } = useTeacherData();
  const [quizName, setQuizName] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [questions, setQuestions] = useState([
    new Question('', 'choose', [new Answer(''), new Answer('')])
  ]);
  const [quizPreview, setQuizPreview] = useState(null);
  const maxQuestions = 60;
  // console.log(quizPreview);
  const handleQuizNameChange = (e) => setQuizName(e.target.value);

  const handleQuestionTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    const prevQuestion = updatedQuestions[index];
    updatedQuestions[index] = new Question(
      prevQuestion.questionText,
      value,
      value === 'choose' ? [new Answer(''), new Answer('')] : [],
      value === 'write' ? [''] : []
    );
    setQuestions(updatedQuestions);
  };

  const handleCorrectTextAnswerChange = (index, value, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctTextAnswers[answerIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addCorrectTextAnswer = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctTextAnswers.push('');
    setQuestions(updatedQuestions);
  };

  const removeCorrectTextAnswer = (index, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctTextAnswers.splice(answerIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleNumberOfAnswersChange = (index, value) => {
    const updatedQuestions = [...questions];
    const newAnswersCount = Math.min(Number(value), 6);
    const currentAnswers = updatedQuestions[index].answers;

    if (newAnswersCount > currentAnswers.length) {
      updatedQuestions[index].answers = [
        ...currentAnswers,
        ...Array(newAnswersCount - currentAnswers.length).fill().map(() => new Answer(''))
      ];
    } else {
      updatedQuestions[index].answers = currentAnswers.slice(0, newAnswersCount);
    }
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex].text = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = answerIndex;

    updatedQuestions[questionIndex].answers.forEach((ans, idx) => {
      ans.isCorrect = idx === answerIndex;
    });

    setQuestions(updatedQuestions);
  };

  const handleQuestionTextChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleNumberOfQuestionsChange = (e) => {
    const value = Math.min(Number(e.target.value), maxQuestions);
    const newQuestions = [...questions];

    if (value > numberOfQuestions) {
      for (let i = numberOfQuestions; i < value; i++) {
        newQuestions.push(new Question('', 'choose', [new Answer(''), new Answer('')]));
      }
    } else {
      newQuestions.splice(value);
    }

    setNumberOfQuestions(value);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quizData = new Quiz(quizName, questions);
    setQuizPreview(quizData);
  };

  const handleConfirmQuiz = async () => {
    if (!quizPreview) return;

    try {
      const professorId = user.uid;
      await createQuizInFirestore(professorId, quizPreview.toJSON());

      setQuizName('');
      setNumberOfQuestions(1);
      setQuestions([
        new Question('', 'choose', [new Answer(''), new Answer('')])
      ]);
      setQuizPreview(null);
      refresh();
      enqueueSnackbar('Quiz created successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create quiz.', { variant: 'error' });
    }
  };

  const renderChooseQuestion = (question, index) => (
    <>
      <div className={styles.formGroupSelsect}>
        <label>Number of answer choices:</label>
        <input
          type="number"
          min="2"
          max="6"
          value={question.answers.length}
          onChange={(e) => handleNumberOfAnswersChange(index, e.target.value)}
        />
      </div>
      {question.answers.map((answer, answerIndex) => (
        <div className={styles.answerInput} key={answerIndex}>
          <label>Answer {answerIndex + 1}:</label>
          <input
            type="text"
            placeholder='Answer'
            value={answer.text}
            onChange={(e) => handleAnswerChange(index, answerIndex, e.target.value)}
            required
          />
          <input
            type="radio"
            name={`correctAnswer-${index}`}
            checked={question.correctAnswer === answerIndex}
            onChange={() => handleCorrectAnswerChange(index, answerIndex)}
          />
          <label>Correct Answer</label>
        </div>
      ))}
    </>
  );

  const renderWriteQuestion = (question, index) => (
    <div className={styles.formGroup}>
      <label>Correct answers:</label>
      {question.correctTextAnswers.map((answer, answerIndex) => (
        <div key={answerIndex} className={styles.answerInput}>
          <input
            type="text"
            placeholder='Correct answers'
            value={answer}
            onChange={(e) => handleCorrectTextAnswerChange(index, e.target.value, answerIndex)}
            required
          />
          <Button
            variant="outlined"
            size="small"
            className={styles.defBtn}
            onClick={() => removeCorrectTextAnswer(index, answerIndex)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outlined"
        size="small"
        className={styles.defBtn}
        onClick={() => addCorrectTextAnswer(index)}
      >
        Add another correct answer
      </Button>
    </div>
  );

  return (
    <div className={styles.addQuizContainer}>
      <form className={styles.addQuizForm} onSubmit={handleSubmit}>
        <div className={styles.formGroupTop}>
          <div className={styles.QuizTitle}>
            <p>Quiz Title</p>
            <input type="text" placeholder='Quiz Title' value={quizName} onChange={handleQuizNameChange} required />
          </div>

          <div className={styles.numberOfQuestions}>
            <p>Number of questions</p>
            <input
              type="number"
              value={numberOfQuestions}
              onChange={handleNumberOfQuestionsChange}
              min="1"
              max={maxQuestions}
              required
            />
          </div>
        </div>
        <div className={styles.QuizList}>
          {questions.map((question, index) => (
            <div className={styles.questionSection} key={index}>
              <div className={styles.questionCounter}>
                <h3>Question {index + 1}</h3>
              </div>
              <div className={styles.formGroup}>
                <label>Question text:</label>
                <input
                  placeholder='Question text'
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionTextChange(index, e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Question type:</label>
                <div className={styles.selectContainer}>
                  <select value={question.type} onChange={(e) => handleQuestionTypeChange(index, e.target.value)}>
                    <option value="choose">Choose the correct answer</option>
                    <option value="write">Write the answer</option>
                  </select>
                </div>
              </div>
              {question.type === 'choose'
                ? renderChooseQuestion(question, index)
                : renderWriteQuestion(question, index)}
            </div>
          ))}
        </div>
        <div className={styles.quizListBtngroup}>
          <Button
            variant="outlined"
            size="small"
            className={styles.previewBtn}
            type="submit"
          >
            Preview
          </Button>
        </div>
      </form>

      {quizPreview ? (
        <div className={styles.previewWrapper}>
          <div
            className={styles.quizPreview}
            dangerouslySetInnerHTML={{ __html: quizPreview.renderPreview() }}
          />
          <div className={styles.confirmBtn}>
            <Button
              variant="outlined"
              size="small"
              className={styles.defBtn}
              onClick={handleConfirmQuiz}
            >
              Confirm quiz
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.waitingPrevBlock}>
          <img src={previewTestI} alt='img' />
          <h3 className={styles.waitingTitle}>
            Previzualizarea testului va apărea aici
          </h3>
          <p className={styles.waitingDescription}>
            Adaugă întrebări pentru a genera un preview.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateTestPage;
