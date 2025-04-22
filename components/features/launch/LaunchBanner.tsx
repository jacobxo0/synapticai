import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function LaunchBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 p-6 shadow-lg backdrop-blur-sm"
      role="banner"
      aria-label="Mind Mate Launch Announcement"
    >
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="relative space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl" role="img" aria-label="Brain emoji">🧠</span>
          <h2 className="text-2xl font-semibold tracking-tight">
            Mind Mate Is Here
          </h2>
        </div>

        <p className="text-lg text-muted-foreground">
          Your AI-powered wellness companion, designed with emotional intelligence and care. 
          Experience therapeutic conversations, track your well-being, and grow at your own pace.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button
            variant="default"
            className="w-full sm:w-auto"
            data-testid="launch-banner-try-now"
          >
            Try Now
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            data-testid="launch-banner-learn-more"
          >
            Learn More
          </Button>
        </div>

        <p className="text-sm text-muted-foreground italic">
          Professional support when you need it, gentle guidance when you&apos;re ready.
        </p>

        <p className="text-gray-600">Let&apos;s get started on your journey to better mental health.</p>
      </div>
    </motion.div>
  );
} 