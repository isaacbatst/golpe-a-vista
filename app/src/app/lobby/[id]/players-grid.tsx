import React from "react";
import { PlayerDTO, UserDTO } from "../../../lib/api.types";
import { Wifi } from "lucide-react";
import { cn } from "../../../lib/utils";
import PlayerAvatar from "./player-avatar";

type Props = {
  players: PlayerDTO[];
  users: UserDTO[];
  me: PlayerDTO;
  showRoles?: boolean;
};

const PlayersGrid = ({ me, players, users, showRoles = false }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-1 xl:grid-cols-2 text-center">
      {players
        .map((player) => {
          const isMe = player.id === me.id;

          const user = users.find((u) => u.id === player.id);
          const canSeePlayerRole =
            isMe ||
            (me.canSeeTeamMembers && player.role === me.role) ||
            showRoles;

          return (
            <div
              key={player.id}
              className={`relative flex flex-col justify-center items-center py-6 px-8 rounded-xl shadow-lg transition-all duration-300 ${
                isMe
                  ? "border-4 border-primary bg-blue-50 shadow-md"
                  : "bg-gradient-to-br from-white to-gray-100"
              }`}
            >
              <div className="absolute top-2 right-2 flex flex-col items-end">
                {player.isPresident && (
                  <span className="text-xs z-10 font-semibold text-blue-500 bg-blue-100 px-2 py-1 rounded-full mb-1 flex items-end">
                    Presidente
                  </span>
                )}
                {player.isRapporteur && (
                  <span className="text-xs z-10 font-semibold text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full">
                    Relator
                  </span>
                )}
                {player.impeached && (
                  <span className="z-10 text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-full">
                    Cassado
                  </span>
                )}
              </div>
              {isMe && (
                <span className="absolute z-10 top-2 left-2 text-xs font-semibold text-white bg-primary px-2 py-1 rounded-full">
                  Você
                </span>
              )}
              <PlayerAvatar
                isMe={isMe}
                player={player}
                className="w-20 h-20 mb-3 "
              />
              {user && (
                <div className="flex gap-1 items-center">
                  <span className="text-sm text-gray-500">{user.name}</span>
                  <Wifi
                    className={cn("h-4", {
                      "text-green-500": user?.isConnected,
                      "text-red-500": !user?.isConnected,
                    })}
                  />
                </div>
              )}
              {
                <span
                  className={cn(
                    "text-sm",
                    {
                      "text-red-600": player.role === "Radical",
                      "text-yellow-600": player.role === "Moderado",
                      "text-blue-600": player.role === "Conservador",
                    },
                    {
                      "text-gray-600 opacity-50": !canSeePlayerRole,
                    }
                  )}
                >
                  {canSeePlayerRole
                    ? player.role
                    : "Desconhecido"}
                </span>
              }
            </div>
          );
        })}
    </div>
  );
};

export default PlayersGrid;
