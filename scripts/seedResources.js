// scripts/seedResources.js
import dbConnect from '@/lib/dbConnect'
import Resource from '@/models/Resource'

const resourcesData = {
  books: [
    { id: 1, title: 'Pharmaceutical Chemistry Textbook', author: 'Dr. Smith', type: 'Book', link: '#' },
    { id: 2, title: 'Clinical Pharmacy Practice', author: 'Dr. Johnson', type: 'Book', link: '#' },
  ],
  videos: [
    { id: 1, title: 'Introduction to Pharmacology', duration: '45 mins', type: 'Video', link: '#' },
    { id: 2, title: 'Drug Administration Techniques', duration: '30 mins', type: 'Video', link: '#' },
  ],
  papers: [
    { id: 1, title: 'Recent Advances in Drug Delivery', journal: 'Pharmaceutical Journal', type: 'Paper', link: '#' },
    { id: 2, title: 'Clinical Trial Methodologies', journal: 'Clinical Research Quarterly', type: 'Paper', link: '#' },
  ],
}

async function seedResources() {
  await dbConnect()

  const resources = [
    ...resourcesData.books.map(r => ({ ...r, category: 'books' })),
    ...resourcesData.videos.map(r => ({ ...r, category: 'videos' })),
    ...resourcesData.papers.map(r => ({ ...r, category: 'papers' })),
  ]

  await Resource.deleteMany({})
  await Resource.insertMany(resources)
  console.log('Resources seeded successfully')
  process.exit()
}

seedResources().catch(err => {
  console.error(err)
  process.exit(1)
})