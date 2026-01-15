import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot, Shield, ShieldX, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardHeader from '@/components/DashboardHeader';
import StatCard from '@/components/StatCard';
import { mockRecentActivity, mockChartData } from '@/lib/mockData';

const AdminOverview: React.FC = () => {
  const threatActivityData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 32 },
    { name: 'Sat', value: 28 },
    { name: 'Sun', value: 45 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <Settings className="w-5 h-5 text-muted-foreground" />;
      case 'threat':
        return <ShieldX className="w-5 h-5 text-sentinel-danger" />;
      case 'redaction':
        return <CheckCircle className="w-5 h-5 text-sentinel-warning" />;
      default:
        return <Settings className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getEventColor = (activity: typeof mockRecentActivity[0]) => {
    if (activity.type === 'threat' && activity.severity === 'high') {
      return 'text-sentinel-danger';
    }
    if (activity.severity === 'medium') {
      return 'text-sentinel-warning';
    }
    return 'text-foreground';
  };

  return (
    <div>
      <DashboardHeader title="Overview" />

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <StatCard
          title="Security Score"
          value="92%"
          icon={CircleDot}
          iconColor="primary"
          progressBar={{ value: 92, color: 'primary' }}
        />
        <StatCard
          title="Protected Sessions"
          value="1,250"
          icon={Shield}
          iconColor="success"
        />
        <StatCard
          title="Blocked Threats (Last 24h)"
          value="45"
          icon={ShieldX}
          iconColor="danger"
        />
      </motion.div>

      {/* Threat Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="sentinel-card p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">Threat Activity</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={threatActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="sentinel-card p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {mockRecentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 py-2">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                <span className="mx-2 text-muted-foreground">-</span>
                <span className={`text-sm font-medium ${getEventColor(activity)}`}>
                  {activity.event}
                </span>
                {activity.severity && (
                  <span className={`ml-2 text-sm ${
                    activity.severity === 'high' ? 'text-sentinel-danger' : 'text-sentinel-warning'
                  }`}>
                    ({activity.severity === 'high' ? 'Muted Red' : 'Muted Orange'})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
