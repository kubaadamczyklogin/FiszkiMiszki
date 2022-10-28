import "./../css/menu.css";

export default function Menu(props) {
  return (
    <div className="menu">
      <div className="header">
        <div className="cont">
          <div className="user">{props.user}</div>
          <div className="trigger" onClick={props.menuTrigger}>
            {props.openMenu ? "✕" : "☰"}
          </div>
        </div>
      </div>
      {/* <div className="breadcrumbs">
        <div className="cont">Breadcrumbs</div>
      </div> */}
      {props.openMenu ? (
        <MenuList
          choosePage={props.choosePage}
          nextDay={props.nextDay}
          logOut={props.logOut}
        />
      ) : null}
    </div>
  );
}

function MenuList(props) {
  return (
    <nav>
      <div className="cont">
        <div
          onClick={() => {
            props.choosePage(false);
          }}
        >
          Start
        </div>
        <div
          onClick={() => {
            props.choosePage("lern");
          }}
        >
          Ucz się
        </div>
        <div
          onClick={() => {
            props.choosePage("edit");
          }}
        >
          Edytuj talię
        </div>
        <div
          onClick={() => {
            props.nextDay();
            props.choosePage();
          }}
        >
          Kolejny dzień
        </div>
        {/* <div
          onClick={() => {
            props.choosePage();
            props.logOut();
          }}
        >
          Wyloguj
        </div> */}
      </div>
    </nav>
  );
}
