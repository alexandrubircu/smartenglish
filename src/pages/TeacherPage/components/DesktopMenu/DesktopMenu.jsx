import React from "react";
import { Link } from "react-router-dom";
import styles from './DesktopMenu.module.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
const DesktopMenu = () => {
  return (
    <div className={styles.menuWrapper}>
      <div className={styles.content}>
        <h3 className={styles.logo}>SmartEnglish.</h3>
        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.link}>
            <DashboardIcon className={styles.icon} />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard/students" className={styles.link}>
            <GroupIcon className={styles.icon} />
            <span>Students</span>
          </Link>
          <Link to="/dashboard/quizprev" className={styles.link}>
            <FolderIcon className={styles.icon} />
            <span>Quizzes</span>
          </Link>
          <Link to="/dashboard/createtest" className={styles.link}>
            <NoteAddIcon className={styles.icon} />
            <span>Create Test</span>
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
