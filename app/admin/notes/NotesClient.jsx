"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Edit, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function NotesClient({ initialNotes, adminSession }) {
  const [notes, setNotes] = useState(initialNotes);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading for each note
  const router = useRouter();

  console.log(adminSession.user)

  const hasFullAccess =
    adminSession?.user?.isAdmin &&
    adminSession?.user.adminRole === "superadmin";
  // Ensure permissions is an array
  const userPermissions = Array.isArray(adminSession?.user?.permissions)
    ? adminSession.user.permissions[0].split(",") // Convert first element string into an array
    : [];

  const canCreate = hasFullAccess || userPermissions.includes("create");
  const canRead = hasFullAccess || userPermissions.includes("read");
  const canUpdate = hasFullAccess || userPermissions.includes("update");
  const canDelete = hasFullAccess || userPermissions.includes("delete");

  console.log(canCreate,canRead,canUpdate,canDelete)

  // Handle Note Deletion
  const handleDelete = async (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { delete: true } }));
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes(notes.filter((note) => note._id !== id));
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete note");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { delete: false } }));
    }
  };

  // Handle Note Editing
  const handleEdit = (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { edit: true } }));
    router.push(`/admin/notes/edit/${id}`);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold">Manage Notes</h1>

        {/* Show "Add Note" button only if the user has create permission */}
        {canCreate && (
          <Link href="/admin/notes/create">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Add Note
            </Button>
          </Link>
        )}
      </div>

      {/* Notes List */}
      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Notes List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* If user has no read access */}
          {!canRead ? (
            <p className="text-center text-red-500">
              You do not have permission to view notes.
            </p>
          ) : notes.length === 0 ? (
            <p className="text-center">No notes available.</p>
          ) : (
            <div className="grid gap-6 overflow-x-hidden">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full overflow-hidden"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium truncate">
                        {note.title}
                      </h3>
                      <p className="text-sm truncate">{note.subject}</p>
                      <p className="text-xs truncate">
                        {note.description.substring(0, 50)}...
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline">{note.type}</Badge>
                        <Badge variant="secondary">
                          {note.updatedAt
                            ? new Date(note.updatedAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : "Never"}
                        </Badge>
                        <Badge variant="outline">By: {note.ownerName}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit & Delete) */}
                  <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    {/* Edit Button (Only if user has update permission) */}
                    {canUpdate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(note._id)}
                        disabled={
                          loadingStates[note._id]?.edit ||
                          loadingStates[note._id]?.delete
                        }
                      >
                        {loadingStates[note._id]?.edit ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {/* Delete Button (Only if user has delete permission) */}
                    {canDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="hover:bg-red-600"
                        onClick={() => handleDelete(note._id)}
                        disabled={
                          loadingStates[note._id]?.edit ||
                          loadingStates[note._id]?.delete
                        }
                      >
                        {loadingStates[note._id]?.delete ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
