import React from "react";
import { LawDTO, LawType } from "../../../../lib/api.types";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { Ban } from "lucide-react";

type Props = {
  law?: LawDTO;
};

const LawCard = ({ law }: Props) => {
  const [showingVeto, setShowingVeto] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  if (!law) {
    return (
      <div
        className={cn(
          "relative font-special-elite rounded-md p-4 flex flex-col justify-center items-center",
          "w-56 h-80 shadow-md border border-gray-400 ring-1 ring-gray-300",
          "bg-gray-50 bg-opacity-90 shadow-inner brightness-95"
        )}
        style={{
          backgroundImage: "url('/images/paper-texture.jpg')",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-80">
          <p className="mt-2 text-gray-600 uppercase font-bold tracking-wide text-sm">
            Documento Oficial
          </p>
        </div>

        <div className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-md rotate-12 shadow-md">
          Em Análise
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative font-special-elite rounded-md p-4 flex flex-col justify-between",
        "w-56 h-80  shadow-md border border-gray-300 ring-1 ring-gray-300",
        "bg-gray-50 bg-opacity-90 shadow-inner brightness-95",
      )}
      style={{
        backgroundImage: "url('/images/paper-texture.jpg')",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
      }}
      onMouseEnter={() => {
        if (isTouchDevice) return;
        setShowingVeto(true);
      }}
      onMouseLeave={() => {
        if (isTouchDevice) return;
        setShowingVeto(false);
      }}
      onClick={() => {
        if (isTouchDevice) return;
        setShowingVeto((prev) => !prev);
      }}
      onTouchStart={() => {
        setIsTouchDevice(true);
        setShowingVeto((prev) => !prev);
      }}
    >
      {/* Efeito de veto ao passar o mouse */}
      <div
        className={cn(
          "absolute transition ease-in-out duration-300 flex items-center justify-center inset-0",
          "bg-gradient-to-b from-transparent to-black rounded-md",
          { "opacity-0": !showingVeto }
        )}
      >
        <Button
          variant="destructive"
          className="gap-2 text-lg flex items-center !h-auto relative"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Veto");
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
        >
          <Ban className="!w-5 !h-5 -top-[1px] relative" />
          <span className="">Vetar Lei</span>
        </Button>
      </div>

      {/* Cabeçalho do documento */}
      <div
        className="self-start rounded-md font-bold uppercase tracking-wider text-xs
      text-gray-800"
      >
        Lei Federal Nº {law.id}/{new Date().getFullYear()}
      </div>

      {/* Conteúdo principal */}
      <div className="mt-4 flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">
          {law.name}
        </h3>
        <p className="text-gray-700 italic text-xs leading-relaxed text-justify">
          {law.description}
        </p>
      </div>

      {/* Rodapé: Identificação do tipo e assinatura */}
      <div className="flex justify-between self-end items-center mt-4">
        <p
          className={cn(
            "font-semibold uppercase font-bebas tracking-wider px-3 py-1 rounded-md border",
            {
              "text-red-500 shadow-red-500 shadow-sm":
                law.type === LawType.PROGRESSISTAS,
              "text-blue-500 shadow-blue-500 shadow-sm":
                law.type === LawType.CONSERVADORES,
            }
          )}
        >
          {law.type}
        </p>
      </div>
    </div>
  );
};

export default LawCard;
