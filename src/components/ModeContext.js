import React from "react";
const ModeContext = React.createContext({
  mode: "local",
  setMode: () => {},
});

export const ModeProvider = ModeContext.Provider;
export default ModeContext;
