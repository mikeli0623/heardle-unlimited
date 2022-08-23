import { useEffect, useState, useContext } from "react";
import ModeContext from "./ModeContext";
import Nav from "react-bootstrap/Nav";
import InfoModal from "./InfoModal";
import StatsModal from "./StatsModal";
import PoolModal from "./PoolModal";

export default function Header({
  wins,
  fails,
  streak,
  spotifyApi,
  setPool,
  savedPlaylists,
  activeSavedPlaylist,
  setActiveSavedPlaylist,
  activeCountry,
  setActiveCountry,
  activeDecade,
  setActiveDecade,
  setPoolName,
}) {
  const { mode } = useContext(ModeContext);
  const [showInfo, setShowInfo] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showPool, setShowPool] = useState(false);

  useEffect(() => {
    if (mode !== "none") setShowInfo(true);
  }, [mode]);

  return (
    <Nav>
      <a
        id="shameless-plug"
        href="https://github.com/hbhhi/music-thing"
        target="_blank"
        rel="noreferrer"
      >
        <img width={32} src="./assets/github.png" alt="github" />
      </a>
      <img
        style={{ cursor: "pointer" }}
        width="32px"
        src="./assets/settings.svg"
        alt="settings"
        onClick={() => {
          if (mode !== "none") setShowPool(true);
        }}
      />
      <div id="logo" style={{ backgroundImage: "url(../assets/infinity.svg)" }}>
        HEARDLE UNLIMITED
      </div>
      <div className="header-button" onClick={() => setShowInfo(true)}>
        ?
      </div>
      <div
        className="header-button"
        onClick={() => {
          if (mode !== "none") setShowStats(true);
        }}
      >
        <div className="d-flex" style={{ transform: "scaleY(-1)" }}>
          <div
            style={{ height: "6px", width: "3px", backgroundColor: "white" }}
          />
          <div
            className="mx-1"
            style={{ height: "9px", width: "3px", backgroundColor: "white" }}
          />
          <div
            style={{ height: "12px", width: "3px", backgroundColor: "white" }}
          />
        </div>
      </div>
      <InfoModal show={showInfo} onHide={() => setShowInfo(false)} />
      <StatsModal
        show={showStats}
        onHide={() => setShowStats(false)}
        wins={wins}
        fails={fails}
        streak={streak}
      />
      <PoolModal
        show={showPool}
        onHide={() => setShowPool(false)}
        spotifyApi={spotifyApi}
        setPool={setPool}
        savedPlaylists={savedPlaylists}
        activeSavedPlaylist={activeSavedPlaylist}
        setActiveSavedPlaylist={setActiveSavedPlaylist}
        activeCountry={activeCountry}
        setActiveCountry={setActiveCountry}
        activeDecade={activeDecade}
        setActiveDecade={setActiveDecade}
        setPoolName={setPoolName}
      />
    </Nav>
  );
}
