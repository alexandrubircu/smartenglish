import React, { useEffect, useState } from "react";
import styles from './QuizzesPage.module.scss';
import { useTeacherData } from "../../../../contexts/TeacherDataContext";
import { useParams } from 'react-router-dom';

import SearchQuiz from "./components/SearchQuiz/SearchQuiz";
import PreviewQuiz from "./components/PreviewQuiz/PreviewQuiz";


const QuizzesPage = () => {
  const { quizzes, refresh, loading } = useTeacherData();
  const { quizId } = useParams();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (quizId && quizzes.find(q => q.id === quizId)) {
      setSelectedId(quizId);
    } else if (!quizId && quizzes.length > 0 && !selectedId) {
      setSelectedId(quizzes[0].id);
    }
  }, [quizId, quizzes]);

  return (

    <div className={styles.QuizzesPageWrapper}>
      {loading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <>
          <SearchQuiz
            quizzes={quizzes}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
          <PreviewQuiz quiz={quizzes.find((q) => q.id === selectedId)} refresh={refresh} setSelectedId={setSelectedId} />
        </>
      )}
    </div>
  );
};

export default QuizzesPage;
