import initDb from "./initDb.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const db = initDb();

const deckRef = collection(db, "defaultDeck");

export default async function readDeck() {
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

//   await setDoc(doc(deckRef), {
//     en: "cat",
//     pl: "kot",
//   });
//   await setDoc(doc(deckRef), {
//     en: "dog",
//     pl: "pies",
//   });
//   await setDoc(doc(deckRef), {
//     en: "bear",
//     pl: "niedźwiedź",
//   });
//   await setDoc(doc(deckRef), {
//     en: "sneak",
//     pl: "wąż",
//   });
//   await setDoc(doc(deckRef), {
//     en: "bat",
//     pl: "nietoperz",
//   });

//   all.forEach((avv) => {
//     deleteDoc(doc(db, "defaultDeck", avv));
//   });
