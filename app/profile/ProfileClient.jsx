"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, FileText, Mail, Calendar, Shield, User } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileClient({ profileData }) {
  const { user, stats } = profileData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Profile Header */}
      <Card className="bg-card/90 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-2xl sm:text-3xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              {user.name}
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground">
              {user.email}
            </p>
            {user.isAdmin && (
              <Badge variant="secondary" className="mt-2 capitalize">
                <Shield className="h-4 w-4 mr-1" />
                {user.adminRole || "Admin"}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Profile Details */}
      <Card className="bg-card/90 backdrop-blur-sm border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Joined</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-sm text-muted-foreground">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
            {user.isAdmin && (
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Permissions</p>
                  <p className="text-sm text-muted-foreground">
                    {user.permissions.length > 0
                      ? user.permissions.join(", ")
                      : "None"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contributions */}
      <Card className="bg-card/90 backdrop-blur-sm border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Book className="h-6 w-6 text-primary" />
            <div>
              <p className="text-lg font-semibold">{stats.notesCount}</p>
              <p className="text-sm text-muted-foreground">Notes Uploaded</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <p className="text-lg font-semibold">{stats.resourcesCount}</p>
              <p className="text-sm text-muted-foreground">
                Resources Uploaded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
