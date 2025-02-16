import React from "react";
import LawCardOverlayActionButton from "./law-card-overlay-action-button";
import { useLobbySocketContext } from "../lobby-socket-context";

type Props = {
  vote: boolean | null;
};

const LawCardOverlayVoting = ({ vote }: Props) => {
  const { legislativeStageVoting } = useLobbySocketContext();
  const disabled = vote !== null;

  const yes = (
    <LawCardOverlayActionButton
      variant="outline"
      icon="check"
      disabled={disabled}
      className="disabled:opacity-80 disabled:cursor-not-allowed"
      onClick={() => !disabled && legislativeStageVoting(true)}
    >
      Sim
    </LawCardOverlayActionButton>
  );

  const no = (
    <LawCardOverlayActionButton
      variant="destructive"
      icon="x"
      disabled={disabled}
      className="disabled:opacity-80 disabled:cursor-not-allowed"
      onClick={() => !disabled && legislativeStageVoting(false)}
    >
      Não
    </LawCardOverlayActionButton>
  );

  return (
    <div className="flex gap-5 flex-col items-center">
      {vote === null && (
        <>
          {yes}
          {no}
        </>
      )}
      {vote === true && yes}
      {vote === false && no}
    </div>
  );
};

export default LawCardOverlayVoting;
