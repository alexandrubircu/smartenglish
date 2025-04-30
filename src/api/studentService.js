import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteField, collection, addDoc } from "firebase/firestore";

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

export const addFinalAnswersToStudent = async (studentId, finalAnswers, studentName, assignedQuizId) => {
  try {
    const studentRef = doc(db, "students", studentId);

    const completedTestId = crypto.randomUUID();

    await updateDoc(studentRef, {
      [`completedTests.${completedTestId}`]: {
        ...finalAnswers,
        completedAt: new Date().toISOString()
      }
    });

    console.log(`✅ Test salvat în completedTests cu ID: ${completedTestId}`);

    const notificationsRef = collection(db, "notifications");

    await addDoc(notificationsRef, {
      id: crypto.randomUUID(),
      studentId: studentId,
      assignedBy: finalAnswers.assignedBy,
      type: "testCompleted",
      message: `"${studentName} a finisat testul ${finalAnswers.quizName}"`,
      timestamp: new Date().toISOString(),
      read: false
    });

    await updateDoc(studentRef, {
      [`quizzes.${assignedQuizId}`]: deleteField()
    });

    console.log("✅ Notificare adăugată în colecția globală notifications.");
  } catch (error) {
    console.error("❌ Eroare la salvarea testului sau notificării:", error);
  }
};