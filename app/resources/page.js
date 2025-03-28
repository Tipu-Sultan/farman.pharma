// app/resources/page.js
import dbConnect from '@/lib/dbConnect'
import Resource from '@/models/Resource'
import ResourcesClient from './ResourcesClient'

async function getResources() {
  await dbConnect()
  const resources = await Resource.find().lean()
  return {
    books: resources.filter((r) => r.type === 'book'),
    videos: resources.filter((r) => r.type === 'video'),
    papers: resources.filter((r) => r.type === 'paper'),
    blogs: resources.filter((r) => r.type === 'blog'),
  }
}

export default async function ResourcesPage() {
  const resourcesData = await getResources()

  return (
    <section className="min-h-[calc(100vh-4rem)] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <ResourcesClient resourcesData={resourcesData} />
      </div>
    </section>
  )
}