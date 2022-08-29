import { useContext } from "react";
import ModeContext from "./ModeContext";
import { Modal, Button } from "react-bootstrap";
import SpotifyPool from "./SpotifyPool";
import LocalPool from "./LocalPool";

export default function PoolModal({
  show,
  onHide,
  spotifyApi,
  setPool,
  setPoolName,
  savedPlaylists,
  activePool,
  setActivePool,
  setMetadataList,
  setAudioFileList,
  setAllFiles,
  isMetadataLoading,
  setMetadataLoading,
  metadataLoaded,
  setMetadataLoaded,
  totalFiles,
}) {
  const { mode } = useContext(ModeContext);
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
        {mode === "premium" ? (
          <SpotifyPool
            spotifyApi={spotifyApi}
            setPool={setPool}
            savedPlaylists={savedPlaylists}
            activePool={activePool}
            setActivePool={setActivePool}
            setPoolName={setPoolName}
          />
        ) : (
          <LocalPool
            setPool={setPool}
            setMetadataList={setMetadataList}
            setAudioFileList={setAudioFileList}
            setAllFiles={setAllFiles}
            isMetadataLoading={isMetadataLoading}
            setMetadataLoading={setMetadataLoading}
            metadataLoaded={metadataLoaded}
            setMetadataLoaded={setMetadataLoaded}
            totalFiles={totalFiles}
          />
        )}
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
