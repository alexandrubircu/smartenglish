import { useStudentData } from '../../contexts/StudentDataContext';
import styles from './StudentTestPage.module.scss';
import QuizRunner from './components/QuizRunner/QuizRunner';
import QuizResult from './components/QuizResult/QuizResultDecorated';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const StudentTestPage = () => {
  const { student, quizData, assignedQuizId, loading, error, score, setScore, quizName } = useStudentData();

  const hasFinished = score !== null;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWtapper}>
        <ErrorOutlineOutlinedIcon className={styles.icon} />
        <p className={styles.errorTitle}>{error}</p>
        <p>Please notify the teacher to check and resolve the situation as soon as possible.</p>
      </div>
    );
  }

  return (
    <div className={styles.testWrapper}>
      {hasFinished ? (
        <QuizResult
          score={score}
          quizName={quizName}
        />
      ) : (
        <QuizRunner
          quizData={quizData}
          student={student}
          assignedQuizId={assignedQuizId}
          setScore={setScore}
        />
      )}
    </div>
  );
};

export default StudentTestPage;
