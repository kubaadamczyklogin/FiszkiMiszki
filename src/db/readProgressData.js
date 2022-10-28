import { db } from "./initDb.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default async function readProgressDataFromDb(id) {
  //   let deckRef = collection(db, "decks", "users", id);
  //   let progressDataRef = collection(db, "users", id, id);
  //   let deck = [];
  //   const deckFromDB = await getDocs(deckRef);
  //   deckFromDB.forEach((card) => {
  //     deck.push({
  //       id: card.id,
  //       pl: card.data().pl,
  //       en: card.data().en,
  //     });
  //   });
  //   return deck;
}

//  await setDoc(doc(deckRef), {
//     en: "water",
//     pl: "woda",
//   });
//   await setDoc(doc(deckRef), {
//     en: "ice",
//     pl: "lód",
//   });

// await setDoc(doc(deckRef2), {
//   en: "bear",
//   pl: "niedźwiedź",
// });
// await setDoc(doc(deckRef), {
//   en: "sneak",
//   pl: "wąż",
// });
// await setDoc(doc(deckRef), {
//   en: "bat",
//   pl: "nietoperz",
// });

//   all.forEach((avv) => {
//     deleteDoc(doc(db, "defaultDeck", avv));
//   });
