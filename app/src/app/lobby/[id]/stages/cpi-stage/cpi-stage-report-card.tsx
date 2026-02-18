import LawCard from "@/components/law-card/law-card";
import { LawDTO } from "@/lib/api.types";

type Props = {
  law: LawDTO;
};

const CPIStageReportCard = ({ law }: Props) => {
  return (
    <li>
      <LawCard
        law={{
          type: law.type,
          name: law.name,
          id: law.id,
          description: law.description,
        }}
        isOverlayFixed
      />
    </li>
  );
};

export default CPIStageReportCard;
