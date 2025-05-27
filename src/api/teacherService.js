import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";
import { createStudent } from "../factories/userFactory";
import { v4 as uuidv4 } from "uuid";

export const fetchAllStudents = async () => {
  const snapshot = await getDocs(collection(db, "students"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchAllQuizzes = async () => {
  const snapshot = await getDocs(collection(db, "quizzes"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getQuizById = async (quizId) => {
  const quizRef = doc(db, "quizzes", quizId);
  const quizSnap = await getDoc(quizRef);

  if (!quizSnap.exists()) {
    throw new Error("Testul nu există.");
  }

  return { id: quizSnap.id, ...quizSnap.data() };
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

export const assignQuizToStudent = async (studentId, assignment) => {
  const assignedQuizId = uuidv4();

  const studentRef = doc(db, "students", studentId);

  await updateDoc(studentRef, {
    [`quizzes.${assignedQuizId}`]: {
      ...assignment,
      timestamp: new Date().toISOString()
    }
  });

  return assignedQuizId;
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

export const deleteStudentById = async (studentId) => {
  const notificationsRef = collection(db, "notifications");
  const q = query(notificationsRef, where("studentId", "==", studentId));
  const snapshot = await getDocs(q);

  const deleteNotifPromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "notifications", docSnap.id))
  );
  await Promise.all(deleteNotifPromises);

  const studentRef = doc(db, "students", studentId);
  await deleteDoc(studentRef);
};

export const deleteCompletedTest = async (studentId, testId) => {
  const studentRef = doc(db, "students", studentId);

  await updateDoc(studentRef, {
    [`completedTests.${testId}`]: deleteField()
  });

  const notificationsRef = collection(db, "notifications");
  const q = query(notificationsRef, where("completedTestId", "==", testId));
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "notifications", docSnap.id))
  );

  await Promise.all(deletePromises);
};


export const deleteActiveTest = async (studentId, quizAssignId) => {
  const studentRef = doc(db, "students", studentId);
  await updateDoc(studentRef, {
    [`quizzes.${quizAssignId}`]: deleteField()
  });
};

export const deleteQuizById = async (quizId) => {
  const quizRef = doc(db, "quizzes", quizId);
  await deleteDoc(quizRef);
};