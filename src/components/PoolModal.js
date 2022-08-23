import { Modal, Button } from "react-bootstrap";
import Pool from "./Pool";

export default function PoolModal({
  show,
  onHide,
  spotifyApi,
  setPool,
  setPoolName,
  savedPlaylists,
  activePool,
  setActivePool,
}) {
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
          Choose Track Pool
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <Pool
          spotifyApi={spotifyApi}
          setPool={setPool}
          savedPlaylists={savedPlaylists}
          activePool={activePool}
          setActivePool={setActivePool}
          setPoolName={setPoolName}
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
