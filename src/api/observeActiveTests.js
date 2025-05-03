import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const observeActiveTests = (studentId, callback) => {
  const studentRef = doc(db, "students", studentId);

  return onSnapshot(studentRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const quizzes = data.quizzes || {};
      callback(quizzes);
    }
  });
};
