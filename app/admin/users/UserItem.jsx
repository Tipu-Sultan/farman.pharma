// app/admin/users/UserItem.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserItem({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [editUser, setEditUser] = useState(null);
  const router = useRouter();

  const handleUpdateUser = async () => {
    const res = await fetch(`/api/users/${editUser._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isAdmin: editUser.isAdmin,
        permissions: editUser.permissions, // Already an array from state
        adminRole: editUser.adminRole, // Include adminRole in the update
      }),
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditUser(null);
      router.refresh(); // Refresh the page to reflect changes
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error}`); // Basic error feedback
    }
  };

  const handleDeleteUser = async () => {
    const res = await fetch(`/api/users/${user._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh(); // Refresh the page to reflect deletion
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error}`); // Basic error feedback
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <UserIcon className="h-8 w-8 text-primary" />
        <div>
          <h3 className="text-lg font-medium">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {user.isAdmin && (
              <Badge variant="secondary">{user.adminRole || "Admin"}</Badge>
            )}
            {/* Display permissions as small text labels */}
            {user.permissions && user.permissions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {user.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            )}
            <Badge variant="outline">
              Last Login:{" "}
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "Never"}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditUser(user)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User: {editUser?.name}</DialogTitle>
            </DialogHeader>
            {editUser && (
              <div className="space-y-6 p-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isAdmin"
                    checked={editUser.isAdmin}
                    onCheckedChange={(checked) =>
                      setEditUser({ ...editUser, isAdmin: checked })
                    }
                  />
                  <Label htmlFor="isAdmin" className="text-sm">
                    Admin Status
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permissions" className="text-sm">
                    Permissions (comma-separated)
                  </Label>
                  <Input
                    id="permissions"
                    placeholder="e.g., read, write, delete"
                    value={editUser.permissions.join(", ")} // Display as string
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        permissions: e.target.value.split(", ").filter(Boolean), // Convert to array
                      })
                    }
                    className="border-gray-300 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminRole" className="text-sm">
                    Admin Role
                  </Label>
                  <Select
                    value={editUser.adminRole || "null"} // Default to 'null' if undefined
                    onValueChange={(value) =>
                      setEditUser({
                        ...editUser,
                        adminRole: value === "null" ? null : value, // Convert 'null' string to actual null
                      })
                    }
                  >
                    <SelectTrigger id="adminRole" className="border-gray-300">
                      <SelectValue placeholder="Select admin role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">None</SelectItem>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="content-manager">
                        Content Manager
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleUpdateUser}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Save
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Button
          variant="destructive"
          size="sm"
          className="hover:bg-red-600"
          onClick={handleDeleteUser}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
