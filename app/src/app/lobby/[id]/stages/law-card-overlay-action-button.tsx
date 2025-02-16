import React, { PropsWithChildren } from "react";
import { Button } from "../../../../components/ui/button";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "../../../../lib/utils";

type Props = {
  icon: React.ComponentProps<typeof DynamicIcon>["name"];
} & React.ComponentProps<typeof Button>;

const LawCardOverlayActionButton = ({
  icon,
  children,
  ...buttonProps
}: PropsWithChildren<Props>) => {
  return (
    <Button
      {...buttonProps}
      className={cn(
        "gap-2 text-lg flex items-center !h-auto relative",
        buttonProps.className
      )}
      onClick={(e) => {
        e.stopPropagation();
        buttonProps.onClick?.(e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        buttonProps.onTouchStart?.(e);
      }}
    >
      <DynamicIcon name={icon} className="!w-5 !h-5 -top-[1px] relative" />
      {children}
    </Button>
  );
};

export default LawCardOverlayActionButton;
