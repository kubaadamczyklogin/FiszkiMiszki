import "./../css/cardList.css";
import { useState, useRef, useEffect } from "react";
import UnpackedCard from "./UnpackedCard.js";
import EditableCard from "./EditableCard.js";
import SaveButton from "./SaveButton.js";
import {
  saveDeckToFile,
  saveProgressDataToFile,
  readDeckFromFile,
} from "./FilesEditor.js";

export default function Edit(props) {
  const [newDeck, setNewDeck] = useState(false);
  const editableCardRef = useRef();

  useEffect(() => {
    readDeckFromFile("test").then(
      (resolve) => {
        let deckFromFile = JSON.parse(resolve);
        let newId = Math.max(...deckFromFile.map((o) => o.id)) + 1;
        deckFromFile = [...deckFromFile, { id: newId, editable: true }];
        // console.log("talia");
        // console.table(deckFromFile);
        setNewDeck(deckFromFile);
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
      let biggestId = 0;
      let savedCardData;
      let updatedDeck = prev.map((item) => {
        if (item.id > biggestId) biggestId = item.id;
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

      if (!savedCardData.pl && !savedCardData.pl) {
        updatedDeck = updatedDeck.filter((item) => {
          return item.id !== savedCardData.id;
        });
      }

      if (focusNextCard) {
        return [...updatedDeck, { id: ++biggestId, editable: true }];
      } else {
        return updatedDeck;
      }
    });
  }

  async function saveDeck() {
    const deckToSave = newDeck.map((item) => {
      let newItem;
      if (item.editable) {
        newItem = newCardData(item.id);
      } else {
        newItem = item;
      }
      delete newItem.editable;

      return newItem;
    });

    saveDeckToFile(deckToSave, "test").then(
      (deckName) => {
        props.openStatement({
          status: "success",
          text: `Talia "${deckName}" została zapisana pomyślnie!`,
        });
        props.choosePage(false);
        saveProgressDataToFile("kuba", "test", { lastRepeat: 0, cards: [] });
      },
      (error) => {
        props.openStatement({ status: "error", text: error });
        props.choosePage(false);
      }
    );
  }

  if (newDeck) {
    return (
      <div className="editable cardList">
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
        <SaveButton saveDeck={saveDeck} />
      </div>
    );
  } else {
    return "loading...";
  }
}
