import { readDeckFromFile, readProgressDataFromFile } from "./FilesEditor.js";

// statusy:
// 0 - karta wybrana do powtórki, której jeszcze się nie nauczyliśmy
// 1 - karta do powtórki jutro
// 2 - karta do powtóki za 3 dni
// 3 - karta do powrórki za tydzień (7) dni
// 4 - karta do powrórki za miesiąć (30) dni
// 10 - karta nowa, jeszcze nie używana
// 20 - karta którą użytkownik już poznał

const day = 86400000;

export async function prepareDeckToLern(user, name) {
  const cardsLimit = 50;
  const newCardsLimit = 10;

  let deck,
    progressData,
    progressCards,
    deckToLern = [],
    deckNotToLearn = [];

  let today = new Date().setHours(0, 0, 0, 0);

  deck = await readDeckFromFile(name);
  deck = JSON.parse(deck);
  progressData = await readProgressDataFromFile(user, name);
  progressData = JSON.parse(progressData);

  // do testowania
  //   progressData = {
  //     lastRepeat: today - day,
  //     cards: [
  //       { id: 0, repeatDate: today, status: 4 },
  //       { id: 1, repeatDate: today, status: 3 },
  //       { id: 2, repeatDate: today, status: 2 },
  //       { id: 3, repeatDate: today, status: 1 },
  //       { id: 4, repeatDate: today, status: 0 },
  //     ],
  //   };

  //   console.log("progres z serwera");
  //   console.log(progressData);
  //   console.table(progressData.cards);

  if (progressData.lastRepeat < today) {
    // synchronizacja danych z talią
    deck = deck.map((deckItem) => {
      const progressDataItem = progressData.cards.find(
        (progressItem) => progressItem.id === deckItem.id
      );

      if (typeof progressDataItem === "undefined") {
        return { ...deckItem, status: 10, repeatDate: 0 };
      } else {
        return { ...progressDataItem, ...deckItem };
      }
    });

    //sortowanie talii
    deck.sort((a, b) => {
      return a.status - b.status;
    });

    // segregacja talii
    let cardsQuantity = 0;
    let newCardsQuantity = 0;

    deck.forEach((card) => {
      if (card.repeatDate <= today) {
        if (card.status < 10) {
          if (cardsQuantity < cardsLimit) {
            deckToLern.push(card);
            cardsQuantity++;
          } else {
            deckNotToLearn.push(card);
          }
        } else if (card.status === 10) {
          if (cardsQuantity < cardsLimit && newCardsQuantity < newCardsLimit) {
            deckToLern.push(card);
            cardsQuantity++;
            newCardsQuantity++;
          } else {
            deckNotToLearn.push(card);
          }
        } else {
          deckNotToLearn.push(card);
        }
      } else {
        deckNotToLearn.push(card);
      }
    });

    //tasowanie talii
    let shufflingDeck = deckToLern,
      currentIndex = shufflingDeck.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shufflingDeck[currentIndex], shufflingDeck[randomIndex]] = [
        shufflingDeck[randomIndex],
        shufflingDeck[currentIndex],
      ];
    }

    deckToLern = shufflingDeck;
  } else {
    deckToLern = [];
    deckNotToLearn = [];
  }

  return [deckToLern, deckNotToLearn];
}
