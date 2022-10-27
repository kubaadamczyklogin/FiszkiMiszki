import { db } from "./initDb.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default async function saveDeck(id, newDeck) {
  const deckRef = collection(db, "decks", "users", id);

  const oldDeck = await getDocs(deckRef);

  oldDeck.forEach(async (card) => {
    const del = await deleteDoc(doc(db, "decks", "users", id, card.id));
  });

  newDeck.forEach(async (card) => {
    if (isNaN(card.id)) {
      await setDoc(doc(deckRef, card.id), {
        en: card.en,
        pl: card.pl,
      });
    } else {
      await setDoc(doc(deckRef), {
        en: card.en,
        pl: card.pl,
      });
    }
  });
}
