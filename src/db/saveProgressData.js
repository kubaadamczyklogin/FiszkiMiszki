import { db } from "./initDb.js";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default async function saveProgressDataFromDb(id, newProgressData) {

  const progressDataRef = collection(db, "users", id, "decks");
  const progressDataCardsRef = collection(
    db,
    "users",
    id,
    "decks",
    id,
    "cards"
  );

  await setDoc(doc(progressDataRef, id), {
    lastRepeat: newProgressData.lastRepeat,
  });

  const oldProgressDataCards = await getDocs(progressDataCardsRef);

  oldProgressDataCards.forEach(async (card) => {
    await deleteDoc(doc(db, "users", id, "decks", id, "cards", card.id));
  });

  newProgressData.cards.forEach(async (card) => {
    await setDoc(doc(progressDataCardsRef, card.id), {
      status: card.status,
      repeatDate: card.repeatDate,
    });
  });
}
