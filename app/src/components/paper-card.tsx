import React, { HTMLProps, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

const PaperCard = ({
  children,
  ...divProps
}: PropsWithChildren & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...divProps}
      className={cn(
        "relative font-special-elite rounded-md p-4 flex flex-col justify-center items-center",
        "w-56 h-80 shadow-md border border-gray-400 ring-1 ring-gray-300",
        "bg-gray-50 bg-opacity-90 shadow-inner brightness-95",
        divProps.className
      )}
      style={{
        backgroundImage: "url('/images/paper-texture.jpg')",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        ...divProps.style,
      }}
    >
      {children}
    </div>
  );
};

export default PaperCard;
