import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, Scan } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import StatCard from '@/components/StatCard';
import SeverityBadge from '@/components/SeverityBadge';
import { Button } from '@/components/ui/button';
import { mockThreats } from '@/lib/mockData';

const AdminThreats: React.FC = () => {
  return (
    <div>
     

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <StatCard
          title="Active Threats"
          value={5}
          icon={AlertCircle}
          iconColor="danger"
          progressBar={{ value: 40, color: 'danger' }}
        />
        <StatCard
          title="Resolved Today"
          value={12}
          icon={CheckCircle}
          iconColor="success"
          progressBar={{ value: 100, color: 'success' }}
        />
        <StatCard
          title="Detection Rate"
          value="98%"
          icon={Eye}
          iconColor="primary"
          progressBar={{ value: 98, color: 'primary' }}
        />
      </motion.div>

      {/* Threats Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="sentinel-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Timestamp</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Threat Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Severity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockThreats.map((threat) => (
                <tr key={threat.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">{threat.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{threat.type}</td>
                  <td className="px-6 py-4">
                    <SeverityBadge severity={threat.severity} />
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{threat.status}</td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">
                      {threat.action}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border text-sm text-muted-foreground">
          Showing 1-10 of 120 entries
        </div>
      </motion.div>
    </div>
  );
};

export default AdminThreats;
