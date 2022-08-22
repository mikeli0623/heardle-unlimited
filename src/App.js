import { useState, useEffect } from "react";
import "./App.css";
import useAuth from "./components/useAuth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import ModeContext from "./components/ModeContext";
import SpotifyWebApi from "spotify-web-api-node";

const code = new URLSearchParams(window.location.search).get("code");

const spotifyApi = new SpotifyWebApi({
  clientId: "cb09cd6fc8b14816adfcc582ec5698b2",
});

const App = () => {
  const [mode, setMode] = useState("none");
  const value = { mode, setMode };

  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState("");
  const [streak, setStreak] = useState(0);
  const [fails, setFails] = useState(0);
  const [wins, setWins] = useState([0, 0, 0, 0, 0, 0]);

  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe().then((res) => {
      setUsername(res.body.display_name);
    });
    setMode("signed");
  }, [accessToken]);

  return (
    <div className="App">
      <Header
        setShowSettings={setShowSettings}
        streak={streak}
        fails={fails}
        wins={wins}
      />
      <ModeContext.Provider value={value}>
        {mode === "none" ? (
          <Login />
        ) : (
          <Dashboard
            accessToken={accessToken}
            spotifyApi={spotifyApi}
            username={username}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            setStreak={setStreak}
            setFails={setFails}
            setWins={setWins}
          />
        )}
      </ModeContext.Provider>
    </div>
  );
};

export default App;
