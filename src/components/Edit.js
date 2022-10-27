import "./../css/cardList.css";
import { useState, useRef, useEffect } from "react";
import UnpackedCard from "./UnpackedCard.js";
import EditableCard from "./EditableCard.js";
import SaveButton from "./SaveButton.js";
import readDeck from "./../db/readDeck.js";
// import {
//   saveDeckToFile,
//   saveProgressDataToFile,
//   readDeckFromFile,
// } from "./FilesEditor.js";

export default function Edit(props) {
  const [newDeck, setNewDeck] = useState(false);
  const editableCardRef = useRef();
  const [maxTestId, setMaxTestId] = useState(props.maxTestId);

  useEffect(() => {
    if (props.testDeck) {
      setNewDeck([...props.testDeck, { id: maxTestId, editable: true }]);
      setMaxTestId((prev) => ++prev);
    } else {
      readDeck(props.user.uid);
      setNewDeck([{ id: maxTestId, editable: true }]);
    }
    //readDeck();
    // readDeckFromFile("test").then(
    //   (resolve) => {
    //     let deckFromFile = JSON.parse(resolve);
    //     let newId = Math.max(...deckFromFile.map((o) => o.id)) + 1;
    //     deckFromFile = [...deckFromFile, { id: newId, editable: true }];
    //     // console.log("talia");
    //     // console.table(deckFromFile);
    //     setNewDeck(deckFromFile);
    //   },
    //   (error) => {
    //     props.openStatement({
    //       status: "error",
    //       text: error,
    //     });
    //     props.choosePage(false);
    //   }
    // );
  }, []);

  function newCardData(id) {
    return {
      id: id,
      pl: editableCardRef.current.newPl,
      en: editableCardRef.current.newEn,
      editable: false,
    };
  }

  function editSavedCard(id, focusRight) {
    setNewDeck((prev) => {
      let focusNextCard = false;
      let savedCardData;
      let updatedDeck = prev.map((item) => {
        if (focusNextCard) {
          focusNextCard = false;
          item.editable = true;
          return item;
        } else if (id === item.id) {
          item.editable = true;
          item.focusRight = focusRight;
          return item;
        } else if (item.editable) {
          if (typeof id === "undefined") {
            focusNextCard = true;
          }
          savedCardData = newCardData(item.id);
          return savedCardData;
        } else {
          return item;
        }
      });

      if (!savedCardData.pl && !savedCardData.en) {
        updatedDeck = updatedDeck.filter((item) => {
          return item.id !== savedCardData.id;
        });
      }

      if (focusNextCard) {
        const updatedDeckWithNew = [
          ...updatedDeck,
          { id: maxTestId, editable: true },
        ];
        setMaxTestId((prev) => ++prev);
        return updatedDeckWithNew;
      } else {
        return updatedDeck;
      }
    });
  }

  async function saveDeck() {
    let deckToSave = newDeck.map((item) => {
      let newItem;
      if (item.editable) {
        newItem = newCardData(item.id);
      } else {
        newItem = item;
      }
      delete newItem.editable;

      return newItem;
    });

    deckToSave = deckToSave.filter((item) => {
      return item.pl && item.en;
    });

    props.saveTestDeck(deckToSave, maxTestId);

    props.openStatement({
      status: "success",
      text: `Talia została zapisana pomyślnie!`,
    });
    props.choosePage(false);

    // saveDeckToFile(deckToSave, "test").then(
    //   (deckName) => {
    //     props.openStatement({
    //       status: "success",
    //       text: `Talia "${deckName}" została zapisana pomyślnie!`,
    //     });
    //     props.choosePage(false);
    //     saveProgressDataToFile("kuba", "test", { lastRepeat: 0, cards: [] });
    //   },
    //   (error) => {
    //     props.openStatement({ status: "error", text: error });
    //     props.choosePage(false);
    //   }
    // );
  }

  if (newDeck) {
    return (
      <div className="page cardList">
        <div className="scrolling">
          <div className="cont">
            {newDeck.map((item) =>
              item.editable ? (
                <EditableCard
                  ref={editableCardRef}
                  key={item.id}
                  content={item}
                  editSavedCard={editSavedCard}
                />
              ) : (
                <UnpackedCard
                  key={item.id}
                  content={item}
                  editSavedCard={editSavedCard}
                />
              )
            )}
          </div>
        </div>
        <SaveButton saveDeck={saveDeck} />
      </div>
    );
  } else {
    return "loading...";
  }
}
