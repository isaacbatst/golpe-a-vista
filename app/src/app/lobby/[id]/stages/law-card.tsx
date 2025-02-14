import React from "react";
import { LawDTO, LawType } from "../../../../lib/api.types";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { Ban } from "lucide-react";

type Props = {
  law?: LawDTO;
};

const LawCard = ({ law: law }: Props) => {
  const [showingVeto, setShowingVeto] = React.useState(false);

  if (!law) {
    return <div className="bg-gray-200 animate-pulse w-32 h-48 rounded-lg" />;
  }
  return (
    // w-32 h-48 is a fixed size, should be bigger with this ratio
    <div
      className={cn(
        "relative font-special-elite rounded-md p-4 flex flex-col justify-between w-56 h-80 lg:w-72",
        "lg:h-96  shadow"
      )}
      style={{
        backgroundImage: "url('/images/paper-texture.jpg')",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
      }}
      onMouseEnter={() => {
        setShowingVeto(true);
      }}
      onMouseLeave={() => {
        setShowingVeto(false);
      }}
    >
      <div
        className={cn(
          "absolute transition ease-in-out flex items-center justify-center inset-0",
          "bg-gradient-to-b from-transparent to-black rounded-md",
          { "opacity-0": !showingVeto }
        )}
      >
        <Button
          variant="destructive"
          className=" gap-2 text-xl flex items-center !h-auto relative "
          onClick={() => {
            console.log("Veto");
          }}
        >
          <Ban className="!w-5 !h-5 -top-[1px] relative" />
          <span className="">Vetar Lei</span>
        </Button>
      </div>
      {/* Cabeçalho do documento (efeito de carimbo leve) */}
      <div
        className="self-start rounded-md font-bold uppercase tracking-wider font-bebas
    text-gray-800  "
      >
        Lei Federal Nº {law.id}/{new Date().getFullYear()}
      </div>

      {/* Conteúdo principal */}
      <div className="mt-4 flex flex-col">
        <h3 className="font-bold text-xl text-gray-900 mb-4 text-center">
          {law.name}
        </h3>
        <p className="text-gray-700 italic text-sm leading-relaxed text-justify">
          {law.description}
        </p>
      </div>

      {/* Rodapé: Identificação do tipo e assinatura */}
      <div className="flex justify-between self-end items-center mt-4">
        <p
          className={cn(
            "font-semibold uppercase text-lg font-bebas tracking-wider  px-3 py-1 rounded-md border",
            {
              " text-red-700 shadow-red-500 shadow-sm":
                law.type === LawType.CONSERVADORES,
              " text-blue-700 shadow-blue-500 shadow-sm":
                law.type === LawType.PROGRESSISTAS,
            }
          )}
        >
          {law.type}
        </p>
        {/* Simulação de assinatura */}
        {/* <p className="text-gray-600 italic text-sm">Ass. Presidente</p> */}
      </div>
    </div>
  );
};

export default LawCard;
