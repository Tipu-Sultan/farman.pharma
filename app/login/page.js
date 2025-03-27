'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/admin' })
    } catch (error) {
      console.error('Google sign-in error:', error)
      setIsLoading(false) // Reset loading on error
    }
    // Note: Loading state will persist until redirect occurs on success
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background py-10 px-4 sm:px-6 lg:px-8">
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        <Card className="bg-card/95 backdrop-blur-md border-none shadow-2xl overflow-hidden">
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

          <CardHeader className="space-y-3 text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            >
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
            </motion.div>
            <CardDescription className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
              Sign in with Google to access your personalized dashboard and resources
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-8 py-8">
            {/* Google Sign-In Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center gap-3 bg-background/80 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 text-foreground text-sm sm:text-base md:text-lg font-medium py-6 sm:py-7 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
                    <span>Signing In...</span>
                  </motion.div>
                ) : (
                  <>
                    <Image
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}