import CardOverlay from "@/components/card-overlay";
import PaperCard from "@/components/paper-card";
import { useOverlay } from "@/hooks/useOverlay";
import { CrisisDTO } from "@/lib/api.types";
import { ScanEye } from "lucide-react";
import React from "react";

type Props = {
  crisis: CrisisDTO;
  overlayContent?: React.ReactNode;
  showingOverlayInitialValue?: boolean;
  isOverlayFixed?: boolean;
};

const CrisisCard = ({
  crisis,
  overlayContent: overlay,
  showingOverlayInitialValue = false,
  isOverlayFixed = false,
}: Props) => {
  const { showingOverlay, containerProps } = useOverlay(
    showingOverlayInitialValue,
    isOverlayFixed
  );
  return (
    <PaperCard className="justify-between" {...containerProps}>
      <CardOverlay isShowing={showingOverlay}>{overlay}</CardOverlay>

      <div
        className="self-start rounded-md font-bold uppercase tracking-wider text-xs
      text-gray-800"
      >
        Crise
      </div>

      <div className="mt-4 flex flex-col">
        <h3 className="font-bold text-2xl text-gray-900 mb-4 text-center font-bebas">
          {crisis.title}
        </h3>
        <p className="text-gray-700 italic text-xs leading-relaxed text-justify">
          {crisis.description}
        </p>
      </div>

      <div className="flex justify-between self-end items-center mt-4 gap-2">
        <p className="font-semibold uppercase relative font-bebas tracking-wider px-5 py-1 flex  rounded-md ">
          <span className="text-gray-600">
            {crisis.visibleTo.concat('Relator').join(", ") || "Todos"}
          </span>
          <ScanEye className="h-4 w-4 text-gray-500 absolute top-0 left-0" />
        </p>
      </div>
    </PaperCard>
  );
};

export default CrisisCard;
