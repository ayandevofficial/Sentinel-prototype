import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Activity, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SentinelLogo from '@/components/SentinelLogo';

/**
 * Sentinel AI Landing Page
 * Optimized for desktop hackathon presentation and mobile viewports.
 */
const Index = () => {
  const features = [
    {
      title: "ML-Powered Shield",
      description: "Real-time threat detection with security scoring and verdict badges.",
      icon: Shield,
    },
    {
      title: "Data Redaction",
      description: "Automatic PII scrubbing to protect sensitive enterprise information.",
      icon: Lock,
    },
    {
      title: "Security Auditing",
      description: "Comprehensive logs and real-time system status monitoring.",
      icon: Activity,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <SentinelLogo size="md" />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        {/* 2. Hero Section */}
        <section className="container mx-auto px-4 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Secure Your AI Workflows <br />
              <span className="sentinel-gradient-text">Without Compromise</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Sentinel AI protects your organization from prompt injections, data leaks, and AI security threats with ML-powered real-time protection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="px-8">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8">View Demo</Button>
            </div>
          </motion.div>
        </section>

        {/* 3. Features Grid */}
        <section className="container mx-auto px-4 py-20 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="sentinel-card p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Visual Pipeline Summary */}
        <section className="container mx-auto px-4 py-20 text-center">
           <h2 className="text-3xl font-bold mb-12">Security Pipeline Infrastructure</h2>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Threat Detection",
                "PII Redaction",
                "Audit Logging",
                "Real-time Guarding"
              ].map((text) => (
                <div key={text} className="p-4 border border-border rounded-lg bg-card">
                  <CheckCircle className="h-6 w-6 text-sentinel-success mx-auto mb-2" />
                  <p className="text-sm font-medium">{text}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Sentinel AI. Advanced security for the Generative AI era.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
