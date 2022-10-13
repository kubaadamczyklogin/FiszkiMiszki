import "./../css/lerning.css";
import { useState, useEffect } from "react";
import { saveProgressDataToFile } from "./FilesEditor.js";
import { prepareDeckToLern } from "./PrepareDeck.js";

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

  useEffect(() => {
    prepareDeckToLern("kuba", "test").then(
      (resolve) => {
        // console.log("spreparowana talia");
        // console.table(resolve[0]);
        if (resolve[0].length !== 0) {
          setDeckToLern(resolve[0]);
          setDeckNotToLern(resolve[1]);
          setRepeatCounter(0);
          setToRepeat([]);
        } else {
          props.openStatement({
            status: "success",
            text: "Na dziś niemasz żadnych słów w tej talii. W przyszłości będzie możliwość powtarzania jutrzejszej porcji słów",
          });
          props.choosePage(false);
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
  }, []);

  function saveProgress(newToRepeat) {
    const today = new Date().setHours(0, 0, 0, 0);

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
        cardData.repeatDate = nextRepeatDatePerStatus[newStatus] + today;
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

    const progressData = {
      lastRepeat: today,
      cards: progressDataCards,
    };

    // console.log("progres do pliku");
    // console.table(progressDataCards);
    // console.log(progressData);
    saveProgressDataToFile("kuba", "test", progressData);
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
    <div className="lerning">
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
