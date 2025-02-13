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
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const joinLobbySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(4),
});

type JoinLobbyFormInputs = z.infer<typeof joinLobbySchema>;

type Props = {
  initialValues?: Partial<JoinLobbyFormInputs>;
  focus?: boolean;
};

export default function JoinLobbyForm({ initialValues, focus }: Props) {
  const router = useRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus) {
      nameInputRef.current?.focus();
    }
  }, [focus]);

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
  const { ref, ...joinLobbyFormName } = joinLobbyForm.register("name");

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
              {...joinLobbyFormName}
              id="join-form-name"
              ref={(e) => {
                ref(e)
                nameInputRef.current = e;
              }}
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
