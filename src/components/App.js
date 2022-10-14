import "./../css/app.css";
import Menu from "./Menu.js";
import Home from "./Home.js";
import Statement from "./Statement.js";
import Lern from "./Lern.js";
import Add from "./Add.js";
import Edit from "./Edit.js";

import { useState } from "react";

const user = "Test";

export default function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [body, setBody] = useState(false);
  const [statement, setStatement] = useState(false);

  function choosePage(page) {
    switch (page) {
      case "lern":
        setBody(<Lern choosePage={choosePage} openStatement={openStatement} />);
        break;
      case "add":
        setBody(<Add choosePage={choosePage} openStatement={openStatement} />);
        break;
      case "set":
        setBody(<p>Wybieranie talii - w przygotowaniu</p>);
        break;
      case "edit":
        setBody(<Edit choosePage={choosePage} openStatement={openStatement} />);
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

  if (!body) choosePage();

  return (
    <div className="App">
      <Menu
        user={user}
        menuTrigger={menuTrigger}
        choosePage={choosePage}
        openMenu={openMenu}
      />
      {body}
      {statement !== false && (
        <Statement
          text={statement.text}
          status={statement.status}
          closeStatus={closeStatus}
        />
      )}
    </div>
  );
}
