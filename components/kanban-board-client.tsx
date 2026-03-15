"use client";

import dynamic from "next/dynamic";
import { Board } from "@/lib/models/models.types";
import { Spinner } from "./ui/spinner";

const KanbanBoard = dynamic(() => import("@/components/kanban-board"), {
  ssr: false,
  loading: () => <div className="flex items-center gap-2 justify-center">Loading board <Spinner /></div>,
});

interface KanbanBoardClientProps {
  board: Board;
  userId: string;
}

export default function KanbanBoardClient({ board, userId }: KanbanBoardClientProps) {
  return <KanbanBoard board={board} userId={userId} />;
}
