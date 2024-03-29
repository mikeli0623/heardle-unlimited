import { useContext } from "react";
import ModeContext from "./ModeContext";
import { Container } from "react-bootstrap";
import { HOST_URL } from "../data";

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=cb09cd6fc8b14816adfcc582ec5698b2&response_type=code&redirect_uri=${HOST_URL}&scope=streaming%20user-read-private%20user-library-read%20user-read-playback-state%20user-modify-playback-state`;

export default function Login() {
  const { setMode } = useContext(ModeContext);
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 110px)" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login to Spotify
      </a>
      <div id="continue-guest-text" onClick={() => setMode("local")}>
        Continue without Spotify
      </div>
    </Container>
  );
}
