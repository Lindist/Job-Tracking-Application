import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import KanbanBoardClient from "@/components/kanban-board-client";
import { Suspense } from "react";
import CreateColumnDialog from "@/components/create-column-dialog";
import { Spinner } from "@/components/ui/spinner"


async function getBoard(userId: string) {
  "use cache";

  await connectDB();

  const boardDoc = await Board.findOne({
    userId: userId,
    name: "Job Hunt",
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },
  });

  if (!boardDoc) return null;

  const board = JSON.parse(JSON.stringify(boardDoc));

  return board;
}

async function DashboardPage() {
    const session = await getSession();
    const board = await getBoard(session?.user.id ?? "");

    if (!session?.user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-6 flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Job Hunt</h1>
                        <p className="text-gray-600">Track your job applications</p>
                    </div>
                    <div className="flex-shrink-0">
                        <CreateColumnDialog boardId={board._id as string} />
                    </div>
                </div>
                <KanbanBoardClient board={board} userId={session?.user.id} />
            </div>
        </div>
    );
}

export default async function Dashboard() {
    return (
        <Suspense fallback={<div className="flex items-center gap-2 justify-center">Loading Dashboard <Spinner /></div>}>
            <DashboardPage />
        </Suspense>
    );
}