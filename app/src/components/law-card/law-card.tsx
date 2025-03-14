import PaperCard from "@/components/paper-card";
import { useOverlay } from "@/hooks/useOverlay";
import { LawDTO, LawType } from "@/lib/api.types";
import { cn } from "@/lib/utils";
import React from "react";
import CardOverlay from "../card-overlay";

type Props = {
  law: LawDTO;
  overlayContent?: React.ReactNode;
  showingOverlayInitialValue?: boolean;
  isOverlayFixed?: boolean;
  forceShowOverlay?: boolean;
};

const LawCard = ({
  law,
  overlayContent: overlay,
  showingOverlayInitialValue = false,
  isOverlayFixed = false,
  forceShowOverlay = false,
}: Props) => {
  const { showingOverlay, containerProps } = useOverlay(
    showingOverlayInitialValue,
    isOverlayFixed
  );
  return (
    <PaperCard className="justify-between" {...containerProps}>
      <CardOverlay isShowing={showingOverlay || forceShowOverlay}>{overlay}</CardOverlay>

      <div
        className="self-start rounded-md font-bold uppercase tracking-wider text-xs
      text-gray-800"
      >
        Lei Federal Nº {law.id}/{new Date().getFullYear()}
      </div>

      <div className="mt-4 flex flex-col">
        <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">
          {law.name}
        </h3>
        <p className="text-gray-700 italic text-xs leading-relaxed text-justify">
          {law.description}
        </p>
      </div>

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
    </PaperCard>
  );
};

export default LawCard;
