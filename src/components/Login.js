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
    ).catch((error) => {
      let message;

      switch (error.code) {
        case "auth/wrong-password":
          message = "Nieprawidłowe hasło";
          break;
        case "auth/invalid-email":
          message = `"${registerEmail.current.value}" - to nie jest prawidłowy adres email`;
          break;
        case "auth/internal-error":
          message =
            "Nie udało się założyć konta - upewnij się że uzupełniłeś email i hasło";
          break;
        case "auth/user-not-found":
          message = `Niema jeszcze konta dla adresu email "${loginEmail.current.value}"`;
          break;
        case "auth/too-many-requests":
          message = `Za dużo prób logowania na konto email "${loginEmail.current.value}" - spróbój później`;
          break;
        default:
          message = `Nie udało się zalogować, wystąpił błąd "${
            error.code + " / " + error.message
          }"`;
      }

      props.openStatement({
        status: "error",
        text: message,
      });
    });
  }

  function newAcount() {
    createUserWithEmailAndPassword(
      auth,
      registerEmail.current.value,
      registerPassword.current.value
    ).catch((error) => {
      let message;

      switch (error.code) {
        case "auth/email-already-in-use":
          message = `Jest już konto związane z adresem: ${registerEmail.current.value}`;
          break;
        case "auth/invalid-email":
          message = `"${registerEmail.current.value}" - to nie jest prawidłowy adres email`;
          break;
        case "auth/weak-password":
          message = "Hasło powinno mieć co najmniej 6 znaków";
          break;
        case "auth/internal-error":
          message =
            "Nie udało się założyć konta - upewnij się że uzupełniłeś email i hasło";
          break;
        default:
          message = `Nie udało się zalogować, wystąpił błąd "${
            error.code + " / " + error.message
          }"`;
      }

      props.openStatement({
        status: "error",
        text: message,
      });
    });
  }

  return (
    <div className="login page">
      <div className="cont">
        <h1>Fiszki</h1>
        <h2>Zaloguj się</h2>
        <input type="text" placeholder="email" ref={loginEmail} />
        <input type="password" placeholder="hasło" ref={loginPassword} />
        <button className="blue" onClick={logIn}>
          Zaloguj
        </button>
        <p>
          W celu przypomnienia lub zmiany hasła, skontaktuj się z adminem:{" "}
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
        <input type="password" placeholder="hasło" ref={registerPassword} />
        <button className="blue" onClick={newAcount}>
          Nowe konto
        </button>
        <br />
      </div>
    </div>
  );
}
