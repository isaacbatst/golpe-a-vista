import { Ban } from "lucide-react";

const LawCardOverlayVetoed = () => {
  return (
    <div className="flex flex-col gap-2 items-center text-white">
      <Ban className="!w-10 !h-10" />
      <span className=" font-anton text-2xl text-center">
        Vetada
      </span>
    </div>
  );
};

export default LawCardOverlayVetoed;
