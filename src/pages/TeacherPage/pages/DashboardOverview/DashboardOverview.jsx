import React from "react";
import styles from './DashboardOverview.module.scss';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useTeacherData } from "../../../../contexts/TeacherDataContext";

const DashboardOverview = () => {
  const { students, quizzes } = useTeacherData();

  const activeStudents = students.length;
  const totalGroups = new Set(students.map(s => s.group)).size;
  const activeQuizzes = quizzes.filter(q => !q.completed).length;

  const testsPerDay = [
    { day: "Luni", tests: 0 },
    { day: "Marți", tests: 0 },
    { day: "Miercuri", tests: 0 },
    { day: "Joi", tests: 0 },
    { day: "Vineri", tests: 0 },
  ];

  students.forEach(student => {
    const completedTests = student.completedTests || {};
    Object.values(completedTests).forEach(test => {
      if (!test.completedAt) return;
      const date = new Date(test.completedAt);
      const day = date.getDay();
      if (day >= 1 && day <= 5) {
        testsPerDay[day - 1].tests += 1;
      }
    });
  });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Statistici Generale</h2>

      <div className={styles.stats}>
        <div className={styles.card}>
          <h3>Studenți activi</h3>
          <p>{activeStudents}</p>
        </div>
        <div className={styles.card}>
          <h3>Grupe totale</h3>
          <p>{totalGroups}</p>
        </div>
        <div className={styles.card}>
          <h3>Teste curente</h3>
          <p>{activeQuizzes}</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Teste efectuate pe zile</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={testsPerDay}>
            <Line type="monotone" dataKey="tests" stroke="#f5b700" strokeWidth={3} />
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOverview;
