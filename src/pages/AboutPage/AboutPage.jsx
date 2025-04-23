import React from "react";
import styles from './AboutPage.module.scss';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return(
    <div className={styles.AboutPage}>
      <Link to="/auth">
        <button>Login</button>
      </Link>
    </div>
  )
}

export default AboutPage;