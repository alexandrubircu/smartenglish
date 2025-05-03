import React, { useEffect, useState } from "react";
import styles from './QuizzesPage.module.scss';
import { useTeacherData } from "../../../../contexts/TeacherDataContext";
import { useParams, useNavigate } from 'react-router-dom';

import SearchQuiz from "./components/SearchQuiz/SearchQuiz";
import PreviewQuiz from "./components/PreviewQuiz/PreviewQuiz";


const QuizzesPage = () => {
  const { quizzes } = useTeacherData();
  const { quizId } = useParams();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (quizId && quizzes.find(q => q.id === quizId)) {
      setSelectedId(quizId);
    } else if (!quizId && quizzes.length > 0 && !selectedId) {
      setSelectedId(quizzes[0].id);
    }
  }, [quizId, quizzes]);

  console.log(quizId);
  
  return (
    <div className={styles.QuizzesPageWrapper}>
      <SearchQuiz
        quizzes={quizzes}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      <PreviewQuiz quiz={quizzes.find((q) => q.id === selectedId)} />
    </div>
  );
};

export default QuizzesPage;
