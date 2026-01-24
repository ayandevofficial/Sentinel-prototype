import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import SeverityBadge from '@/components/SeverityBadge';
import StatusBadge from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockSecurityLogs } from '@/lib/mockData';

const AdminSecurityLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('24h');
  const [eventType, setEventType] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredLogs = mockSecurityLogs.filter((log) => {
    // 1. Check Search Query
    const matchesSearch = searchQuery === '' || 
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.originalPrompt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. Check Severity
    if (severity !== 'all' && log.severity !== severity) return false;

    // 3. Check Event Type
    if (eventType !== 'all') {
        const typeMap: Record<string, string> = {
            'injection': 'Prompt Injection',
            'pii': 'PII Redaction',
            'malicious': 'Malicious Payload'
        };
        if (!log.event.toLowerCase().includes(typeMap[eventType].toLowerCase())) {
            return false;
        }
    }

    return true;
  });

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Shared glass effect class for dropdown content
  const glassDropdownClass = "bg-slate-950/80 backdrop-blur-xl border border-white/10 text-foreground shadow-2xl";
  
  // NEW: Class to remove the blue focus ring
  const noFocusRingClass = "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div>
      <DashboardHeader title="Security Logs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </DashboardHeader>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sentinel-card p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Date Range Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className={noFocusRingClass}>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent className={glassDropdownClass}>
                <SelectItem value="24h" className="focus:bg-white/10 focus:text-white cursor-pointer">Last 24 Hours</SelectItem>
                <SelectItem value="7d" className="focus:bg-white/10 focus:text-white cursor-pointer">Last 7 Days</SelectItem>
                <SelectItem value="30d" className="focus:bg-white/10 focus:text-white cursor-pointer">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Event Type</label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className={noFocusRingClass}>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className={glassDropdownClass}>
                <SelectItem value="all" className="focus:bg-white/10 focus:text-white cursor-pointer">All Events</SelectItem>
                <SelectItem value="injection" className="focus:bg-white/10 focus:text-white cursor-pointer">Prompt Injection</SelectItem>
                <SelectItem value="pii" className="focus:bg-white/10 focus:text-white cursor-pointer">PII Redaction</SelectItem>
                <SelectItem value="malicious" className="focus:bg-white/10 focus:text-white cursor-pointer">Malicious Payload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Severity</label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className={noFocusRingClass}>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent className={glassDropdownClass}>
                <SelectItem value="all" className="focus:bg-white/10 focus:text-white cursor-pointer">All Severities</SelectItem>
                <SelectItem value="high" className="focus:bg-white/10 focus:text-white cursor-pointer">High</SelectItem>
                <SelectItem value="medium" className="focus:bg-white/10 focus:text-white cursor-pointer">Medium</SelectItem>
                <SelectItem value="low" className="focus:bg-white/10 focus:text-white cursor-pointer">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </motion.div>

      {/* Logs Table */}
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
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Employee</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Event</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Prompt</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Severity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr 
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleRow(log.id)}
                  >
                    <td className="px-6 py-4 text-sm text-foreground">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {log.userName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{log.event}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {log.originalPrompt || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={log.severity} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-6 py-4">
                      {expandedRow === log.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                  </tr>
                  {expandedRow === log.id && (
                    <tr className="bg-muted/30">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="space-y-3">
                          {log.originalPrompt && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Original Prompt</p>
                              <p className="text-sm text-foreground bg-background/50 p-3 rounded-lg font-mono">
                                {log.originalPrompt}
                              </p>
                            </div>
                          )}
                          {log.redactedPrompt && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Redacted Prompt</p>
                              <p className="text-sm text-foreground bg-background/50 p-3 rounded-lg font-mono">
                                {log.redactedPrompt}
                              </p>
                            </div>
                          )}
                          {log.aiResponse && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">AI Response</p>
                              <p className="text-sm text-foreground bg-background/50 p-3 rounded-lg">
                                {log.aiResponse}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-6 text-sm">
                            {log.securityScore !== undefined && (
                              <div>
                                <span className="text-muted-foreground">Security Score: </span>
                                <span className="font-medium">{log.securityScore.toFixed(2)}</span>
                              </div>
                            )}
                            {log.latencyMs !== undefined && (
                              <div>
                                <span className="text-muted-foreground">Latency: </span>
                                <span className="font-medium">{log.latencyMs}ms</span>
                              </div>
                            )}
                            {log.redactedEntities && log.redactedEntities.length > 0 && (
                              <div>
                                <span className="text-muted-foreground">Redacted: </span>
                                <span className="font-medium">{log.redactedEntities.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border text-sm text-muted-foreground">
          Showing 1-{filteredLogs.length} of {mockSecurityLogs.length} entries
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSecurityLogs;