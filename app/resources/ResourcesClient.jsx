"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  VideoIcon,
  PaperclipIcon,
  Search,
  Image as ImageIcon,
  Download as DownloadIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ResourceCard from "./ResourceCard";
import VideoPlayer from "./VideoPlayer";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResourcesClient({ resourcesData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const tabParams = useSearchParams();
  const router = useRouter();
  const currentTab = tabParams.get("tab") || "books";

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
    <div className="container mx-auto px-4 py-8">
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
          Explore a curated collection of images, books, videos, papers, and blogs.
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
          <TabsTrigger value="images"><ImageIcon className="h-4 w-4 mr-2" />Images</TabsTrigger>
          <TabsTrigger value="books"><BookOpen className="h-4 w-4 mr-2" />Books</TabsTrigger>
          <TabsTrigger value="videos"><VideoIcon className="h-4 w-4 mr-2" />Videos</TabsTrigger>
          <TabsTrigger value="papers"><PaperclipIcon className="h-4 w-4 mr-2" />Papers</TabsTrigger>
          <TabsTrigger value="blogs"><BookOpen className="h-4 w-4 mr-2" />Blogs</TabsTrigger>
        </TabsList>

        {["images", "books", "videos", "papers", "blogs"].map((type) => (
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
                    onPreview={() =>
                      type === "images"
                        ? setSelectedImage(resource)
                        : type === "videos"
                        ? setSelectedVideo(resource)
                        : null
                    }
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="p-0 border-none max-w-4xl">
            <DialogHeader className="p-4 bg-muted rounded-t-lg">
              <DialogTitle>{selectedImage.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {selectedImage.description || "Click download to save the image"}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-background">
              <div className="relative w-full max-h-[70vh] overflow-hidden rounded-lg">
                <img
                  src={selectedImage.link}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                {selectedImage.fileSize && (
                  <p className="text-sm text-muted-foreground">
                    Size: {formatFileSize(selectedImage.fileSize)}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href={selectedImage.link} download target="_blank" rel="noopener noreferrer">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                  <Button variant="secondary" onClick={() => setSelectedImage(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Video Preview Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="p-0 border-none max-w-4xl">
            <DialogHeader className="p-4 bg-muted rounded-lg">
              <DialogTitle>{selectedVideo.title}</DialogTitle>
            </DialogHeader>
            <VideoPlayer src={selectedVideo.link} title={selectedVideo.title} autoPlay={false} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}