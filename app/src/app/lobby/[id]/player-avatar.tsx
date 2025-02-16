import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { cn } from "../../../lib/utils";
import { AvatarProps } from "@radix-ui/react-avatar";

type Props = {
  player: { name: string };
  isMe: boolean;
} & AvatarProps;

const PlayerAvatar = ({ isMe, player, ...avatarProps }: Props) => {
  const params = new URLSearchParams();
  params.set("seed", player.name);
  params.set("backgroundType", "gradientLinear");
  params.set("scale", "80");
  params.set("size", "32");
  return (
    <Avatar
      {...avatarProps}
      className={cn(
        `ring-2 ring-offset-2`,
        {
          "ring-primary": isMe,
          "ring-gray-300": !isMe,
        },
        avatarProps.className
      )}
    >
      <AvatarImage
        src={`https://api.dicebear.com/9.x/initials/svg?${params}`}
      />
      <AvatarFallback>{player.name[0]}</AvatarFallback>
    </Avatar>
  );
};

export default PlayerAvatar;
