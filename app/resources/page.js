import dbConnect from '@/lib/dbConnect';
import Resource from '@/models/Resource';
import ResourcesClient from './ResourcesClient';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getResources() {
  await dbConnect();
  const resources = await Resource.find().lean();

  // Convert ObjectId to string
  const serializedResources = resources.map((r) => ({
    ...r,
    _id: r._id.toString(),
    ownerId: r.ownerId.toString(), // Ensure ownerId is a string
    createdAt: r.createdAt.toISOString(), // Convert Date to string
    updatedAt: r.updatedAt.toISOString(),
  }));

  return {
    books: serializedResources.filter((r) => r.type === 'book'),
    videos: serializedResources.filter((r) => r.type === 'video'),
    papers: serializedResources.filter((r) => r.type === 'paper'),
    blogs: serializedResources.filter((r) => r.type === 'blog'),
  };
}

// A reusable Skeleton Loader component for the fallback
function ResourceSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-6 w-1/3" /> {/* Title */}
          <Skeleton className="h-4 w-2/3" /> {/* Description */}
          <Skeleton className="h-4 w-1/2" /> {/* Additional info */}
        </div>
      ))}
    </div>
  );
}


export default async function ResourcesPage() {
  const resourcesData = await getResources();

  return (
    <section className="min-h-[calc(100vh-4rem)] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<ResourceSkeleton/>}>
          <ResourcesClient resourcesData={resourcesData} />
        </Suspense>
      </div>
    </section>
  );
}