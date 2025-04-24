import React from "react";
import styles from './style.module.scss'
import DesktopMenu from './components/DesktopMenu/DesktopMenu'
import DashboardPanel from './components/DashboardPanel/DashboardPanel'

const TeacherPage = () => {
  return(
    <div className={styles.wrapper}>
      <DesktopMenu />
      <DashboardPanel />
    </div>
  );
}

export default TeacherPage;