import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TeacherDataProvider } from './contexts/TeacherDataContext';
import { StudentDataProvider } from './contexts/StudentDataContext';
import AboutPage from './pages/AboutPage/AboutPage';
import AuthPage from './pages/AuthPage/AuthPage';
import TeacherPage from './pages/TeacherPage';
import StudentTestPage from './pages/StudentTestPage/StudentTestPage';

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard/*"
            element={
              <TeacherDataProvider>
                <TeacherPage />
              </TeacherDataProvider>
            }
          />
          <Route
            path="/start-test/:studentId/:assignedQuizId"
            element={
              <StudentDataProvider>
                <StudentTestPage />
              </StudentDataProvider>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
