import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { createStudent } from "../factories/userFactory";

// Fetch toți studenții din colecția "students"
export const fetchAllStudents = async () => {
  const snapshot = await getDocs(collection(db, "students"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch toate testele (quizzes)
export const fetchAllQuizzes = async () => {
  const snapshot = await getDocs(collection(db, "quizzes"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// crearea studentului.
export const createStudentInFirestore = async (professorId, name, email, quizId = null, quizName ) => {
  const type = quizId ? "with-test" : "basic";
  const student = createStudent(type, name, email, professorId, quizId, quizName);

  const docRef = await addDoc(collection(db, "students"), student);
  return { id: docRef.id, ...student };
};

// Creare test (quiz) nou
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
