import { Modal, Button } from "react-bootstrap";

const Rule = ({ icon, rule }) => {
  return (
    <div className="d-flex align-items-center justify-content-start my-2">
      <figure className="m-0" style={{ height: "32px", width: "32px" }}>
        <img
          style={{ maxWidth: "100%" }}
          src={`./assets/${icon}.png`}
          alt={`${icon} icon`}
        />
      </figure>
      <div className="mx-2" style={{ fontSize: "1.2rem" }}>
        {rule}
      </div>
    </div>
  );
};

export default function InfoModal({ show, onHide }) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          How to Play
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingLeft: "1%" }}>
        <Rule
          icon="spotify"
          rule="Login to your Spotify account. Needs to be premium."
        />
        <Rule
          icon="settings"
          rule="Set your track pool with this icon (default Top 50 Tracks - Global)"
        />
        <Rule
          icon="listen"
          rule="Listen to the intro of the song and guess the right track."
        />
        <Rule
          icon="surrender"
          rule="Skips or incorrect guesses add time to the intro."
        />
        <Rule
          icon="smile"
          rule="Guess in as little attempts as possible and reach for a high streak. Enjoy!"
        />
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="success" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
