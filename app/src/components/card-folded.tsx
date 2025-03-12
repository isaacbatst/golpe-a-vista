import PaperCard from "@/components/paper-card";
import { useOverlay } from "@/hooks/useOverlay";
import CardOverlay from "./card-overlay";

const CardFolded = ({
  overlay,
  isOverlayFixed = false,
  isShowingOverlay = false,
  forceShowOverlay = false,
}: {
  isShowingOverlay?: boolean;
  overlay?: React.ReactNode;
  isOverlayFixed?: boolean;
  forceShowOverlay?: boolean;
}) => {
  const { containerProps, showingOverlay } = useOverlay(
    isShowingOverlay,
    isOverlayFixed
  );

  return (
    <PaperCard {...containerProps}>
      {overlay && (
        <CardOverlay isShowing={showingOverlay || forceShowOverlay}>
          {overlay}
        </CardOverlay>
      )}
      <div className="flex flex-col items-center justify-center">
        <p className="mt-2 text-gray-800 uppercase font-bold tracking-wide text-sm">
          Documento Oficial
        </p>
      </div>

      <div className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-md rotate-12 shadow-md">
        Em Análise
      </div>
    </PaperCard>
  );
};

export default CardFolded;
