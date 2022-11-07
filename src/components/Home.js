export default function Home(props) {
  const errors = [
    //"Komunikaty powtórek - do poprawy",
  ];

  const toDo = [
    "Pełniejsze komunikaty podczas uczenia się",
    "Możliwość zapisu edycji podczas przełączania na inną podstronę",
    "Zapis postępu mimo braku ukończenia sesji",
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
        <h1>Fiszki</h1>

        <p>Wersja Beta</p>

        <p>
          Obecnie pracuję nad:
          <br />
          Poprawieniem ograniczeń nauki jednego dnia - by można było kilka razy
          w ciągu dnia skożystać z aplikacji.
        </p>

        <hr />
        {/*{props.guest && (
          <>
            <p>
              To jest wersja demonstracyjna aplikacji.
              <br />
              Po odświerzeniu okna wszystkie zmiany zostaną utracone.
              <br />
              Klikając "menu/kolejny dzień" możemy zasymulować dzień następny
            </p>

            <hr />
          </>
        )} */}

        <h2>Opis:</h2>

        <p>Fiszki słóżą do powtarzania - nauki słówek w innym języku</p>
        <p>Słówka są dobierane wg odpowiedniego algorytmu:</p>
        <ol>
          <li>Może być najwżej 10 nowych słówek w jednym dniu</li>
          <li>Każde nowe słówko będzie powtarzane w dniu następnym</li>
          <li>
            Gdy 2 razy oznaczymy słówko przyciskiem "wiedziałem" - następna
            powtórka będzie po 3 dniach
          </li>
          <li>Kolejne powtórki są po tygodniu i miesiącu</li>
          <li>
            W przypadku oznaczenia słówka jako przyciskiem "powtórzę" - będzie
            powtarzane jak nowe
          </li>
          <li>
            Po każdej sesji mamy możliwość powtórzenia sobie jeszcze dodatkowo
            słówek które oznaczyliśmy przyciskiem "powtórzę" (ale nie ma to już
            wpływu na powtórki w kolejnych dniach)
          </li>
        </ol>

        {/* <h2>Błędy do naprawy</h2>
        <ol>
          {errors.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ol> */}
        <hr />
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
