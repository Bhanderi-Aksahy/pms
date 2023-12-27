import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import moment from "moment/moment";
import { useEffect, useState } from "react";

function StatusModal(props) {
  const [errorNote, setErrorNote] = useState("");

  const updateNoteWithStatus = (id) => {
    console.log("updateNoteWithStatus:: ", id);
  };

  const updateNoteOnly = (id) => {
    console.log("updateNoteOnly:: ", id);
    console.log(errorNote);
  };

  useEffect(() => {
    if (props?.show) {
      setErrorNote(props?.singleItem?.errorNote);
    } else{
      setErrorNote("");
    }
  }, [props?.singleItem?.errorNote]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable={true}
      dialogClassName="status-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Job Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <input
        type="text"
        value={errorNote}
        onChange={(event) => setErrorNote(event.target.value)}
      /> */}

        <textarea
          name="postContent"
          rows={4}
          cols={100}
          value={errorNote}
          onChange={(event) => setErrorNote(event.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={() => updateNoteOnly(props?.singleItem?.id)}>
          Save Note Only
        </Button>
        <Button onClick={() => updateNoteWithStatus(props?.singleItem?.id)}>
          Save Note & Resolved
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StatusModal;
