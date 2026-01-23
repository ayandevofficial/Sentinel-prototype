import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SentinelLogo from '@/components/SentinelLogo';

/**
 * Landing Page Component (Index)
 * Serves as the primary marketing entry point. 
 * Optimized for SEO and cross-device responsiveness.
 */
const Index: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'ML-Powered Threat Detection',
      description: 'Real-time prompt injection and malicious payload detection using advanced machine learning.',
    },
    {
      icon: Lock,
      title: 'Automatic PII Redaction',
      description: 'Sensitive data is automatically scrubbed before reaching AI models, keeping your data safe.',
    },
    {
      icon: Eye,
      title: 'Complete Audit Trail',
      description: 'Full visibility into all AI interactions with security scoring and compliance logging.',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Navigation Bar 
          Uses backdrop-blur for a premium glassmorphism effect.
      */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <SentinelLogo size="md" />
          <Link to="/login">
            <Button size="sm" className="md:h-10 md:px-4">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section 
          Adjusted vertical padding for mobile devices (pt-24 vs pt-32).
      */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-sentinel-info-light/10 text-primary border border-primary/20 rounded-full text-[10px] md:text-sm font-medium mb-6">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Enterprise-Grade AI Security
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-[1.15] tracking-tight">
              Secure Your AI Workflows
              <br />
              <span className="sentinel-gradient-text">Without Compromise</span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 px-2">
              Sentinel AI protects your organization from prompt injections and data leaks 
              with ML-powered real-time protection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid 
          Responsive grid: 1 column on mobile, 3 columns on desktop.
      */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Complete Security Pipeline
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Every prompt passes through our security orchestrator for threat detection and PII redaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key
