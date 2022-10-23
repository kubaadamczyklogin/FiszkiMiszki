import { useRef } from "react";
import "./../css/login.css";

export default function Login() {
  const login = useRef();
  const password = useRef();

  function signIn() {
    console.log(login, password);
  }

  function enterAsGuest() {
    console.log(enter);
  }

  return (
    <div className="login page">
      <div className="cont">
        <h1>Fiszki</h1>
        <h2>Zaloguj się</h2>
        <input ref={login} type="text" placeholder="login" />
        <br />
        <input ref={password} type="password" placeholder="hasło" />
        <br />
        <button className="blue" onClick={signIn}>
          Zaloguj
        </button>
        <p>
          By założyć konto napisz do admina:{" "}
          <a href="mailto:poczta@kubaadamczyk.pl">poczta@kubaadamczyk.pl</a>
        </p>
        <h2>Wejdź jako gość</h2>
        <p>
          Wersja dla gościa umożliwia dodawanie fiszek i przeglądanie ich, ale
          nie zapamięta postępów w nauce ani dodanych, zmienionych fiszek
        </p>
        <button className="blue" onClick={enterAsGuest}>
          Zobacz
        </button>
      </div>
    </div>
  );
}
