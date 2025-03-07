"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Role } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import { Check, Crown, FileText, Flame, Shield, Target } from "lucide-react";
import { ReactNode } from "react";
import "./roles-dialog.css";

const RoleObjectives = ({
  objectives,
  color,
}: {
  objectives: string[];
  color: string;
}) => (
  <div>
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Target className={`h-5 w-5 ${color}`} />
      Objetivos
    </h3>
    <div className="space-y-3">
      {objectives.map((objective, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg"
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-medium`}
          >
            {index + 1}
          </div>
          <div>{objective}</div>
        </div>
      ))}
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      *Ganhe ao cumprir <strong>pelo menos um dos objetivos</strong>.
    </p>
  </div>
);

const RolePowers = ({
  powers,
  color,
}: {
  powers: { title: string; description: string | ReactNode }[];
  color: string;
}) => (
  <div>
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Shield className={`h-5 w-5 ${color}`} />
      Características
    </h3>
    <div className="space-y-4">
      {powers.map((power, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-yellow-100"
        >
          <div
            className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color}`}
          ></div>
          <div className="p-4 pl-5">
            <div className={`font-medium ${color} mb-1`}>{power.title}</div>
            {typeof power.description === "string" ? (
              <p className="text-gray-600">{power.description}</p>
            ) : (
              <div className="text-gray-600">{power.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RoleTips = ({ tips, color }: { tips: string[]; color: string }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <FileText className={`h-5 w-5 ${color}`} />
      Dicas Estratégicas
    </h3>
    <div className="space-y-2 pl-2">
      {tips.map((tip, index) => (
        <div key={index} className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${color} mt-2`}
          ></div>
          <p className="text-gray-700">{tip}</p>
        </div>
      ))}
    </div>
  </div>
);

const roles = {
  [Role.MODERADO]: {
    title: "Moderado",
    color: "from-yellow-400 to-yellow-500",
    lightColor: "from-yellow-50 to-yellow-100",
    textColor: "text-yellow-600",
    intro: "Avance leis progressistas, mas com cuidado para não gerar crises.",
    borderColor: "border-yellow-400",
    icon: <Shield className="h-5 w-5" />,
    description: (
      <div className="space-y-8">
        <RoleObjectives
          objectives={[
            "Aprovar 6 leis progressistas",
            "Cassar todos os conservadores",
          ]}
          color="from-yellow-400 to-yellow-500"
        />
        <RolePowers
          powers={[
            {
              title: "Receio",
              description:
                "Se, como presidente, aprovar uma segunda lei progressista consecutiva, gerará uma crise na rodada seguinte.",
            },
          ]}
          color="from-yellow-400 to-yellow-500"
        />
        <RoleTips
          tips={[
            "Colabore com outros moderados para identificar o radical",
            "Evite aprovar leis progressistas em sequência para não gerar crises",
            "Use o dossiê para verificar a honestidade dos outros jogadores",
          ]}
          color="from-yellow-500"
        />
      </div>
    ),
    image: "/images/mod.webp",
  },
  [Role.RADICAL]: {
    title: "Radical",
    color: "from-red-400 to-red-500",
    lightColor: "from-red-50 to-red-100",
    textColor: "text-red-600",
    intro: "Impessoal e sem medo de radicalizar, você busca a revolução.",
    borderColor: "border-red-400",
    icon: <Flame className="h-5 w-5" />,
    description: (
      <div className="space-y-8">
        <RoleObjectives
          objectives={[
            "Cassar todos os conservadores",
            "Radicalizar metade dos moderados",
          ]}
          color="from-red-400 to-red-500"
        />
        <RolePowers
          powers={[
            {
              title: "Radicalização",
              description: (
                <div>
                  <p>Quando houver:</p>
                  <ul className="list-disc list-inside">
                    <li>
                      4 leis progressistas <strong>OU</strong> 4 leis
                      conservadoras
                    </li>
                    <li>
                      <strong>E</strong> 1 crise ativa
                    </li>
                  </ul>

                  <p>
                    Pode tentar radicalizar um jogador, mas se ele for
                    conservador, nada acontece.
                  </p>
                </div>
              ),
            },
            {
              title: "Revolução Armada",
              description:
                "Se o alvo de uma cassação for o último conservador, a cassação é aprovada sem votação.",
            },
          ]}
          color="from-red-400 to-red-500"
        />
        <RoleTips
          tips={[
            "Mantenha sua identidade em segredo a todo custo",
            "Tente identificar os conservadores para evitar que eles recebam o dossiê",
            "Construa confiança com os moderados para que eles sigam suas orientações",
          ]}
          color="from-red-500"
        />
      </div>
    ),
    image: "/images/rad.webp",
  },
  [Role.CONSERVADOR]: {
    title: "Conservador",
    color: "from-blue-400 to-blue-500",
    lightColor: "from-blue-50 to-blue-100",
    textColor: "text-blue-600",
    intro: "Impeça a revolução e mantenha a ordem vigente.",
    borderColor: "border-blue-400",
    icon: <Crown className="h-5 w-5" />,
    description: (
      <div className="space-y-8">
        <RoleObjectives
          objectives={["Cassar o radical", "Aprovar 7 leis conservadoras"]}
          color="from-blue-400 to-blue-500"
        />
        <RolePowers
          powers={[
            {
              title: "Consciência de Classe",
              description:
                "Conservadores se conhecem e não podem ser radicalizados.",
            },
            {
              title: "Sabotagem",
              description:
                "Quando uma lei progressista é aprovada, você pode sabotar o governo, gerando uma crise na rodada seguinte.",
            },
            {
              title: "Limite",
              description: "Não pode sabotar duas rodadas seguidas.",
            },
          ]}
          color="from-blue-400 to-blue-500"
        />
        <RoleTips
          tips={[
            "Coordene com outros conservadores para identificar e cassar o radical",
            "Use a sabotagem estrategicamente para gerar desconfiança entre os progressistas",
            "Tente se passar por moderado para ganhar confiança",
          ]}
          color="from-blue-500"
        />
      </div>
    ),
    image: "/images/con.webp",
  },
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
};

export function RolesDialog({ onOpenChange, open, role }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {role && roles[role].icon}
            <span>
              Seu Papel:{" "}
              <span className={roles[role]?.textColor}>
                {role ? roles[role].title : "..."}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="text-base">
            {roles[role]?.intro ?? "aaa"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={role} className="w-full">
          <TabsList className="flex justify-center mb-4">
            {Object.keys(roles).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className={`flex items-center gap-1 ${
                  key === role ? roles[key as keyof typeof roles].textColor : ""
                }`}
              >
                {roles[key as keyof typeof roles].icon}
                {roles[key as keyof typeof roles].title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(roles).map((key) => {
            const roleData = roles[key as keyof typeof roles];
            return (
              <TabsContent key={key} value={key} className="text-left">
                <div className={`grid md:grid-cols-2 rounded-lg`}>
                  <div
                    className="overflow-y-auto roles-dialog-scroll pr-2"
                    style={{ maxHeight: "60vh" }}
                  >
                    {roleData.description}
                  </div>

                  <div className="flex justify-center items-start">
                    <div
                      className={`relative rounded-lg overflow-hidden border-2 ${roleData.borderColor}`}
                      style={{
                        backgroundImage: `url(${
                          roleData.image || "/placeholder.svg"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: 250,
                        height: 350,
                      }}
                    >
                      <Badge
                        className={`absolute top-2 right-2 ${roleData.color}`}
                      >
                        {roleData.title}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>
            <Check />
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
