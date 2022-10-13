import {useRef, forwardRef, useImperativeHandle } from "react";

function EditableCard(props, ref) {
  const { id, pl, en, focusRight } = props.content;
  const newEn = useRef();
  const newPl = useRef();

  useImperativeHandle(ref, () => ({
    get newPl() {
      return newPl.current.value;
    },
    get newEn() {
      return newEn.current.value;
    },
  }));

  function focusNextInputOnEnter(e, targetInput) {
    if (e.key === "Enter" || e.keyCode === 13) {
      targetInput.current.focus();
    }
  }

  function saveCardOnEnter(e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      props.saveCard(id);
    }
  }

  return (
    <div className="card editable">
      <div className="backward">
        <input
          autoFocus={!focusRight}
          type="text"
          placeholder="en"
          defaultValue={en}
          ref={newEn}
          onKeyUp={(e) => {
            focusNextInputOnEnter(e, newPl);
          }}
        />
      </div>
      <div className="forward">
        <input
          autoFocus={focusRight}
          type="text"
          placeholder="pl"
          defaultValue={pl}
          ref={newPl}
          onKeyUp={(e) => {
            saveCardOnEnter(e);
          }}
        />
      </div>
    </div>
  );
}
export default EditableCard = forwardRef(EditableCard);