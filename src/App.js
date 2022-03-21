import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ModeContext from "./components/ModeContext";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  const [mode, setMode] = useState("local");
  const value = { mode, setMode };
  return (
    <div className="App">
      <ModeContext.Provider value={value}>
        <Dashboard code={code} />
        {mode !== "spotify" && <Login />}
      </ModeContext.Provider>
    </div>
  );
};

export default App;
