import { createContext, PropsWithChildren, useContext } from "react";
import { LobbyDTO } from "../../../lib/api.types";

type LobbyContextType = {
  lobby: LobbyDTO;
};

const LobbyContext = createContext<LobbyContextType>(
  null as unknown as LobbyContextType
);

export const LobbyContextProvider = (
  props: PropsWithChildren<{
    lobby: LobbyDTO;
  }>
) => {
  return (
    <LobbyContext.Provider value={{ lobby: props.lobby }}>
      {props.children}
    </LobbyContext.Provider>
  );
};

export const useLobbyContext = () => {
  const context = useContext(LobbyContext);
  if (!context) {
    throw new Error(
      "useLobbyContext must be used within a LobbyContextProvider"
    );
  }
  return context;
};
