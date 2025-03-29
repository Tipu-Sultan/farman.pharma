import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  VideoIcon,
  BookOpen,
  PaperclipIcon,
  Play,
  Search,
  Download as DownloadIcon,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

function ResourceCard({ resource, formatFileSize, onPreview }) {
  return (
    <Card className="group bg-card/90 backdrop-blur-sm border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold line-clamp-2">
          {resource.type === "images" ? (
            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          ) : resource.type === "videos" ? (
            <VideoIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          ) : resource.type === "books" ? (
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          ) : resource.type === "papers" ? (
            <PaperclipIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          ) : resource.type === "blogs" ? (
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          ) : null}
          {resource.title}
        </CardTitle>
        <Badge variant="secondary" className="mt-2 w-fit">
          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {/* Preview for Images */}
        {resource.type === "image" && (
          <div className="space-y-2">
            <div className="relative w-full h-48 overflow-hidden rounded-md">
              <img
                src={resource.link}
                alt={resource.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onPreview}
            >
              <Search className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        )}
        {/* Preview for Videos */}
        {resource.type === "video" && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onPreview}
          >
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}
        {/* Preview for Books */}
        {resource.type === "book" && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              <Search className="h-4 w-4 mr-2" />
              Preview
            </a>
          </Button>
        )}
        {/* Preview for Papers */}
        {resource.type === "paper" && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              <Search className="h-4 w-4 mr-2" />
              Preview
            </a>
          </Button>
        )}
        {resource.description && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Description:</span> {resource.description}
          </p>
        )}
        {resource.fileSize && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Size:</span> {formatFileSize(resource.fileSize)}
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
        {/* Read for Blogs */}
        {resource.type === "blog" && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <Link
                href={resource.link}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary text-sm sm:text-base font-medium hover:underline group-hover:translate-x-1 transition-transform"
              >
                <LinkIcon className="h-4 w-4" />
                Read
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ResourceCard;