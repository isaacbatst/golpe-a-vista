import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { PropsWithChildren } from "react";

const WaitButton = ({
  children,
  ...props
}: PropsWithChildren & ButtonProps) => {
  return (
    <Button {...props} variant="default" disabled>
      <Loader2 className="animate-spin" />
      {children}
    </Button>
  );
};

export default WaitButton;
