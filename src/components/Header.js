import { useEffect, useState, useContext } from "react";
import ModeContext from "./ModeContext";
import Nav from "react-bootstrap/Nav";
import InfoModal from "./InfoModal";
import StatsModal from "./StatsModal";

export default function Header({ setShowSettings, wins, fails, streak }) {
  const { mode } = useContext(ModeContext);
  const [showInfo, setShowInfo] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (mode !== "none") setShowInfo(true);
  }, [mode, setShowInfo]);

  return (
    <Nav>
      <a id="shameless-plug" href="https://github.com/hbhhi/music-thing">
        <img width="32px" src="./assets/github.png" alt="github" />
      </a>
      <img
        style={{ cursor: "pointer" }}
        width="32px"
        src="./assets/settings.svg"
        alt="settings"
        onClick={() => setShowSettings(true)}
      />
      <div id="logo" style={{ backgroundImage: "url(../assets/infinity.svg)" }}>
        HEARDLE UNLIMITED
      </div>
      <div className="header-button" onClick={() => setShowInfo(true)}>
        ?
      </div>
      <div className="header-button" onClick={() => setShowStats(true)}>
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
    </Nav>
  );
}
