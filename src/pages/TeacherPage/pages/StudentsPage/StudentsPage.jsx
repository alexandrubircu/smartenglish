// StudentsPage.jsx
import React, { useState } from "react";
import styles from "./StudentsPage.module.scss";
import StudentsSidebar from "./components/StudentsSidebar/StudentsSidebar";
import StudentProfile from "./components/StudentProfile/StudentProfile";

const studentsData = [
  { id: 1, name: "Ion Popescu", email: "ion@email.com", group: "A1", tests: ["Test vocabular", "Test gramatică"] },
  { id: 2, name: "Ana Georgescu", email: "ana@email.com", group: "B1", tests: ["Test ascultare"] },
  { id: 3, name: "Vasile Roman", email: "vasile@email.com", group: "", tests: [] },
];

const StudentsPage = () => {
  const [selectedId, setSelectedId] = useState(studentsData[0].id);
  const [selectedTest, setSelectedTest] = useState(null);

  const selected = studentsData.find((s) => s.id === selectedId);

  return (
    <div className={styles.wrapper}>
      <StudentsSidebar
        students={studentsData}
        selectedId={selectedId}
        onSelectStudent={setSelectedId}
      />
      <StudentProfile
        student={selected}
        selectedTest={selectedTest}
        onSelectTest={setSelectedTest}
        onClearTest={() => setSelectedTest(null)}
      />
    </div>
  );
};

export default StudentsPage;
