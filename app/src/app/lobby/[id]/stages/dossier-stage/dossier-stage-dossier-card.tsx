import LawCard from "@/components/law-card/law-card";
import { LawDTO } from "@/lib/api.types";
import { useMemo } from "react";

type Props = {
  law: LawDTO;
};

const DossierStageDossierCard = ({ law }: Props) => {
  const generatePlaceholder = () => {
    let words = "";
    const wordsNumber = Math.floor(Math.random() * 10) + 10;
    for (let i = 0; i < wordsNumber; i++) {
      const wordLength = Math.floor(Math.random() * 7) + 3;
      words += "x".repeat(wordLength) + " ";
    }
    return words;
  };

  const placeholder = useMemo(() => generatePlaceholder(), []);

  return (
    <li>
      <LawCard
        law={{
          type: law.type,
          name: "XXXXXX",
          id: "xxxx",
          description: placeholder,
        }}
        isOverlayFixed
      />
    </li>
  );
};

export default DossierStageDossierCard;
