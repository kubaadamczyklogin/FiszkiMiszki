import "./../css/lerning.css";
import { useState, useEffect } from "react";
import { prepareDeckToLern } from "./PrepareDeck.js";
import saveProgressDataFromDb from "./../db/saveProgressData.js";

// statusy:
// 0 - karta wybrana do powtórki, której jeszcze się nie nauczyliśmy
// 1 - karta do powtórki jutro
// 2 - karta do powtóki za 3 dni
// 3 - karta do powrórki za tydzień (7) dni
// 4 - karta do powrórki za miesiąć (30) dni
// 10 - karta nowa, jeszcze nie używana
// 20 - karta którą użytkownik już poznał

const day = 86400000;
const nextRepeatDatePerStatus = [day, day, day * 3, day * 7, day * 30];

export default function Lern(props) {
  const [deckToLern, setDeckToLern] = useState(false);
  const [deckNotToLern, setDeckNotToLern] = useState(false);
  const [repeatCounter, setRepeatCounter] = useState(0);
  const [toRepeat, setToRepeat] = useState("");
  const [deckLenght, setDeckLenght] = useState(false);
  const [nextRepeatButtons, setNextRepeatButtons] = useState(false);

  useEffect(() => {
    startLerning();
  }, []);

  function startLerning(extraLerning) {
    prepareDeckToLern(
      props.guest,
      props.user,
      props.testToday,
      props.testDeck,
      props.testProgressData,
      extraLerning
    ).then(
      (resolve) => {
        if (resolve[4]) {
          setNextRepeatButtons(resolve[4]);
        } else if (resolve[2]) {
          props.openStatement({
            status: "success",
            text: resolve[2],
          });
          props.choosePage(false);
        } else {
          setDeckToLern(resolve[0]);
          setDeckNotToLern(resolve[1]);
          setRepeatCounter(0);
          setToRepeat([]);
          setDeckLenght(resolve[3]);
        }
      },
      (error) => {
        props.openStatement({
          status: "error",
          text: error,
        });
        props.choosePage(false);
      }
    );
  }

  function saveProgress(newToRepeat) {
    const progressDataCardsRepeated = deckToLern.map((item) => {
      let cardData = { id: item.id };
      let newStatus = 0;

      if (!newToRepeat.includes(item.id)) {
        if (item.status < 4) {
          newStatus = ++item.status;
        } else if (item.status === 4) {
          newStatus = 20;
        } else {
          newStatus = 1;
        }
      }
      cardData.status = newStatus;
      if (newStatus !== 20) {
        cardData.repeatDate =
          nextRepeatDatePerStatus[newStatus] + props.testToday;
      } else {
        cardData.repeatDate = 0;
      }

      return cardData;
    });

    const progressDataCardsRest = deckNotToLern.map((item) => {
      return {
        id: item.id,
        repeatDate: item.repeatDate,
        status: item.status,
      };
    });

    const progressDataCards = [
      ...progressDataCardsRepeated,
      ...progressDataCardsRest,
    ];

    progressDataCards.sort((a, b) => {
      return a.id - b.id;
    });

    deckLenght;

    const newlastRepeatData = {
      newCards: deckLenght.newCards,
      allCards: deckLenght.allCards,
      date: props.testToday,
    };

    const progressData = {
      lastRepeatData: newlastRepeatData,
      cards: progressDataCards,
    };

    if (props.guest) {
      props.saveTestProgressData(progressData);
    } else {
      saveProgressDataFromDb(props.user.uid, progressData);
    }
  }

  function endRound(newToRepeat) {
    props.openStatement({
      status: "success",
      text: `Dziś przerobiłeś ${deckToLern.length} słów, nie wiedziałeś ${newToRepeat.length}`,
    });

    if (repeatCounter === 0) {
      saveProgress(newToRepeat);
    }

    if (newToRepeat.length === 0 || repeatCounter === 3) {
      props.choosePage(false);
    } else {
      setToRepeat(newToRepeat);
      setRepeatCounter((prev) => ++prev);
    }
  }

  if (deckToLern) {
    const deck =
      toRepeat.length > 0
        ? deckToLern.filter((item) => {
            return toRepeat.includes(item.id);
          })
        : deckToLern;
    return (
      <LerningRound deck={deck} deckLength={deck.length} endRound={endRound} />
    );
  } else if (nextRepeatButtons) {
    return (
      <LerningNextRepeatButtons
        nextRepeatButtons={nextRepeatButtons}
        startLerning={startLerning}
      />
    );
  } else {
    return "loading...";
  }
}

function LerningRound(props) {
  const [counter, setCounter] = useState(0);
  const [frontSide, setFrontSide] = useState(true);
  const [toRepeat, setToRepeat] = useState([]);

  const { deck, deckLength, endRound } = props;

  function rotateCard() {
    setFrontSide(false);
  }

  function nextCard(addCardToRepeat) {
    const newCounter = counter + 1;
    let newToRepeatArray = toRepeat;
    setFrontSide(true);

    if (addCardToRepeat) {
      newToRepeatArray.push(deck[counter].id);
    }

    if (newCounter < deckLength) {
      setCounter(newCounter);
      setToRepeat(newToRepeatArray);
    } else {
      setCounter(0);
      setToRepeat([]);
      endRound(newToRepeatArray);
    }
  }

  return (
    <div className="lerning page">
      <div className="cont card-container">
        <LerningCard frontSide={frontSide} data={deck[counter]} />
      </div>
      <LerningButtons
        frontSide={frontSide}
        rotateCard={rotateCard}
        nextCard={nextCard}
      />
    </div>
  );
}

function LerningCard(props) {
  if (props.frontSide) {
    return <CardFront pl={props.data.pl} />;
  } else {
    return <CardBack en={props.data.en} />;
  }
}

function CardFront(props) {
  return <div className="lerning-card front">{props.pl}</div>;
}

function CardBack(props) {
  return <div className="lerning-card back">{props.en}</div>;
}

function LerningButtons(props) {
  const { frontSide, rotateCard, nextCard } = props;

  return (
    <div className="lerning-buttons bottom-buttons">
      <div className="cont">
        {frontSide ? (
          <button className="blue" onClick={rotateCard}>
            sprawdź
          </button>
        ) : (
          <>
            <button
              className="red"
              onClick={() => {
                nextCard(true);
              }}
            >
              powtórzę
            </button>
            <button
              className="green"
              onClick={() => {
                nextCard(false);
              }}
            >
              wiedziałem
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LerningNextRepeatButtons(props) {
  return (
    <div className="lerning next page">
      <div className="cont">
        <h2>Na dziś niema już żadnych kart!</h2>
        <p>Możesz jednak skożystać z dodatkowej powtórki:</p>
        {props.nextRepeatButtons.crossLimits && (
          <>
            <button
              className="blue"
              onClick={() => {
                props.startLerning("restart-limits");
              }}
            >
              Wyzeruj limity ({props.nextRepeatButtons.crossLimits})
            </button>
            <p>
              Powtórz karty które nie zmieściły się ze zględu na dzienne limity
            </p>
          </>
        )}
        {props.nextRepeatButtons.tomorrow && (
          <>
            <button
              className="blue"
              onClick={() => {
                props.startLerning("tomorrow");
              }}
            >
              Jutrzejsze karty ({props.nextRepeatButtons.tomorrow})
            </button>
            <p>
              Nie jest to do końca dobre ze względu na przyswajanie wiedzy, ale
              warto skorzystać z tej opcji jeśli masz dziś więcej czasu niż
              jutro.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
