import { db } from "./initDb.js";
import {
  collection,  
  getDocs 
} from "firebase/firestore";

export default async function readDeckFromDb(id) {
  let deckRef;
  if (typeof id === "undefined") {
    deckRef = collection(db, "defaultDeck");
  } else {
    deckRef = collection(db, "decks", "users", id);
  }

  let deck = [];

  const deckFromDB = await getDocs(deckRef);
  deckFromDB.forEach((card) => {
    deck.push({
      id: card.id,
      pl: card.data().pl,
      en: card.data().en,
    });
  });

  return deck;
}