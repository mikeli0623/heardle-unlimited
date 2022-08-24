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

  const [username, setUsername] = useState("");
  const [streak, setStreak] = useState(0);
  const [fails, setFails] = useState(0);
  const [wins, setWins] = useState([0, 0, 0, 0, 0, 0]);
  const [pool, setPool] = useState([]);
  const [activePool, setActivePool] = useState(null);
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  const [poolName, setPoolName] = useState(null);
  const [isPremium, setPremium] = useState(false);

  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe().then((res) => {
      setUsername(res.body.id);
      setPremium(res.body.product === "premium");
    });
    setMode("signed");
  }, [accessToken]);

  // grab users personal playlists
  useEffect(() => {
    if (username) {
      spotifyApi.getUserPlaylists(username, { limit: 50 }).then(
        (res) => {
          let playlistOptions = [];
          res.body.items.forEach((playlist) =>
            playlistOptions.push({ label: playlist.name, value: playlist.id })
          );
          setSavedPlaylists(playlistOptions);
        },
        (err) => {
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [username]);

  // sets default pool as Top 50 - Global
  useEffect(() => {
    if (accessToken) {
      setPoolName("Top 50 Tracks - Global");
      setActivePool({ label: "Global", value: "37i9dQZEVXbMDoHDwVN2tF" });
    }
  }, [accessToken]);

  useEffect(() => {
    if (!activePool) return;
    spotifyApi.getPlaylist(activePool.value).then(
      (res) => {
        setPool(
          res.body.tracks.items.map((item) => {
            return {
              artists: item.track.artists,
              title: item.track.name,
              pattern: (
                item.track.artists.map((artist) => {
                  return artist.name;
                }) +
                " - " +
                item.track.name
              ).replace(",", " "),
              uri: item.track.uri,
              id: item.track.id,
              album: item.track.album.name,
              albumUrlLarge: item.track.album.images[0].url,
              albumUrlMed: item.track.album.images[1].url,
              albumUrlSmall: item.track.album.images[2].url,
              duration_ms: item.track.duration_ms,
            };
          })
        );
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  }, [activePool]);

  return (
    <div className="App">
      <ModeContext.Provider value={value}>
        <Header
          streak={streak}
          fails={fails}
          wins={wins}
          spotifyApi={spotifyApi}
          setPool={setPool}
          savedPlaylists={savedPlaylists}
          activePool={activePool}
          setActivePool={setActivePool}
          setPoolName={setPoolName}
        />
        {mode === "none" ? (
          <Login />
        ) : (
          <Dashboard
            isPremium={isPremium}
            accessToken={accessToken}
            spotifyApi={spotifyApi}
            setStreak={setStreak}
            setFails={setFails}
            setWins={setWins}
            poolName={poolName}
            pool={pool}
            setPool={setPool}
          />
        )}
      </ModeContext.Provider>
    </div>
  );
};

export default App;
