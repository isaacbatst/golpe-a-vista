'use client'
import { use } from "react";

export default function LobbyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const {id} = use(params);
  return <p>
    {id}
  </p>
}