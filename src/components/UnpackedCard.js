export default function UnpackedCard(props) {
  const { id, pl, en } = props.content;

  return (
    <div className="card unpacked">
      <div
        className="backward"
        onClick={() => {
          props.editSavedCard(id);
        }}
      >
        {en}
      </div>
      <div
        className="forward"
        onClick={() => {
          props.editSavedCard(id, true);
        }}
      >
        {pl}
      </div>
    </div>
  );
}
