import initDb from './initDb.js';
import { doc, getDoc } from "firebase/firestore";

const db = initDb();

export default async function testR() {
  const docRef = doc(db, "cities", "LA");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}