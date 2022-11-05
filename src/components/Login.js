import { useRef } from "react";
import { auth } from "./../db/initDb.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./../css/login.css";

export default function Login(props) {
  const registerEmail = useRef();
  const registerPassword = useRef();
  const loginEmail = useRef();
  const loginPassword = useRef();

  function logIn() {
    signInWithEmailAndPassword(
      auth,
      loginEmail.current.value,
      loginPassword.current.value
    );
  }

  function newAcount() {
    createUserWithEmailAndPassword(
      auth,
      registerEmail.current.value,
      registerPassword.current.value
    );
  }

  return (
    <div className="login page">
      <div className="cont">
        <h1>Fiszki</h1>
        <h2>Zaloguj się</h2>
        <input type="text" placeholder="email" ref={loginEmail} />
        <br />
        <input type="password" placeholder="hasło" ref={loginPassword} />
        <br />
        <button className="blue" onClick={logIn}>
          Zaloguj
        </button>

        <p>
          W celu przypomnienia lub potrzeby zmiany hasła, skontaktuj się z
          adminem:{" "}
          <a href="mailto:poczta@kubaadamczyk.pl">poczta@kubaadamczyk.pl</a>
        </p>

        <h2>Wejdź jako gość</h2>
        <p>
          Wersja demonstracyjna umożliwia dodawanie fiszek i przeglądanie ich,
          ale nie zapamięta postępów w nauce ani dodanych, zmienionych fiszek
        </p>
        <button className="blue" onClick={props.enterAsGuest}>
          Demo
        </button>

        <h2>Załóż konto</h2>
        <input type="text" placeholder="email" ref={registerEmail} />
        <br />
        <input type="password" placeholder="hasło" ref={registerPassword} />
        <br />
        <button className="blue" onClick={newAcount}>
          Nowe konto
        </button>
        <br />
      </div>
    </div>
  );
}
