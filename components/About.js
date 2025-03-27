'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Award, BookOpen, Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'

export default function About() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A dedicated pharmacy student with a deep passion for healthcare and an unwavering commitment to excellence in pharmaceutical sciences.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: "Academic Background",
              desc: "Pursuing D. Pharma with a focus on clinical pharmacy and pharmaceutical research",
            },
            {
              icon: BookOpen,
              title: "Research Interests",
              desc: "Specializing in drug development, pharmacology, and patient care methodologies",
            },
            {
              icon: Stethoscope,
              title: "Clinical Experience",
              desc: "Hands-on experience through internships at leading healthcare facilities",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.2 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-8 pb-6 text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 h-12 w-12 mx-auto bg-primary/10 rounded-full animate-pulse" />
                    <item.icon className="h-12 w-12 mx-auto text-primary relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}