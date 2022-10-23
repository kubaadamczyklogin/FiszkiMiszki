import "./../css/app.css";
import Login from "./Login.js";
import Menu from "./Menu.js";
import Home from "./Home.js";
import Statement from "./Statement.js";
import Lern from "./Lern.js";
import Add from "./Add.js";
import Edit from "./Edit.js";
import readDeck from "./../db/readDeck.js";

import { useState, useEffect } from "react";

export default function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [body, setBody] = useState(false);
  const [statement, setStatement] = useState(false);
  const [user, setUser] = useState("Test");
  const [testDeck, setTestDeck] = useState(false);
  const [testProgressData, setTestProgressData] = useState(false);
  const [maxTestId, setMaxTestId] = useState(0);
  const [testToday, setTestToday] = useState(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    readDeck().then(
      (deck) => {
        setTestDeck(deck);
      },
      (error) => {
        openStatement({
          status: "error",
          text: error,
        });
      }
    );
  }, []);

  function choosePage(page) {
    switch (page) {
      case "lern":
        setBody(
          <Lern
            choosePage={choosePage}
            openStatement={openStatement}
            testDeck={testDeck}
            testProgressData={testProgressData}
            testToday={testToday}
            saveTestProgressData={saveTestProgressData}
          />
        );
        break;
      case "edit":
        setBody(
          <Edit
            choosePage={choosePage}
            openStatement={openStatement}
            testDeck={testDeck}
            maxTestId={maxTestId}
            saveTestDeck={saveTestDeck}
          />
        );
        break;
      default:
        setBody(<Home user={user} />);
    }
    setOpenMenu(false);
  }

  function menuTrigger() {
    setOpenMenu((prev) => !prev);
  }

  function openStatement(data) {
    setStatement(data);
  }

  function closeStatus() {
    setStatement(false);
  }

  function saveTestDeck(newDeck, newMaxId) {
    setTestDeck(newDeck);
    setMaxTestId(newMaxId);
  }

  function saveTestProgressData(newProgressData) {
    setTestProgressData(newProgressData);
  }

  function nextDay() {
    const testDay = 86400000;
    const newTestDay = testToday + testDay;
    const currentDate = new Date(newTestDay);
    const month = currentDate.getUTCMonth() + 1;
    const day = currentDate.getUTCDate();
    const year = currentDate.getUTCFullYear();
    const newdate = year + "/" + month + "/" + day;

    openStatement({
      status: "success",
      text: `Przestawiłeś aktualny dzień na ${newdate}`,
    });

    setTestToday(newTestDay);
  }

  if (!body) choosePage();

  if (testDeck) {
    return (
      <>
        <Menu
          user={user}
          menuTrigger={menuTrigger}
          choosePage={choosePage}
          openMenu={openMenu}
          nextDay={nextDay}
        />
        {body}
        {statement !== false && (
          <Statement
            text={statement.text}
            status={statement.status}
            closeStatus={closeStatus}
          />
        )}
      </>
    );
  } else {
    return "...loading...";
    //return <Login />;
  }
}
