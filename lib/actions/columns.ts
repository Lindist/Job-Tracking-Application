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

export async function createColumn(data: { name: string; boardId: string }) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const { name, boardId } = data;

  if (!name || !name.trim()) {
    return { error: "Column name is required" };
  }

  await connectDB();

  // Verify the board belongs to the user
  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found or unauthorized" };
  }

  // Get the highest order to append at the end
  const maxOrderDoc = await Column.findOne({ boardId })
    .sort({ order: -1 })
    .select("order")
    .lean() as { order: number } | null;

  const maxOrder = maxOrderDoc ? maxOrderDoc.order : -100;

  const newColumn = await Column.create({
    name: name.trim(),
    boardId,
    order: maxOrder + 100,
  });

  // Add the new column to the board's columns array
  await Board.findByIdAndUpdate(boardId, {
    $push: { columns: newColumn._id }
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(newColumn)) };
}
