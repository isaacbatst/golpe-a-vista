import { Ban } from "lucide-react";

const LawCardOverlayDiscarded = () => {
  return (
    <div className="flex flex-col gap-2 items-center text-white">
      <Ban className="!w-10 !h-10" />
      <span className=" font-anton text-2xl text-center">Descartada</span>
    </div>
  );
};

export default LawCardOverlayDiscarded;
