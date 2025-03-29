import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import Link from "next/link";

async function fetchBlog(link) {
  await dbConnect();

  const decodedLink = `/blogs/${decodeURIComponent(link)}`;

  const blog = await Resource.findOne({ link: decodedLink }).lean(); // Converts to plain JSON

  if (!blog) return null;

  // Convert special MongoDB fields into plain JavaScript values
  return {
    ...blog,
    _id: blog._id.toString(),
    ownerId: blog.ownerId?.toString(),
    createdAt: blog.createdAt?.toISOString(),
    updatedAt: blog.updatedAt?.toISOString(),
  };
}

export default async function BlogPage({ params }) {
  const { link } = params;
  const blog = await fetchBlog(link);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          asChild // Makes the button function as a link
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80"
        >
          <Link href={'http://localhost:3000/resources?tab=blogs'}>
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
          </Link>
        </Button>

        <Card className="shadow-lg border-none bg-card/90 backdrop-blur-sm">
          <CardHeader className="border-b border-muted pb-6">
            <CardTitle className="text-3xl sm:text-4xl font-bold leading-tight text-primary">
              {blog.title}
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mt-2">
              <span>By {blog.metadata?.ownerId || "Unknown Author"}</span>
              <span className="hidden sm:inline">•</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-8 prose prose-lg max-w-none text-foreground">
            <div
              className="space-y-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.metadata.content || "" }} // Ensure it's a string
            />
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between items-center">
        <Button
          asChild // Makes the button function as a link
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80"
        >
          <Link href={'http://localhost:3000/resources?tab=blogs'}>
          <ArrowLeft className="h-4 w-4" />
          Previous to Blogs
          </Link>
        </Button>
          <Button variant="outline" size="sm">
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
