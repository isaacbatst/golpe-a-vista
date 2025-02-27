import CardOverlay from "@/components/card-overlay";
import PaperCard from "@/components/paper-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <PaperCard className="justify-center" {...containerProps}>
      <CardOverlay isShowing={showingOverlay}>{overlay}</CardOverlay>

      <div className="flex-1 flex flex-col justify-center gap-6">
      <h3 className="font-bold text-3xl text-red-600 tracking-wide  text-center font-bebas">
        {crisis.title}
      </h3>
      <p className="text-gray-700 italic text-xs leading-relaxed text-justify">
        {crisis.description}
      </p>
      </div>

      <div className="flex justify-between self-end items-center gap-2">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div
                className="font-semibold uppercase relative font-bebas tracking-wider pl-5 py-1 flex  rounded-md "
              >
                <span className="text-gray-600">
                  {crisis.visibleTo.join(", ")}
                </span>
                <ScanEye className="h-4 w-4 text-gray-500 absolute top-0 left-0" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Jogadores que saberão da crise</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </PaperCard>
  );
};

export default CrisisCard;
