import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import VerdictBadge from '@/components/VerdictBadge';
import { Loader2, AlertTriangle } from 'lucide-react';

const EmployeeLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
        const response = await fetch(`${baseUrl}/logs`);
        const data = await response.json();

        // ✅ CRASH FIX: Data jodi Array hoy tobei set korbe
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("API Error:", data);
          setLogs([]); // Empty array set korlam jate crash na hoy
          if (data.detail) setError(data.detail); // Error msg dekhabe
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setError("Failed to connect to server");
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
        {/* Error Message Section */}
        {error && (
            <div className="p-4 bg-red-500/10 text-red-500 flex items-center gap-2 text-sm border-b border-red-500/20">
                <AlertTriangle size={16}/> {error}
            </div>
        )}

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
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id || Math.random()} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground max-w-[300px] truncate" title={log.prompt}>
                      {log.prompt}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {log.reason || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      <span className={log.security_score < 0.5 ? 'text-green-500' : 'text-red-500'}>
                        {log.security_score?.toFixed(4) || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.verdict && <VerdictBadge verdict={log.verdict} />}
                    </td>
                  </tr>
                ))
              ) : (
                !isLoading && !error && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      No logs found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div className="p-12 flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin w-6 h-6" />
            <p>Fetching real-time logs...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeLogs;
