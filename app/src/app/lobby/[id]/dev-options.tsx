import { useLobbySocketContext } from "@/app/lobby/[id]/lobby-socket-context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDTO } from "@/lib/api.types";

type Props = {
  users: UserDTO[];
  me: UserDTO;
};

const DevOptions = ({ users, me }: Props) => {
  const { resetLobby, updateSession } = useLobbySocketContext();

  const handleChangePlayer = async (userId: string) => {
    updateSession(userId);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {process.env.NEXT_PUBLIC_DEV_MODE === "true" && (
        <Select defaultValue={me.id} onValueChange={handleChangePlayer}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              {users.find((user) => user.id === me.id)?.name ||
                "Selecione um jogador"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {me.isHost && (
        <Button
          onClick={() => {
            const confirmed = window.confirm(
              "Você tem certeza que deseja resetar o lobby?"
            );
            if (confirmed) {
              resetLobby();
            }
          }}
          variant="ghost"
          className="text-sm font-medium"
        >
          Resetar Lobby
        </Button>
      )}
    </div>
  );
};

export default DevOptions;
