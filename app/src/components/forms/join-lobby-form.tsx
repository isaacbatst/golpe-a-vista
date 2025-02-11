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
import { joinLobby } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { DoorOpen, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const joinLobbySchema = z.object({
  name: z.string(),
  code: z.string(),
});

type JoinLobbyFormInputs = z.infer<typeof joinLobbySchema>;

type Props = {
  initialValues?: Partial<JoinLobbyFormInputs>;
};

export default function JoinLobbyForm({ initialValues }: Props) {
  const router = useRouter();

  const joinLobbyForm = useForm<JoinLobbyFormInputs>({
    resolver: zodResolver(joinLobbySchema),
    values: {
      code: initialValues?.code || "",
      name: initialValues?.name || "",
    },
  });

  const submitJoinLobby = joinLobbyForm.handleSubmit(async (values) => {
    const joined = await joinLobby(values.code, values.name);
    if (!joined)
      return joinLobbyForm.setError("root", {
        message: "Erro ao entrar no lobby",
      });
    router.push(`/lobby/${values.code}`);
  });

  const joinLobbyFormCode = joinLobbyForm.register("code");

  return (
    <form onSubmit={submitJoinLobby}>
      <Card>
        <CardHeader>
          <CardTitle>Entrar em jogo existente</CardTitle>
          <CardDescription>
            Entre em um lobby já criado por outro jogador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="join-form-code" className="text-sm font-medium">
              Código do lobby
            </label>
            <Input
              {...joinLobbyFormCode}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                return joinLobbyFormCode.onChange(e);
              }}
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
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={
              joinLobbyForm.formState.isSubmitting ||
              !joinLobbyForm.formState.isValid
            }
          >
            {joinLobbyForm.formState.isSubmitting ? (
              <LoaderCircle />
            ) : (
              <DoorOpen />
            )}
            Entrar no Lobby
          </Button>
          {joinLobbyForm.formState.errors.root && (
            <p className="text-red-500 text-sm text-center">
              {joinLobbyForm.formState.errors.root.message}
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
