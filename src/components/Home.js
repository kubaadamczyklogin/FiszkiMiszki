export default function Home(props) {
  const { user } = props;
  const errors = ["Gdy niema w ogóle talii to nie da się edytować"];
  const toDo = [
    "Możliwość logowania różnych użytkowników",
    "Walidacja podczas edycji talii",
    "Wiele talii (na razie jest tylko jedna testowa)",
    "Strona spisu talii z danymi o postępie",
    "Ładna strona główna",
    'W "Edytuj" i "Dodaj" walidacja',
    'W "Ucz się" pełniejsze informacje o postępie, lepsze komunikaty',
    "Responsywność - obecnie zrobione tylko na tel w pionie",
    "Możliwość ustawiania limitów, miksów talii itp",
    "Wymowa audio",
    'W "Edytuj" i "Dodaj" automatyczne propozycje audio i tłumaczenia na polski (api)',
    "Możliwość dodawania obrazków",
    "Losowe powtarzanie jednej fiszki której już dawno się nauczyliśmy",
    "Breadcrumbs",
  ];

  return (
    <div className="home page">
      <div className="cont">
        {/*<h1>Fiszki - Miszki</h1>
         <p className="greetings">Witaj {user}!</p> */}
        <hr />

        <p>
          To jest wersja demonstracyjna aplikacji.
          <br />
          Po odświerzeniu okna wszystkie zmiany zostaną utracone.
        </p>

        <hr />

        <h2>Opis:</h2>

        <p>Fiszki słóżą do powtarzania - nauki słówek w innym języku</p>
        <p>Słówka są dobierane wg odpowiedniego algorytmu:</p>
        <ol>
          <li>Może być najwyązej 10 nowych słówek w jednym dniu</li>
          <li>Każde nowe słówko będzie powtarzane w dniu następnym</li>
          <li>
            Gdy 2 razy oznaczymy słówko jako znane - następna powtórka będzie po
            3 dniach
          </li>
          <li>Kolejne powtórki są po tygodniu i miesiącu</li>
          <li>
            W przypadku oznaczenia słówka jako nienauczone - będzie powtarzane
            jak nowe
          </li>
          <li>
            Po sesji nauki mamy możliwość powtórzenia sobie jseszcze słówek
            które oznaczyliśmy jako nienauczone
          </li>
        </ol>

        {/*  <p>Błędy do naprawy</p>
        <ol>
          {errors.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ol>
        <hr />*/}
        <h2>Planowane zmiany:</h2>
        <ol>
          {toDo.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ol>
      </div>
    </div>
  );
}
