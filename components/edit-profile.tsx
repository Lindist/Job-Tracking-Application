"use client";

import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { Spinner } from "./ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Camera } from "lucide-react";

export default function EditProfile() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState(session?.user?.name || "");
  const [imagePreview, setImagePreview] = useState<string>(session?.user?.image || "");
  const [isLoading, setIsLoading] = useState(false);

  // When opening, reset to current session data
  const handleOpenStatus = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && session?.user) {
        setName(session.user.name);
        setImagePreview(session.user.image || "");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 5 * 1024 * 1024) {
               alert("Image must be less than 5MB");
               return;
          }
          const img = new Image();
          const url = URL.createObjectURL(file);
          img.onload = () => {
              const canvas = document.createElement("canvas");
              const MAX_SIZE = 64; // 64x64px keeps base64 tiny
              canvas.width = MAX_SIZE;
              canvas.height = MAX_SIZE;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                  ctx.drawImage(img, 0, 0, MAX_SIZE, MAX_SIZE);
                  const compressed = canvas.toDataURL("image/jpeg", 0.7);
                  setImagePreview(compressed);
              }
              URL.revokeObjectURL(url);
          };
          img.src = url;
      }
  }

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          const { error } = await authClient.updateUser({
              name,
              image: imagePreview
          });
          if (error) {
              console.error("Failed to update profile", error);
              alert("Failed to update profile: " + error.message);
          } else {
              setOpen(false);
          }
      } catch (err) {
          console.error(err);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <>
      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleOpenStatus(true); }}>
        Edit Profile
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={handleOpenStatus}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your account details and public avatar.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={imagePreview} className="object-cover" />
                        <AvatarFallback className="text-3xl">{name?.[0]?.toUpperCase() || session?.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white h-6 w-6" />
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                        disabled={isLoading}
                    />
                </div>
                <p className="text-xs text-muted-foreground">Click to upload new avatar</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !name.trim()}>
                {isLoading ? <span className="flex items-center gap-2">Saving <Spinner /></span> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}