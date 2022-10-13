export default function Home(props) {
  const { user } = props;
  const errors = [
    'W "Ucz się" fiszka zasłania menu',
    'W "Edytuj" i "Dodaj" nowa fiszka jest czasamni zasłaniana przez stopkę',
    'W "Edytuj" i "Dodaj" brak możliwości usuwania fiszki',
    'W "Edytuj" i "Dodaj" zapisuje się pusta fiszka',
  ];
  const toDo = [
    'Wiele talii (na razie jest tylko jedna "test")',
    "Import, export talii",
    "Strona spisu talii z danymi o postępie",
    "Ładna strona główna",
    "Możliwość logowania różnych użytkowników",
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
    <div className="home">
      <div className="cont">
        <h1>Fiszki - Miszki</h1>
        <p className="greetings">Witaj {user}!</p>
        <hr />
        <p>Błędy do naprawy</p>
        <ol>
          {errors.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ol>
        <hr />
        <p>Rozwój</p>
        <ol>
          {toDo.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ol>
      </div>
    </div>
  );
}
