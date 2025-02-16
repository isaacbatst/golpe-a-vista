import { cn } from "../../../lib/utils";

type Props = {
  approvedProgressiveLaws: number;
  approvedConservativeLaws: number;
  lawsToProgressiveWin: number;
  lawsToConservativeWin: number;
};

const ApprovedLaws = ({
  approvedProgressiveLaws,
  approvedConservativeLaws,
  lawsToProgressiveWin,
  lawsToConservativeWin,
}: Props) => {
  return (
    <div className="flex justify-center  divide-solid divide-x-2">
      <div className="text-left px-2">
        <h3 className="text-lg font-semibold mb-2">Leis Progressistas</h3>
        <div className="flex space-x-1">
          {[...Array(lawsToProgressiveWin)].map((_, i) => (
            <div
              key={`progressive-${i}`}
              className={cn("w-6 h-8 rounded", {
                "bg-red-500": i < (approvedProgressiveLaws || 0),
                "bg-gray-200": i >= (approvedProgressiveLaws || 0),
              })}
            />
          ))}
        </div>
      </div>
      <div className="text-left px-2">
        <h3 className="text-lg font-semibold mb-2">Leis Conservadoras</h3>
        <div className="flex space-x-1">
          {[...Array(lawsToConservativeWin)].map((_, i) => (
            <div
              key={`conservative-${i}`}
              className={cn("w-6 h-8 rounded", {
                "bg-blue-500": i < (approvedConservativeLaws || 0),
                "bg-gray-200": i >= (approvedConservativeLaws || 0),
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovedLaws;
