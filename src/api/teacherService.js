import { addDoc, collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { createStudent } from "../factories/userFactory";



export const fetchAllStudents = async () => {
  const snapshot = await getDocs(collection(db, "students"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const fetchAllQuizzes = async () => {
  const snapshot = await getDocs(collection(db, "quizzes"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const createStudentInFirestore = async (professorId, name, email, quizId = null, quizName = null) => {
  const type = quizId ? "with-test" : "basic";

  const assignedQuizId = quizId ? crypto.randomUUID() : null;

  const student = createStudent(type, name, email, professorId, quizId, quizName, assignedQuizId);

  const docRef = await addDoc(collection(db, "students"), student);

  return {
    student: { id: docRef.id, ...student },
    assignedQuizId
  };
};

export const createQuizInFirestore = async (professorId, quizData) => {
  const quiz = {
    title: quizData.quizName,
    createdBy: professorId,
    createdAt: new Date().toISOString(),
    questions: quizData.questions,
  };

  const docRef = await addDoc(collection(db, "quizzes"), quiz);
  return { id: docRef.id, ...quiz };
};

export const fetchCompletedTestByStudent = async (studentId, completedTestId) => {
  const studentRef = doc(db, "students", studentId);
  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    throw new Error("Studentul nu există.");
  }

  const data = studentSnap.data();
  const test = data.completedTests?.[completedTestId];

  if (!test) {
    throw new Error("Testul nu a fost găsit la acest student.");
  }

  return {
    ...test,
    studentName: data.name
  };
};

export const markNotificationAsRead = async (notifId) => {
  const notifRef = doc(db, "notifications", notifId);
  await updateDoc(notifRef, { read: true });
};