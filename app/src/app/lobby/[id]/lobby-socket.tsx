import { PropsWithChildren } from "react";
import useSocket from "../../../hooks/useLobbySocket";

const LobbySocket = (
  props: PropsWithChildren<{
    lobbyId: string;
  }>
) => {
  useSocket(props.lobbyId);
  return (
    <>
      {props.children}
    </>
  );
};

export default LobbySocket;
