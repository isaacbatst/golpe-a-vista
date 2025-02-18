import React, { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = {
  isShowing: boolean;
  children?: React.ReactNode;
};

const CardOverlay = ({ isShowing, children }: PropsWithChildren<Props>) => {
  return (
    <div
      className={cn(
        "absolute transition ease-in-out duration-300 flex items-center justify-center inset-0",
        "bg-gradient-to-b from-transparent to-black rounded-md",
        { "opacity-0": !isShowing }
      )}
    >
      {children}
    </div>
  );
};

export default CardOverlay;
