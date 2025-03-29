"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Edit, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ResourcesClient({
  initialResources,
  adminSession,
  isSuperadmin,
}) {
  const [resources, setResources] = useState(initialResources);
  const [loadingStates, setLoadingStates] = useState({});
  const router = useRouter();

 
  const hasFullAccess =
    adminSession?.user?.isAdmin && adminSession?.user.adminRole === "superadmin";
// Ensure permissions is an array
const userPermissions = Array.isArray(adminSession?.user?.permissions)
  ? adminSession.user.permissions[0].split(",") // Convert first element string into an array
  : [];

const canCreate = hasFullAccess || userPermissions.includes("create");
const canRead = hasFullAccess || userPermissions.includes("read");
const canUpdate = hasFullAccess || userPermissions.includes("update");
const canDelete = hasFullAccess || userPermissions.includes("delete");


  const handleDelete = async (id) => {
    if (!canDelete) return alert("You do not have permission to delete this resource.");

    setLoadingStates((prev) => ({ ...prev, [id]: { delete: true } }));

    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResources(resources.filter((resource) => resource._id !== id));
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete resource");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { delete: false } }));
    }
  };

  const handleEdit = (id) => {
    if (!canUpdate) return alert("You do not have permission to edit this resource.");

    setLoadingStates((prev) => ({ ...prev, [id]: { edit: true } }));
    router.push(`/admin/resources/edit/${id}`);
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold">Manage Resources</h1>
        {(isSuperadmin || canCreate) && (
          <Link href="/admin/resources/create">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Add Resource
            </Button>
          </Link>
        )}
      </div>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Resources List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {resources.length === 0 ? (
            <p className="text-center">No resources available.</p>
          ) : (
            <div className="grid gap-6 overflow-x-hidden">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full overflow-hidden"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                    <Upload className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium truncate">{resource.title}</h3>
                      <p className="text-sm truncate">
                        {resource.link.substring(0, 50)}...
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge variant="secondary">By: {resource.ownerName}</Badge>
                        <Badge variant="secondary">
                          {resource.updatedAt
                            ? new Date(resource.updatedAt).toLocaleString("en-GB", {
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

                  {(canUpdate || canDelete) && (
                    <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                      {canUpdate && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-gray-100"
                          onClick={() => handleEdit(resource._id)}
                          disabled={
                            loadingStates[resource._id]?.edit ||
                            loadingStates[resource._id]?.delete
                          }
                        >
                          {loadingStates[resource._id]?.edit ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="hover:bg-red-600"
                          onClick={() => handleDelete(resource._id)}
                          disabled={
                            loadingStates[resource._id]?.edit ||
                            loadingStates[resource._id]?.delete
                          }
                        >
                          {loadingStates[resource._id]?.delete ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
