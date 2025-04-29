import React from "react";
import styles from './AboutPage.module.scss';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/authLayout'
const AboutPage = () => {
  return (
    <AuthLayout>
      <div className={styles.AboutPage}>
        <Link to="/auth">
          <button>Login</button>
        </Link>
      </div>
    </AuthLayout>
  )
}

export default AboutPage;