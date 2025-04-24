import React from "react";
import { Link } from "react-router-dom";
import styles from './DesktopMenu.module.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

const DesktopMenu = () => {
  return (
    <div className={styles.menuWrapper}>
      <div className={styles.content}>
        <h3 className={styles.logo}>🎓 SmartEnglish</h3>
        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.link}>
            <DashboardIcon className={styles.icon} />
            <span>Dashboard</span>
          </Link>
          <Link to="/create-test" className={styles.link}>
            <QuizIcon className={styles.icon} />
            <span>Create Test</span>
          </Link>
          <Link to="/dashboard/students" className={styles.link}>
            <GroupIcon className={styles.icon} />
            <span>Students</span>
          </Link>
          <Link to="/results" className={styles.link}>
            <BarChartIcon className={styles.icon} />
            <span>Results</span>
          </Link>
          <Link to="/settings" className={styles.link}>
            <SettingsIcon className={styles.icon} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
      <div className={styles.infoWrapper}>
        <p>App for managing and testing students.</p>
      </div>
    </div>
  );
};

export default DesktopMenu;
