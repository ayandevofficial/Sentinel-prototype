import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import VerdictBadge from '@/components/VerdictBadge';
import { Loader2 } from 'lucide-react'; // For a loading state

const EmployeeLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
    const fetchLogs = async () => {
      try {
        // ✅ FIX: Use VITE_API_URL for production (Vercel)
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${baseUrl}/logs`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);
 


  return (
    <div>
      <DashboardHeader title="My Prompt Log" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sentinel-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
                <th className="text-left px-6 py-4 font-semibold">Timestamp</th>
                <th className="text-left px-6 py-4 font-semibold">Input</th>
                <th className="text-left px-6 py-4 font-semibold">Reason</th>
                <th className="text-left px-6 py-4 font-semibold">Safety Score</th>
                <th className="text-left px-6 py-4 font-semibold">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-[300px] truncate" title={log.prompt}>
                    {log.prompt}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {log.reason}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    <span className={log.security_score < 0.5 ? 'text-sentinel-success' : 'text-sentinel-danger'}>
                      {log.security_score?.toFixed(4) || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.verdict && <VerdictBadge verdict={log.verdict} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div className="p-12 flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin w-6 h-6" />
            <p>Fetching real-time logs...</p>
          </div>
        )}

        {!isLoading && logs.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No real logs found in shield_logs.db.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeLogs;
