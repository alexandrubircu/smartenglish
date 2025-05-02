import React, { useState, useEffect, useMemo } from "react";
import styles from "./StudentsPage.module.scss";
import StudentsSidebar from "./components/StudentsSidebar/StudentsSidebar";
import StudentProfile from "./components/StudentProfile/StudentProfile";
import { useTeacherData } from "../../../../contexts/TeacherDataContext";

const StudentsPage = () => {
  const { students = [], quizzes, loading, refresh, professorId } = useTeacherData();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (students.length > 0 && !selectedId) {
      setSelectedId(students[0].id);
    }
  }, [students, selectedId]);

  const selected = useMemo(() => {
    return students.find((s) => s.id === selectedId) || null;
  }, [students, selectedId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <StudentsSidebar
        students={students}
        selectedId={selectedId}
        onSelectStudent={setSelectedId}
      />
      {selected && (
        <StudentProfile
          professorId={professorId}
          student={selected}
          quizzes={quizzes}
          onDeleteStudent={async (deletedId) => {
            await refresh();
            const remaining = students.filter((s) => s.id !== deletedId);
            if (remaining.length > 0) {
              setSelectedId(remaining[0].id);
            } else {
              setSelectedId(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default StudentsPage;
