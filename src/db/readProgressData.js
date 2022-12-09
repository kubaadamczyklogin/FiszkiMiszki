import { db } from "./initDb.js";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";

export default async function readProgressDataFromDb(id) {
  let resultObject = {
    lastRepeatData: {
      newCards: 0,
      allCards: 0,
      date: 1,
    },
    cards: [],
  };
  let cards = [];

  const progressDatalastRepeatRef = doc(
    db,
    "users",
    id,
    "decks",
    id,
    "settings",
    "lastRepeat"
  );

  const progressDataCardsRef = collection(
    db,
    "users",
    id,
    "decks",
    id,
    "cards"
  );

  const lastRepeatDataFromDb = await getDoc(progressDatalastRepeatRef);

  if (lastRepeatDataFromDb.exists()) {
    resultObject.lastRepeatData = {
      newCards: lastRepeatDataFromDb.data().newCards,
      allCards: lastRepeatDataFromDb.data().allCards,
      date: lastRepeatDataFromDb.data().date,
    };
  }

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
