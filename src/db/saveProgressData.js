import { db } from "./initDb.js";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default async function saveProgressDataFromDb(id, newProgressData) {
  
  const progressDataSettingsRef = collection(
    db,
    "users",
    id,
    "decks",
    id,
    "settings"
  );

  const progressDataCardsRef = collection(
    db,
    "users",
    id,
    "decks",
    id,
    "cards"
  );

  await setDoc(
    doc(progressDataSettingsRef, "lastRepeat"),
    newProgressData.lastRepeatData
  );

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
