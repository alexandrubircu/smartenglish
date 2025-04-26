import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc } from "firebase/firestore";

export const getStudentById = async (studentId) => {
  const studentRef = doc(db, "students", studentId);
  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    throw new Error("Studentul nu există.");
  }

  return { id: studentSnap.id, ...studentSnap.data() };
};


export const getQuizById = async (quizId) => {
  const quizRef = doc(db, "quizzes", quizId);
  const quizSnap = await getDoc(quizRef);

  if (!quizSnap.exists()) {
    throw new Error("Testul nu există.");
  }

  return { id: quizSnap.id, ...quizSnap.data() };
};

export const addFinalAnswersToStudent = async (studentId, finalAnswers, studentName) => {
  try {
    const studentRef = doc(db, "students", studentId);

    // 1. Salvăm testul în completedTests array
    await updateDoc(studentRef, {
      completedTests: arrayUnion(finalAnswers)
    });

    console.log("✅ Test salvat în completedTests.");

    // 2. Adăugăm notificarea într-o colecție SEPARATĂ: notifications/
    const notificationsRef = collection(db, "notifications");

    await addDoc(notificationsRef, {
      id: crypto.randomUUID(),
      studentId: studentId,
      type: "testCompleted",
      message: `"${studentName} a finisat testul ${finalAnswers.quizName}"`,
      timestamp: new Date().toISOString()
    });

    console.log("✅ Notificare adăugată în colecția globală notifications.");
  } catch (error) {
    console.error("❌ Eroare la salvarea testului sau notificării:", error);
  }
};