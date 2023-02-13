import { useContext } from "react";
import ModeContext from "./ModeContext";
import { Modal, Button } from "react-bootstrap";

export default function NoPremiumModal({ show }) {
  const { setMode } = useContext(ModeContext);
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
    >
      <Modal.Header
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Non-Premium Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        Unfortunately, only Spotify Premium users can use Web Playback. Heardle
        Unlimited depends on Web Playback, so a non-premium account can not make
        the neccessary API calls to work.
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="success" onClick={() => setMode("local")}>
          Contiue without Spotify
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
