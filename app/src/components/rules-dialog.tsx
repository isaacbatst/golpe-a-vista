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
import {
  Check,
  Crown,
  FileText,
  Flame,
  Info,
  Shield,
  Target,
  Users,
  Gavel,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import type { ReactNode } from "react";
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
    <ul className="space-y-2 pl-2 list-inside">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-1.5 h-1.5 rounded-full bg-${color} mt-2`}
          ></div>
          <p className="text-gray-700">{tip}</p>
        </li>
      ))}
    </ul>
  </div>
);

const GeneralRuleSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const RuleCard = ({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) => (
  <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-400 to-gray-600"></div>
    <div className="p-4 pl-5">
      <div className="font-medium text-gray-800 mb-1">{title}</div>
      <div className="text-gray-600">{description}</div>
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
          color="yellow-500"
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
                "Se o alvo de uma Impeachment for o último conservador, a Impeachment é aprovada sem votação.",
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
          color="red-500"
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
    intro: "Desacelere o avanço progressista, a sociedade não está pronta.",
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
          color="blue-500"
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

export function RulesDialog({ onOpenChange, open, role }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="roles-dialog-scroll sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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

        <Tabs defaultValue={role} className="flex flex-col items-center">
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
                {roles[key as keyof typeof roles].title[0]}
              </TabsTrigger>
            ))}
            <TabsTrigger value="general" className={`flex items-center gap-1`}>
              <Info className="h-5 w-5" />
              Geral
            </TabsTrigger>
          </TabsList>

          {Object.keys(roles).map((key) => {
            const roleData = roles[key as keyof typeof roles];
            return (
              <TabsContent key={key} value={key} className="text-left">
                <div className={`flex flex-col gap-4 md:flex-row-reverse`}>
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
                        className={`absolute top-2 right-2 bg-gradient-to-r ${roleData.color}`}
                      >
                        {roleData.title}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className="overflow-y-auto roles-dialog-scroll pr-2 "
                    style={{ maxHeight: "60vh" }}
                  >
                    {roleData.description}
                  </div>
                </div>
              </TabsContent>
            );
          })}

          <TabsContent value="general" className="text-left w-full">
            <div
              className="overflow-y-auto roles-dialog-scroll pr-2"
              style={{ maxHeight: "60vh" }}
            >
              <div className="space-y-8">
                <GeneralRuleSection
                  title="Visão Geral do Jogo"
                  icon={<BookOpen className="h-5 w-5 text-gray-700" />}
                >
                  <RuleCard
                    title="Objetivo do Jogo"
                    description={
                      <p>
                        Congresso Simulator é um jogo de blefe e dedução social onde
                        jogadores são divididos em três papéis: Moderados,
                        Radical e Conservadores. Cada grupo tem objetivos
                        diferentes e tenta identificar os outros enquanto
                        esconde sua própria identidade.
                      </p>
                    }
                  />
                  <RuleCard
                    title="Distribuição de Papéis"
                    description={
                      <div>
                        <p>
                          Para 7-10 jogadores, os papéis são distribuídos da
                          seguinte forma:
                        </p>
                        <ul className="list-disc list-inside mt-2">
                          <li>1 Radical</li>
                          <li>
                            2-3 Conservadores (dependendo do número de
                            jogadores)
                          </li>
                          <li>Restante como Moderados</li>
                        </ul>
                      </div>
                    }
                  />
                </GeneralRuleSection>

                <GeneralRuleSection
                  title="Fluxo do Jogo"
                  icon={<Users className="h-5 w-5 text-gray-700" />}
                >
                  <RuleCard
                    title="Rodadas"
                    description={
                      <div>
                        <p>
                          O jogo é dividido em rodadas, onde cada jogador assume
                          o papel de Presidente uma vez antes de reiniciar a
                          ordem.
                        </p>
                        <p className="mt-2">
                          Cada rodada segue esta estrutura:
                        </p>
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                          <li>Definir o Presidente</li>
                          <li>Distribuir 3 leis aleatórias ao Presidente</li>
                          <li>O Presidente veta uma lei</li>
                          <li>
                            O Presidente escolhe uma das duas leis restantes
                          </li>
                          <li>Todos votam se aprovam ou rejeitam a lei</li>
                          <li>Se aprovada, a lei entra em vigor</li>
                          <li>
                            O Presidente escolhe quem receberá o Dossiê na
                            próxima rodada
                          </li>
                        </ol>
                      </div>
                    }
                  />
                </GeneralRuleSection>

                <GeneralRuleSection
                  title="Leis e Votação"
                  icon={<Gavel className="h-5 w-5 text-gray-700" />}
                >
                  <RuleCard
                    title="Baralho de Leis"
                    description={
                      <div>
                        <p>O baralho contém:</p>
                        <ul className="list-disc list-inside mt-2">
                          <li>7 leis progressistas</li>
                          <li>13 leis conservadoras</li>
                        </ul>
                        <p className="mt-2">
                          As leis não têm efeito direto, apenas contam para a
                          vitória do time correspondente.
                        </p>
                      </div>
                    }
                  />
                  <RuleCard
                    title="Votação"
                    description={
                      <div>
                        <p>
                          Todos os jogadores votam publicamente se aprovam ou
                          rejeitam a lei proposta pelo Presidente.
                        </p>
                        <ul className="list-disc list-inside mt-2">
                          <li>Se a maioria aprovar: A lei entra em vigor</li>
                          <li>
                            Se a maioria rejeitar: Nenhuma lei entra em vigor e
                            a rodada termina
                          </li>
                        </ul>
                        <p className="mt-2 font-semibold">
                          Leis rejeitadas geram uma crise.
                        </p>
                      </div>
                    }
                  />
                </GeneralRuleSection>

                <GeneralRuleSection
                  title="Mecânicas Especiais"
                  icon={<AlertTriangle className="h-5 w-5 text-gray-700" />}
                >
                  <RuleCard
                    title="Crises podem ser ativadas:"
                    description={
                      <div>
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                          <li>
                            Quando um moderado aprova a partir da segunda lei
                            progressista consecutiva
                          </li>
                          <li>
                            Quando os conservadores sabotam após a aprovação de
                            uma lei progressista
                          </li>
                          <li>Quando uma lei é rejeitada na votação</li>
                        </ol>
                        <p className="mt-2">
                          Crises tem efeitos variados, mas no geral beneficiam
                          os conservadores.
                        </p>
                      </div>
                    }
                  />
                  <RuleCard
                    title="Impeachment"
                    description={
                      <div>
                        <p>
                          A cada três crises ativadas, os jogadores votam para
                          cassar um jogador.
                        </p>
                        <p className="mt-2">
                          O jogador cassado sai do jogo sem revelar sua
                          identidade.
                        </p>
                      </div>
                    }
                  />
                  <RuleCard
                    title="Dossiê"
                    description={
                      <div>
                        <p>
                          Depois da votação da lei, o ex-Presidente escolhe quem
                          receberá o Dossiê.
                        </p>
                        <ul className="list-disc list-inside mt-2">
                          <li>Não pode escolher a si mesmo</li>
                          <li>
                            Não pode escolher um jogador que tenha recebido o
                            Dossiê na rodada anterior
                          </li>
                          <li>Não pode escolher o próximo Presidente.</li>
                        </ul>
                        <p className="mt-2">
                          O jogador escolhido recebe informação privada sobre as
                          leis do Presidente atual, exceto sobre a lei
                          descartada.
                        </p>
                      </div>
                    }
                  />
                </GeneralRuleSection>
              </div>
            </div>
          </TabsContent>
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
