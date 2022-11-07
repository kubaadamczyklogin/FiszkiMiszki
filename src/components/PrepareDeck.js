import readDeckFromDb from "./../db/readDeck.js";
import readProgressDataFromDb from "./../db/readProgressData.js";

// statusy:
// 0 - karta wybrana do powtórki, której jeszcze się nie nauczyliśmy
// 1 - karta do powtórki jutro
// 2 - karta do powtóki za 3 dni
// 3 - karta do powrórki za tydzień (7) dni
// 4 - karta do powrórki za miesiąć (30) dni
// 10 - karta nowa, jeszcze nie używana
// 20 - karta którą użytkownik już poznał

const day = 86400000;

export async function prepareDeckToLern(
  guest,
  user,
  testToday,
  testDeck,
  testProgressData
) {
  const cardsLimit = 50;
  const newCardsLimit = 10;
  let deck,
    progressData,
    deckToLern = [],
    deckNotToLearn = [],
    deckLength = [],
    exception = false;

  let today = testToday;

  if (guest) {
    deck = testDeck;

    progressData = testProgressData
      ? testProgressData
      : { lastRepeat: today - day, cards: [] };
  } else {
    deck = await readDeckFromDb(user.uid);
    progressData = await readProgressDataFromDb(user.uid);

    console.log(progressData.lastRepeatData);
  }

  if (deck.length === 0) {
    exception =
      'Talia jest pusta. Dodaj karty wybierając w menu "edytuj talie"';

    return [deckToLern, deckNotToLearn, exception];
  } else if (progressData.lastRepeat >= today) {
    exception = "Dziś już się uczyłeś, zajrzyj tu jutro.";

    return [deckToLern, deckNotToLearn, exception];
  } else {
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
    deckLength = {
      newCards: newCardsQuantity,
      allCards: cardsQuantity,
    };
  }

  if (deckToLern.length === 0) {
    exception = "Na dziś niemasz żadnych słów w tej talii.";
  }

  return [deckToLern, deckNotToLearn, exception, deckLength];
}
