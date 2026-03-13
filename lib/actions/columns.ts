"use server"
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Column, Board } from "../models";

export async function renameColumn(columnId: string, newName: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  if (!newName || !newName.trim()) {
    return { error: "Column name cannot be empty" };
  }

  await connectDB();

  const column = await Column.findById(columnId);
  if (!column) {
    return { error: "Column not found" };
  }

  // Verify the column belongs to a board owned by the user
  const board = await Board.findOne({
    _id: column.boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Unauthorized" };
  }

  await Column.findByIdAndUpdate(columnId, { name: newName.trim() });

  revalidatePath("/dashboard");

  return { success: true };
}
