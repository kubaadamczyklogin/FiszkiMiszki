export default function SaveButton(props) {
  return (
    <div className="save-button bottom-buttons">
      <div className="cont">
        <button className="blue" onClick={props.saveDeck}>
          Zapisz talię
        </button>
      </div>
    </div>
  );
}
