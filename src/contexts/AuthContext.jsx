// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Asigură-te că ai configurat firebase
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Observăm schimbările de autentificare (dacă utilizatorul se loghează sau deconectează)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Setăm utilizatorul dacă este autentificat
    });
    return () => unsubscribe(); // Curățăm abonamentul când componenta se demontează
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Eroare logare:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Eroare deconectare:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
