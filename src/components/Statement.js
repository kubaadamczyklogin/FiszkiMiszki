import "./../css/statement.css";

export default function Statement(props) {
  const { text, status, closeStatus } = props;

  return (
    <div className="statement" onClick={closeStatus}>
      <div className="cont">
        <div className={status}>
          <div className="close" onClick={closeStatus}>
            ✕
          </div>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}
