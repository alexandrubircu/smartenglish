import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const observeNotifications = (teacherId, callback) => {
  const notificationsRef = collection(db, "notifications");

  const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
    const filtered = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(notif => notif.assignedBy === teacherId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    callback(filtered);
  });

  return unsubscribe;
};
