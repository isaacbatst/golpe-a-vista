import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { DoorOpen, PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Golpe à Vista 👁️</h1>

      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Crie um novo jogo</CardTitle>
            <CardDescription>
              Inicie o lobby para outros jogadores entrarem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-2">
                <label htmlFor="playerName" className="text-sm font-medium">
                  Seu nome
                </label>
                <Input id="playerName" placeholder="Adolfo" />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <PlusCircle />
              Criar Lobby
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entrar em jogo existente</CardTitle>
            <CardDescription>
              Entre em um lobby já criado por outro jogador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-2">
                <label htmlFor="lobbyCode" className="text-sm font-medium">
                  Código do lobby
                </label>
                <Input id="lobbyCode" placeholder="A9DS" />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <DoorOpen />
              Entrar no Lobby
            </Button>
          </CardFooter>
        </Card>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2025 Golpe à Vista. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
