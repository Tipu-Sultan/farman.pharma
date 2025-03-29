import dbConnect from '@/lib/dbConnect';
import Resource from '@/models/Resource';
import ResourcesClient from './ResourcesClient';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getResources() {
  await dbConnect();
  const resources = await Resource.find().lean();

  const serializedResources = resources.map((r) => ({
    ...r,
    _id: r._id.toString(),
    ownerId: r.ownerId.toString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  // Use consistent type names (plural to match ResourcesClient)
  return {
    images: serializedResources.filter((r) => r.type === 'image'), // Changed from 'image'
    books: serializedResources.filter((r) => r.type === 'book'),   // Changed from 'book'
    videos: serializedResources.filter((r) => r.type === 'video'), // Changed from 'video'
    papers: serializedResources.filter((r) => r.type === 'paper'), // Changed from 'paper'
    blogs: serializedResources.filter((r) => r.type === 'blog'),   // Changed from 'blog'
  };
}

function ResourceSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
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
        <Suspense fallback={<ResourceSkeleton />}>
          <ResourcesClient resourcesData={resourcesData} />
        </Suspense>
      </div>
    </section>
  );
}