// import { useContext } from "react";
// import ModeContext from "./ModeContext";
import { Container } from "react-bootstrap";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=cb09cd6fc8b14816adfcc582ec5698b2&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 110px)" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login to Spotify
      </a>
      {/* <div id="continue-guest-text" onClick={() => setMode("guest")}>
        Continue as guest
      </div> */}
    </Container>
  );
}
