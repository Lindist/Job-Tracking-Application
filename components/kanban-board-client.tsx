"use client";

import dynamic from "next/dynamic";
import { Board } from "@/lib/models/models.types";

const KanbanBoard = dynamic(() => import("@/components/kanban-board"), {
  ssr: false,
  loading: () => <p>Loading board...</p>,
});

interface KanbanBoardClientProps {
  board: Board;
  userId: string;
}

export default function KanbanBoardClient({ board, userId }: KanbanBoardClientProps) {
  return <KanbanBoard board={board} userId={userId} />;
}
