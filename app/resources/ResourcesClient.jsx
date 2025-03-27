'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Book, FileText, Link as LinkIcon, Search, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export default function ResourcesClient({ resourcesData }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filterResources = (resources) => {
    return resources.filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <>
      {/* Header */}
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
          Explore a curated collection of books, videos, and research papers for pharmaceutical studies.
        </p>
      </motion.div>

      {/* Search */}
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

      {/* Tabs */}
      <Tabs defaultValue="books" className="space-y-6">
        <TabsList className="flex justify-center gap-2 sm:gap-4 bg-transparent p-0">
          <TabsTrigger
            value="books"
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-all"
          >
            Books
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-all"
          >
            Video Lectures
          </TabsTrigger>
          <TabsTrigger
            value="papers"
            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 transition-all"
          >
            Research Papers
          </TabsTrigger>
        </TabsList>

        {['books', 'videos', 'papers'].map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filterResources(resourcesData[type]).map((resource, index) => (
                <motion.div
                  key={resource._id} // Use _id from MongoDB
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <ResourceCard
                    resource={resource}
                    icon={type === 'books' ? Book : type === 'videos' ? Video : FileText}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

function ResourceCard({ resource, icon: Icon }) {
  return (
    <Card className="group bg-card/90 backdrop-blur-sm border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold line-clamp-2">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          {resource.title}
        </CardTitle>
        <Badge variant="secondary" className="mt-2 w-fit">
          {resource.type}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {resource.author && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Author:</span> {resource.author}
          </p>
        )}
        {resource.duration && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Duration:</span> {resource.duration}
          </p>
        )}
        {resource.journal && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Journal:</span> {resource.journal}
          </p>
        )}
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary text-sm sm:text-base font-medium hover:underline mt-3 group-hover:translate-x-1 transition-transform"
        >
          <LinkIcon className="h-4 w-4" />
          {resource.type === 'Book' ? 'Download' : resource.type === 'Video' ? 'Watch' : 'View'}
        </a>
      </CardContent>
    </Card>
  )
}