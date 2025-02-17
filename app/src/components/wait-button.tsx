import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { PropsWithChildren } from "react";

const WaitButton = (props: PropsWithChildren) => {
  return (
    <Button className="flex" variant="default" disabled>
      <Loader2 className="animate-spin" />
      {props.children}
    </Button>
  );
};

export default WaitButton;
