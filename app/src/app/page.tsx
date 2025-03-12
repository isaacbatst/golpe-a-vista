"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import JoinLobbyForm from "../components/forms/join-lobby-form";
import { createLobby } from "../lib/api";
import { useState } from "react";

const createLobbySchema = z.object({
  name: z.string().min(2),
});

type CreateLobbyForm = z.infer<typeof createLobbySchema>;

export default function HomePage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const createLobbyForm = useForm<CreateLobbyForm>({
    resolver: zodResolver(createLobbySchema),
  });

  const submitCreateLobby = createLobbyForm.handleSubmit(async (values) => {
    const created = await createLobby(values.name);
    if (!created)
      return createLobbyForm.setError("root", {
        message: "Erro ao criar lobby",
      });
    setIsNavigating(true);
    router.push(`/lobby/${created.id}`);
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Golpe à Vista</h1>

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
                disabled={
                  createLobbyForm.formState.isSubmitting ||
                  !createLobbyForm.formState.isValid ||
                  isNavigating
                }
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
        <JoinLobbyForm />
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2025 Congresso Simulator. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
