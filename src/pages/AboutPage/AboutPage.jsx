import styles from './AboutPage.module.scss';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/authLayout'
import aboutImg from '../../assets/images/aboutImg.jpeg'
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const pluses = [
  'Create quizzes in minutes, effortlessly;',
  'Instant results — no manual correction;',
  'Easy to use, ready for any classroom.',
];

const AboutPage = () => {

  return (
    <AuthLayout>
      <div className={styles.AboutPage}>
        <div className={styles.aboutHeder}>
          <p>SmartEnglish.</p>
          <div className={styles.hederFunctionals}>
            <button className={styles.ConButton}>Contact</button>
            <Link to="/auth">
              <button className={styles.LogButton}>Login</button>
            </Link>
          </div>
        </div>
        <div className={styles.aboutContentWrapp}>
          <div className={styles.infoBlock}>
            <h2>
              <span style={{ color: 'gold' }}>SmartEnglish</span>  – the app for clear tests and instant results
            </h2>
            <p>
              The purpose of the app is to provide a friendly and
              effective platform for learning English through interactive tests,
              adapted to any level. With SmartEnglish, every challenge becomes a
              learning opportunity.
            </p>
            <div className={styles.plusList}>
              <p>
                Why teachers love SmartEnglish:
              </p>
              <motion.ul
                variants={container}
                initial="hidden"
                animate="visible"
                style={{ listStyle: 'none', padding: 0 }}
              >
                {pluses.map((text, index) => (
                  <motion.li
                    key={index}
                    variants={item}
                    className={styles.plusItem}
                  >
                    {text}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
          <div className={styles.imgBlock}>
            <div className={styles.imgAbout}>
              <img src={aboutImg} alt='img' />
              <p>
                -The purpose of the SmartEnglish app is to help users
                learn and test their English skills in a fast, interactive,
                and accessible way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default AboutPage;