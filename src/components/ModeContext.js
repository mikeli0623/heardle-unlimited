import React from "react";
const ModeContext = React.createContext({
  mode: "none",
  setMode: () => {},
});

export const ModeProvider = ModeContext.Provider;
export default ModeContext;
