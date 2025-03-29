'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  Book,
  FileText,
  ArrowRight,
  Microscope,
  Award,
  Beaker,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  // Sample social media data (replace with real data via API if desired)
  const socialLinks = [
    { platform: 'Instagram', icon: Instagram, followers: '12.5K', url: 'https://www.instagram.com/fk_science/' },
    { platform: 'Twitter', icon: Twitter, followers: '8.3K', url: '#' },
    { platform: 'Facebook', icon: Facebook, followers: '15K', url: '#' },
    { platform: 'LinkedIn', icon: Linkedin, followers: '5.2K', url: '#' },
  ]

  return (
    <section className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 w-full"
          >
            <div className="space-y-4 sm:space-y-6">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium animate-fade-in">
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                D. Pharma Student
              </span>

              <h1 className="text-3xl text-yellow-500 sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Mohd. Farman Khan
                <span className="block text-primary mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  Future Pharmacist
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Passionate about pharmaceutical sciences and dedicated to advancing healthcare through innovative research and practical solutions.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="group hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
                asChild
              >
                <Link href="/notes" className="flex items-center justify-center gap-2">
                  <Book className="h-4 w-4 sm:h-5 sm:w-5" />
                  Study Notes
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
                asChild
              >
                <Link href="/resources" className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  Resources
                </Link>
              </Button>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-4 pt-6 sm:pt-8">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="group flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-2 sm:p-3 hover:bg-muted hover:shadow-md transition-all duration-300"
                >
                  <social.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium">{social.platform}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{social.followers} Followers</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mx-auto lg:ml-auto"
          >
            <div className="relative aspect-square">
              {/* Decorative Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-primary/20 animate-pulse" />

              {/* Profile Image */}
              <div className="absolute inset-6 rounded-full overflow-hidden shadow-2xl border-2 border-primary/30">
                <Image
                  src="/assets/farman.jpg"
                  alt="Modh. Farman Khan - Pharmacy Student"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute top-0 right-0 -mr-16 sm:-mr-20 md:-mr-24 mt-8 sm:mt-10 md:mt-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardContent className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1.5 sm:p-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className='text-yellow-500'>
                    <p className="font-semibold text-xs sm:text-sm">Dean's List</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">2023-2024</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="absolute bottom-0 left-0 -ml-16 sm:-ml-20 md:-ml-24 mb-8 sm:mb-10 md:mb-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardContent className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1.5 sm:p-2">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className='text-yellow-500'>
                    <p className="font-semibold text-xs sm:text-sm">7.2 GPA</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Academic Score</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}