import React from "react";
import styles from './DashboardOverview.module.scss'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Luni", tests: 20 },
  { day: "Marți", tests: 10 },
  { day: "Miercuri", tests: 25 },
  { day: "Joi", tests: 18 },
  { day: "Vineri", tests: 30 },
];

const DashboardOverview = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Statistici Generale</h2>

      <div className={styles.stats}>
        <div className={styles.card}>
          <h3>Studenți activi</h3>
          <p>124</p>
        </div>
        <div className={styles.card}>
          <h3>Grupe totale</h3>
          <p>8</p>
        </div>
        <div className={styles.card}>
          <h3>Teste curente</h3>
          <p>15</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Teste efectuate pe zile</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
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
