import DevOptions from "@/app/lobby/[id]/dev-options";
import CrisisStage from "@/app/lobby/[id]/stages/crisis-stage/crisis-stage";
import DossierStage from "@/app/lobby/[id]/stages/dossier-stage/dossier-stage";
import ImpeachmentStage from "@/app/lobby/[id]/stages/impeachment-stage/impeachment-stage";
import RadicalizationStage from "@/app/lobby/[id]/stages/radicalization-stage/radicalization-stage";
import SabotageStage from "@/app/lobby/[id]/stages/sabotage-stage/sabotage-stage";
import { cn } from "@/lib/utils";
import { Check, Dot, Info } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { LobbyDTO, Role, StageType } from "../../../lib/api.types";
import ApprovedLaws from "./approved-laws";
import { PlayerContextProvider } from "./player-context";
import PlayersGrid from "./players-grid";
import LegislativeStage from "./stages/legislative-stage/legislative-stage";
import { useEffect, useState } from "react";
import { RulesDialog } from "@/components/rules-dialog";

type Props = {
  userId: string;
  lobby: LobbyDTO;
};

const readableStageType: Record<StageType, string> = {
  [StageType.LEGISLATIVE]: "Legislativa",
  [StageType.REPORT_DOSSIER]: "Relatório do Dossiê",
  [StageType.SABOTAGE]: "Sabotagem",
  [StageType.CRISIS]: "Crise",
  [StageType.IMPEACHMENT]: "Impeachment",
  [StageType.RADICALIZATION]: "Radicalização",
};

export default function Game({ userId, lobby }: Props) {
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
  const me = lobby.currentGame.players.find((player) => player.id === userId)!;
  const myUser = lobby.users.find((user) => user.id === userId);
  const teams = {
    [Role.CONSERVADOR]: "Conservadores",
    [Role.MODERADO]: "Moderados",
    [Role.RADICAL]: "Radicais",
  };

  useEffect(() => {
    setRolesDialogOpen(true);
  }, []);

  return (
    <PlayerContextProvider player={me}>
      <RulesDialog
        open={rolesDialogOpen}
        onOpenChange={setRolesDialogOpen}
        role={me.role}
      />
      <div className="lg:h-screen bg-gray-100 flex flex-col lg:flex-row lg:items-start justify-center p-2 sm:p-5 gap-5">
        <Card className="bg-white shadow-2xl flex-grow">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center">
            <CardTitle>
              <h1 className="text-center text-4xl font-bold flex items-center justify-between">
                Golpe à Vista
              </h1>
            </CardTitle>
            {process.env.NEXT_PUBLIC_DEV_MODE === "true" && myUser && (
              <DevOptions users={lobby.users} me={myUser} />
            )}
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
              {lobby.currentGame.currentRound.index + 1}ª Rodada
            </h3>
          </CardHeader>
          <CardContent className="">
            {lobby.currentGame.winner ? (
              <div className="text-center my-10">
                <h2 className="font-bebas text-center text-6xl my-5">
                  {teams[lobby.currentGame.winner]} vencem!
                </h2>
                <h3 className="text-2xl font-semibold mb-3">
                  Condições de Vitória:
                </h3>
                <ul className="flex flex-col gap-2 items-center">
                  {lobby.currentGame.winnerWinConditions?.map((condition) => (
                    <li
                      key={condition.message}
                      className={cn("flex gap-2", {
                        "text-green-500": condition.isFulfilled,
                      })}
                    >
                      {condition.isFulfilled ? <Check /> : <Dot />}
                      {condition.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col gap-6 mb-10">
                {me.impeached ? (
                  <div className="text-center my-10">
                    <h2 className="font-bebas text-red-500  text-6xl mb-3">
                      Você foi cassado
                    </h2>
                    <p className="max-w-md mx-auto text-lg">
                      Você perdeu seus direitos políticos e não poderá mais
                      participar da partida.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    {lobby.currentGame.currentRound.currentStage.type ===
                      StageType.LEGISLATIVE && (
                      <LegislativeStage
                        stage={lobby.currentGame.currentRound.currentStage}
                        roundIndex={lobby.currentGame.currentRound.index}
                      />
                    )}
                    {lobby.currentGame.currentRound.currentStage.type ===
                      StageType.REPORT_DOSSIER && (
                      <DossierStage
                        stage={lobby.currentGame.currentRound.currentStage}
                      />
                    )}
                    {lobby.currentGame.currentRound.currentStage.type ===
                      StageType.SABOTAGE && (
                      <SabotageStage
                        stage={lobby.currentGame.currentRound.currentStage}
                      />
                    )}
                    {lobby.currentGame.currentRound.currentStage.type ===
                      StageType.CRISIS && (
                      <CrisisStage
                        stage={lobby.currentGame.currentRound.currentStage}
                        roundIndex={lobby.currentGame.currentRound.index}
                      />
                    )}
                    {lobby.currentGame.currentRound.currentStage.type ===
                      StageType.IMPEACHMENT && (
                      <ImpeachmentStage
                        stage={lobby.currentGame.currentRound.currentStage}
                      />
                    )}
                    {lobby.currentGame.currentRound.currentStage.type ===
                      StageType.RADICALIZATION && (
                      <RadicalizationStage
                        stage={lobby.currentGame.currentRound.currentStage}
                      />
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:items-center gap-3">
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
                    {Object.values(StageType).map((stageType) => (
                      <Button
                        key={stageType}
                        variant={
                          lobby.currentGame.currentRound.currentStage.type ===
                          stageType
                            ? "default"
                            : "outline"
                        }
                        className="cursor-default pointer-events-none"
                      >
                        {readableStageType[stageType]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <ApprovedLaws
              approvedConservativeLaws={
                lobby.currentGame.approvedConservativeLaws.length
              }
              approvedProgressiveLaws={
                lobby.currentGame.approvedProgressiveLaws.length
              }
              lawsToConservativeWin={lobby.currentGame.lawsToConservativeWin}
              lawsToProgressiveWin={lobby.currentGame.lawsToProgressiveWin}
            />
          </CardContent>
        </Card>
        <Card className="lg:max-h-full lg:overflow-y-auto">
          <CardContent className="pt-6 space-y-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-center">Jogadores</h2>
            <Button
              variant="secondary"
              onClick={() => setRolesDialogOpen(true)}
            >
              <Info />
              Regras
            </Button>
            <PlayersGrid
              me={me}
              players={lobby.currentGame.presidentQueue.players.map(
                (p) =>
                  lobby.currentGame.players.find((player) => player.id === p)!
              )}
              users={lobby.users}
              showRoles={Boolean(lobby.currentGame.winner)}
            />
          </CardContent>
        </Card>
      </div>
    </PlayerContextProvider>
  );
}
