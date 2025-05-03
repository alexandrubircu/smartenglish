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
  const activeQuizzes = quizzes.filter(q => !q.completed).length;

  const testsPerDay = [
    { day: "Sunday", tests: 0 },
    { day: "Monday", tests: 0 },
    { day: "Tuesday", tests: 0 },
    { day: "Wednesday", tests: 0 },
    { day: "Thursday", tests: 0 },
    { day: "Friday", tests: 0 },
    { day: "Saturday", tests: 0 },
  ];

  students.forEach(student => {
    const completedTests = student.completedTests || {};
    Object.values(completedTests).forEach(test => {
      if (!test.completedAt) return;
      const date = new Date(test.completedAt);
      const day = date.getDay();
      testsPerDay[day].tests += 1;
    });
  });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>General Statistics</h2>

      <div className={styles.stats}>
        <div className={styles.card}>
          <h3>Active Students</h3>
          <p>{activeStudents}</p>
        </div>
        <div className={styles.card}>
          <h3>Ongoing Tests</h3>
          <p>{activeQuizzes}</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Tests Completed Per Day</h3>
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
