import { createContext, PropsWithChildren, useContext } from "react";
import { PlayerDTO } from "../../../lib/api.types";

type PlayerContextType = {
  player: PlayerDTO;
};

const PlayerContext = createContext<PlayerContextType>(
  null as unknown as PlayerContextType
);

export const PlayerContextProvider = (
  props: PropsWithChildren<{
    player: PlayerDTO;
  }>
) => {
  return (
    <PlayerContext.Provider value={{ player: props.player }}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      "usePlayerContext must be used within a PlayerContextProvider"
    );
  }
  return context;
};
