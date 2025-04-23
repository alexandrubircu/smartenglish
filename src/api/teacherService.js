// src/api/teacherService.js
import { db } from "../firebase"; // importă instanța Firestore din firebase.js
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, setDoc } from "firebase/firestore";

// Adaugă un test
export const createTest = async (testData) => {
  try {
    const docRef = await addDoc(collection(db, "tests"), testData);
    console.log("Test creat cu ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Eroare la crearea testului:", error);
    throw new Error("Nu s-a putut crea testul");
  }
};

// Obține toate testele pentru profesor
export const getTests = async () => {
  try {
    const snapshot = await getDocs(collection(db, "tests"));
    const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tests;
  } catch (error) {
    console.error("Eroare la obținerea testelor:", error);
    throw new Error("Nu s-au putut obține testele");
  }
};

// Șterge un test
export const deleteTest = async (testId) => {
  try {
    const testRef = doc(db, "tests", testId);
    await deleteDoc(testRef);
    console.log("Test șters cu succes");
  } catch (error) {
    console.error("Eroare la ștergerea testului:", error);
    throw new Error("Nu s-a putut șterge testul");
  }
};

// Adaugă scorul unui student
export const addStudentScore = async (studentId, testId, score) => {
  try {
    const studentRef = doc(db, "students", studentId);
    await setDoc(studentRef, { 
      scores: {
        [testId]: score,
      },
    }, { merge: true });
    console.log("Scor adăugat pentru student");
  } catch (error) {
    console.error("Eroare la adăugarea scorului:", error);
    throw new Error("Nu s-a putut adăuga scorul");
  }
};
