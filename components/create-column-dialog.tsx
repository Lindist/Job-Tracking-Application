"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";
import { createColumn } from "@/lib/actions/columns";

interface CreateColumnDialogProps {
    boardId: string;
}

const INITIAL_FORM_DATA = {
    name: "",
};

export default function CreateColumnDialog({ boardId }
    : CreateColumnDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const result = await createColumn({
                ...formData,
                boardId,
            });

            if (result?.error) {
                console.error("Error creating column:", result.error);
            } else {
                setOpen(false);
                setFormData(INITIAL_FORM_DATA);
            }
        } catch (error) {
            console.error("Error creating column:", error);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-6 w-6" />
                    Add Column
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Column</DialogTitle>
                    <DialogDescription>
                        Track a new column
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit} >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-500 text-white">Add Column</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}