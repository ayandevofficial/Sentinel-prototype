import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Bot } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

const AdminIntegrations: React.FC = () => {
  const integrations = [
    { name: 'OpenAI API', status: 'Connected', icon: Bot },
    { name: 'Shield Service', status: 'Connected', icon: Shield },
    { name: 'Scrubber Service', status: 'Connected', icon: Database },
  ];

  return (
    <div>
      <DashboardHeader title="Integrations" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {integrations.map((integration, index) => {
          const IconComponent = integration.icon;
          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="sentinel-card p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{integration.name}</h3>
                  <span className="text-sm text-sentinel-success">
                    {integration.status}
                  </span>
                </div>
              </div>
              <button className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-muted text-muted-foreground hover:bg-accent">
                Configure
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AdminIntegrations;
