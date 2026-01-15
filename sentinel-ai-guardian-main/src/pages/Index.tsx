import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SentinelLogo from '@/components/SentinelLogo';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <SentinelLogo size="md" />
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sentinel-info-light text-primary rounded-full text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Enterprise-Grade AI Security
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Secure Your AI Workflows
              <br />
              <span className="sentinel-gradient-text">Without Compromise</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Sentinel AI protects your organization from prompt injections, data leaks, and AI security threats 
              with ML-powered real-time protection.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Complete Security Pipeline
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every prompt passes through our security orchestrator for threat detection, 
              PII redaction, and audit logging.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="sentinel-card p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-sentinel-info-light flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="sentinel-card p-12 bg-primary text-primary-foreground"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your AI?</h2>
            <p className="text-primary-foreground/80 mb-6">
              Join enterprises that trust Sentinel AI to protect their AI workflows.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ... rest of your page content above ... */}

    {/* Footer */}
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <SentinelLogo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The next generation of AI security. Protecting enterprise intelligence with real-time prompt defense and PII redaction.
            </p>
          </div>

          {/* Navigation Columns */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Workspace</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Shield Logs</li>
              <li className="hover:text-primary cursor-pointer transition-colors">API Documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Compliance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Status</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Services Operational
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Sentinel AI. Enterprise-grade security for the AI era.
          </p>
          <div className="flex gap-6">
            <span className="text-muted-foreground hover:text-primary cursor-pointer text-xs transition-colors">Twitter</span>
            <span className="text-muted-foreground hover:text-primary cursor-pointer text-xs transition-colors">LinkedIn</span>
            <span className="text-muted-foreground hover:text-primary cursor-pointer text-xs transition-colors">GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  </div> // This closes the <div className="min-h-screen"> from line 28
  );
};

export default Index;
