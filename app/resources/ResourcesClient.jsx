"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  VideoIcon,
  PaperclipIcon,
  Edit2Icon,
  Search,
  Link as LinkIcon,
  Download,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VideoPlayer from "./VideoPlayer";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResourcesClient({ resourcesData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "books";


  const filterResources = (resources) => {
    return resources.filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleTabChange = (value) => {
    router.push(`/resources?tab=${value}`);
  };
  return (
    <>
      {/* Existing header and search code unchanged */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Learning Resources
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore a curated collection of blogs, videos, books, and research
          papers for pharmaceutical studies.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mb-8 sm:mb-10 max-w-2xl mx-auto"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
        <Input
          type="text"
          placeholder="Search resources..."
          className="pl-10 py-5 text-sm sm:text-base rounded-lg border border-border/50 focus:ring-2 focus:ring-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="flex justify-center gap-2 sm:gap-4 bg-transparent p-0">
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
        </TabsList>

        {["books", "videos", "papers", "blogs"].map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filterResources(resourcesData[type]).map((resource, index) => (
                <motion.div
                  key={resource._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ResourceCard
                    resource={resource}
                    formatFileSize={formatFileSize}
                    onPreview={() => setSelectedVideo(resource)}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedVideo && (
        <Dialog
          open={!!selectedVideo}
          onOpenChange={() => setSelectedVideo(null)}
        >
          <DialogContent className="p-0 border-none max-w-4xl">
            <DialogHeader className="p-4 bg-muted rounded-lg">
              <DialogTitle>{selectedVideo.title}</DialogTitle>
            </DialogHeader>
            <VideoPlayer
              src={selectedVideo.link}
              title={selectedVideo.title}
              autoPlay={false}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function ResourceCard({ resource, formatFileSize, onPreview }) {
  return (
    <Card className="group bg-card/90 backdrop-blur-sm border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold line-clamp-2">
          <VideoIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          {resource.title}
        </CardTitle>
        <Badge variant="secondary" className="mt-2 w-fit">
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {resource.type === "video" && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onPreview}
          >
            <Play className="h-4 w-4 mr-2" />
            Preview Video
          </Button>
        )}
        {resource.description && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Description:</span>{" "}
            {resource.description}
          </p>
        )}
        {resource.fileSize && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Size:</span>{" "}
            {formatFileSize(resource.fileSize)}
          </p>
        )}
        {Object.entries(resource.metadata || {}).map(([key, value]) =>
          key === "content" && resource.type === "blog" ? (
            <div
              key={key}
              className="text-sm text-muted-foreground prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: value.substring(0, 115) + "...",
              }}
            />
          ) : (
            <p key={key} className="text-sm text-muted-foreground">
              <span className="font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>{" "}
              {value.substring(0, 50)}
            </p>
          )
        )}
        <div className="mt-3 space-y-2">
          {resource.type !== "video" && (
            <div className="flex gap-2">
              {(resource.type === "book" || resource.type === "paper") && (
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a
                    href={`${resource.link}?fl_attachment=true`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
              <Link
                href={resource.type === "blog" ? resource.link : "#"}
                rel={
                  resource.type === "blog" ? "noopener noreferrer" : undefined
                }
                className="inline-flex items-center gap-2 text-primary text-sm sm:text-base font-medium hover:underline group-hover:translate-x-1 transition-transform"
              >
                <LinkIcon className="h-4 w-4" />
                {resource.type === "book" || resource.type === "paper"
                  ? "View"
                  : "Read"}
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
