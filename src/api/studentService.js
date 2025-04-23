// src/api/studentService.js
import { db } from "../firebase"; // importă instanța Firestore din firebase.js
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";

// Obține toate testele disponibile pentru studenți
export const getTestsForStudent = async () => {
  try {
    const snapshot = await getDocs(collection(db, "tests"));
    const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tests;
  } catch (error) {
    console.error("Eroare la obținerea testelor:", error);
    throw new Error("Nu s-au putut obține testele");
  }
};

// Salvează rezultatul unui student la un test
export const saveStudentResult = async (studentId, testId, answers) => {
  try {
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      [`results.${testId}`]: answers,
    });
    console.log("Rezultatul studentului a fost salvat");
  } catch (error) {
    console.error("Eroare la salvarea rezultatului:", error);
    throw new Error("Nu s-a putut salva rezultatul");
  }
};
