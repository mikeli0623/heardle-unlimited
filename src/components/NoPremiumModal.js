import Modal from "react-bootstrap/Modal";

export default function NoPremiumModal({ show }) {
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
    </Modal>
  );
}
