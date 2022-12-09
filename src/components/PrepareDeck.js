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
  testProgressData,
  extraLerning
) {
  const cardsLimit = 30;
  const newCardsLimit = 10;
  let deck,
    progressData,
    deckToLern = [],
    deckNotToLearn = [],
    deckLength = [],
    repeatButtons = false,
    exception = false,
    cardsQuantity = 0,
    newCardsQuantity = 0,
    extraRepeat = {
      newCards: 0,
      toRepeatCards: 0,
      tommorowCards: 0,
    };

  let today = new Date().setHours(0, 0, 0, 0);

  if (extraLerning === "tomorrow") {
    today = today + day;
  }

  if (guest) {
    today = testToday;
    deck = testDeck;
    progressData = testProgressData
      ? testProgressData
      : {
          lastRepeatData: {
            allCards: 0,
            date: today - day,
            newCards: 0,
          },
          cards: [],
        };
  } else {
    deck = await readDeckFromDb(user.uid);
    progressData = await readProgressDataFromDb(user.uid);
  }

  if (
    progressData.lastRepeatData.date >= today &&
    extraLerning !== "restart-limits"
  ) {
    cardsQuantity = progressData.lastRepeatData.allCards;
    newCardsQuantity = progressData.lastRepeatData.newCards;
  }

  if (deck.length === 0) {
    exception =
      'Talia jest pusta. Dodaj karty wybierając w menu "edytuj talie"';

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

    deck.forEach((card) => {
      if (card.repeatDate <= today) {
        if (card.status < 10) {
          if (cardsQuantity < cardsLimit) {
            deckToLern.push(card);
            cardsQuantity++;
          } else {
            extraRepeat.toRepeatCards++;
            deckNotToLearn.push(card);
          }
        } else if (card.status === 10) {
          if (cardsQuantity < cardsLimit && newCardsQuantity < newCardsLimit) {
            deckToLern.push(card);
            cardsQuantity++;
            newCardsQuantity++;
          } else {
            extraRepeat.newCards++;
            deckNotToLearn.push(card);
          }
        } else {
          deckNotToLearn.push(card);
        }
      } else {
        deckNotToLearn.push(card);
        if (card.repeatDate <= today + day) {
          extraRepeat.tommorowCards++;
        }
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

    let temporaryCardsCounter = 0;

    if (extraRepeat.newCards > 0 || extraRepeat.toRepeatCards > 0) {
      if (!repeatButtons) repeatButtons = {};

      temporaryCardsCounter =
        (extraRepeat.newCards > newCardsLimit
          ? newCardsLimit
          : extraRepeat.newCards) + extraRepeat.toRepeatCards;
      temporaryCardsCounter =
        temporaryCardsCounter > cardsLimit ? cardsLimit : temporaryCardsCounter;
      repeatButtons.crossLimits = temporaryCardsCounter;
    }

    if (extraRepeat.tommorowCards) {
      if (!repeatButtons) repeatButtons = {};

      temporaryCardsCounter = temporaryCardsCounter + extraRepeat.tommorowCards;
      temporaryCardsCounter =
        temporaryCardsCounter > cardsLimit ? cardsLimit : temporaryCardsCounter;
      repeatButtons.tomorrow = temporaryCardsCounter;
    }
  }

  return [deckToLern, deckNotToLearn, exception, deckLength, repeatButtons];
}
