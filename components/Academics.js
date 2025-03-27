'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, BookOpen, GraduationCap, Star, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Academics() {
  const education = [
    {
      title: 'B.Sc (Bachelor of Science)',
      institution: 'Chhatrapati Shahu Ji Maharaj University (CSJM), Kanpur',
      period: 'Completed',
      description: 'Focused on foundational sciences with an emphasis on biology and chemistry.',
    },
    {
      title: 'D.Pharma (Diploma in Pharmacy)',
      institution: 'Integral University, Lucknow',
      period: 'Completed',
      description: 'Specialized in pharmaceutical sciences, drug formulation, and patient care.',
    },
  ]

  const achievements = [
    'Consistent academic performer during B.Sc and D.Pharma',
    'Completed practical training in pharmaceutical labs',
    'Recognized for excellence in pharmacology studies',
    'Active participant in university science symposiums',
  ]

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Academic & Professional Journey
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A blend of scientific education and practical expertise in pharmacy, culminating in a impactful career in public service.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Education
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Card className="bg-card/90 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-semibold flex items-center justify-between">
                        {edu.title}
                        <span className="text-sm text-muted-foreground">{edu.period}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm sm:text-base font-medium text-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">{edu.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements & Current Role */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Achievements */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Achievements
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-card/90 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6 space-y-3 sm:space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base">{achievement}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Current Role */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Current Role
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="bg-card/90 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold">
                    Substation Operator (SSO)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm sm:text-base font-medium text-foreground">
                      Uttar Pradesh Government Electricity Department
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Currently serving as an SSO in a non-government job role, leveraging pharmaceutical knowledge and administrative skills to contribute to public service.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}