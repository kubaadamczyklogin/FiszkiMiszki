import { db } from "./initDb.js";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";

export default async function readProgressDataFromDb(id) {
  let resultObject = { lastRepeat: 1, cards: [] };
  let cards = [];

  const progressDataRef = doc(
    db,
    "users",
    id,
    "decks",
    id // nazwa talii
  );

  const progressDataCardsRef = collection(
    db,
    "users",
    id,
    "decks",
    id,
    "cards"
  );

  const progressDataFromDb = await getDoc(progressDataRef);
  resultObject.lastRepeat = progressDataFromDb.data().lastRepeat;

  const progressDataCardsFromDb = await getDocs(progressDataCardsRef);
  progressDataCardsFromDb.forEach((card) => {
    cards.push({
      id: card.id,
      status: card.data().status,
      repeatDate: card.data().repeatDate,
    });
  });
  resultObject.cards = cards;

  return resultObject;
}
