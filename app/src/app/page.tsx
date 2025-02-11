"use client";
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
import { DoorOpen, LoaderCircle, PlusCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLobby } from "../lib/api";
import { useRouter } from "next/navigation";

const createLobbySchema = z.object({
  name: z.string(),
});

type CreateLobbyForm = z.infer<typeof createLobbySchema>;

const joinLobbySchema = z.object({
  name: z.string(),
  code: z.string(),
});

type JoinLobbyForm = z.infer<typeof joinLobbySchema>;

export default function Home() {
  const router = useRouter();

  const createLobbyForm = useForm<CreateLobbyForm>({
    resolver: zodResolver(createLobbySchema),
  });
  const joinLobbyForm = useForm<JoinLobbyForm>({
    resolver: zodResolver(joinLobbySchema),
  });

  const submitCreateLobby = createLobbyForm.handleSubmit(async (values) => {
    const created = await createLobby(values.name);
    if (!created)
      createLobbyForm.setError("root", { message: "Erro ao criar lobby" });
    router.push(`/lobby/${created.id}`);
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Golpe à Vista 👁️</h1>

      <div className="w-full max-w-md space-y-4">
        <form onSubmit={submitCreateLobby}>
          <Card>
            <CardHeader>
              <CardTitle>Crie um novo jogo</CardTitle>
              <CardDescription>
                Inicie o lobby para outros jogadores entrarem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label
                  htmlFor="create-form-name"
                  className="text-sm font-medium"
                >
                  Seu nome
                </label>
                <Input
                  {...createLobbyForm.register("name")}
                  id="create-form-name"
                  placeholder=""
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                disabled={createLobbyForm.formState.isSubmitting}
              >
                {createLobbyForm.formState.isSubmitting ? (
                  <LoaderCircle />
                ) : (
                  <PlusCircle />
                )}
                Criar Lobby
              </Button>
              {createLobbyForm.formState.errors.root && (
                <p className="text-red-500 text-sm text-center">
                  {createLobbyForm.formState.errors.root.message}
                </p>
              )}
            </CardFooter>
          </Card>
        </form>

        <form>
          <Card>
            <CardHeader>
              <CardTitle>Entrar em jogo existente</CardTitle>
              <CardDescription>
                Entre em um lobby já criado por outro jogador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="join-form-code" className="text-sm font-medium">
                  Código do lobby
                </label>
                <Input
                  {...joinLobbyForm.register("code")}
                  id="join-form-code"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="join-form-name" className="text-sm font-medium">
                  Seu nome
                </label>
                <Input
                  {...joinLobbyForm.register("name")}
                  id="join-form-name"
                  placeholder=""
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <DoorOpen />
                Entrar no Lobby
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2025 Golpe à Vista. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
