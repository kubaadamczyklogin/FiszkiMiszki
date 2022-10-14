const fs = require("browserify-fs");
const path = "../../decks";

export function saveDeckToFile(deck, deckName) {
  const deckJson = JSON.stringify(deck);

  return new Promise((resolve, reject) => {
    fs.mkdir(path, function () {
      fs.writeFile(
        `${path}/${deckName}.txt`,
        deckJson,
        { encoding: "utf8" },
        function (err) {
          if (err) {
            reject("Wystąpił błąd: " + err.message);
          } else {
            resolve(deckName);
          }
        }
      );
    });
  });
}

export function saveProgressDataToFile(user, deckName, data) {
  const dataJson = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    fs.mkdir(`${path}/${user}`, function () {
      fs.writeFile(
        `${path}/${user}/${deckName}.txt`,
        dataJson,
        { encoding: "utf8" },
        function (err) {
          if (err) {
            reject("Wystąpił błąd: " + err.message);
          } else {
            resolve("ok");
          }
        }
      );
    });
  });
}

export function readDeckFromFile(deckName) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, function () {
      fs.readFile(`${path}/${deckName}.txt`, "utf8", function (err, data) {
        if (err) {
          reject("Wystąpił błąd: " + err.message);
        } else {
          resolve(data);
        }
      });
    });
  });
}

export function readProgressDataFromFile(user, deckName) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, function () {
      fs.readFile(
        `${path}/${user}/${deckName}.txt`,
        "utf8",
        function (err, data) {
          if (err) {
            reject("Wystąpił błąd: " + err.message);
          } else {
            resolve(data);
          }
        }
      );
    });
  });
}
