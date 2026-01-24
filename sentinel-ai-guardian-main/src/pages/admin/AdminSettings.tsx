import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SettingsTab = 'general' | 'security' | 'api' | 'notifications';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [shieldSensitivity, setShieldSensitivity] = useState([0.75]);
  const [customBlacklist, setCustomBlacklist] = useState('password\napi_key\nsecret\ntoken');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [primaryModel, setPrimaryModel] = useState('gemini');

  // API Keys state
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [shieldUrl, setShieldUrl] = useState('http://localhost:8000');
  const [scrubberUrl, setScrubberUrl] = useState('http://localhost:8001');

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'api', label: 'API Keys' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const handleSaveApiConfig = () => {
    toast.success('API configuration saved successfully');
  };

  // --- STYLING CLASSES ---
  
  // 1. Glass Card Effect for the main container
  const glassCardClass = "bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-xl rounded-xl";
  
  // 2. Glass Effect for Dropdowns
  const glassDropdownClass = "bg-slate-950/80 backdrop-blur-xl border border-white/10 text-foreground shadow-2xl";
  
  // 3. Remove Blue Border (Focus Ring) for Inputs/Selects
  const noFocusClass = "focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 border-white/10 bg-background/50";

  return (
    <div>
      <DashboardHeader title="Settings" />

      <div className="flex gap-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-48 flex-shrink-0"
        >
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20' // Updated active tab style
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          // Added glassCardClass here
          className={cn("flex-1 p-6", glassCardClass)}
        >
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">General</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input 
                    id="org-name" 
                    defaultValue="Sentinel AI Corp" 
                    className={cn("mt-2", noFocusClass)} 
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger className={cn("mt-2", noFocusClass)}>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className={glassDropdownClass}>
                      <SelectItem value="est" className="focus:bg-white/10 focus:text-white cursor-pointer">UTC-05:00 Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="pst" className="focus:bg-white/10 focus:text-white cursor-pointer">UTC-08:00 Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="utc" className="focus:bg-white/10 focus:text-white cursor-pointer">UTC+00:00 Universal Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input 
                    id="admin-email" 
                    defaultValue="admin@sentinelai.com" 
                    className={cn("mt-2", noFocusClass)} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Security</h2>
              <div className="space-y-6 max-w-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Multi-factor Authentication</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Require MFA for all admin accounts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
                    <span className="text-sm font-medium">{mfaEnabled ? 'On' : 'Off'}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select defaultValue="30">
                    <SelectTrigger className={cn("mt-2", noFocusClass)}>
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent className={glassDropdownClass}>
                      <SelectItem value="15" className="focus:bg-white/10 focus:text-white cursor-pointer">15 minutes</SelectItem>
                      <SelectItem value="30" className="focus:bg-white/10 focus:text-white cursor-pointer">30 minutes</SelectItem>
                      <SelectItem value="60" className="focus:bg-white/10 focus:text-white cursor-pointer">1 hour</SelectItem>
                      <SelectItem value="120" className="focus:bg-white/10 focus:text-white cursor-pointer">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Shield Sensitivity Threshold</Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Adjust how sensitive the ML-powered threat detection is (0.0 - 1.0)
                  </p>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={shieldSensitivity}
                      onValueChange={setShieldSensitivity}
                      max={1}
                      step={0.05}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      {shieldSensitivity[0].toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="blacklist">Custom Keyword Blacklist</Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    One keyword per line. These will be automatically redacted.
                  </p>
                  <Textarea
                    id="blacklist"
                    value={customBlacklist}
                    onChange={(e) => setCustomBlacklist(e.target.value)}
                    rows={6}
                    className={cn("font-mono text-sm", noFocusClass)}
                  />
                </div>

                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">API Keys</h2>
              <div className="space-y-6 max-w-lg">
                {/* Primary Model Selection */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <Label className="text-primary">Primary AI Model</Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Select the default AI model for all chat requests
                  </p>
                  <Select value={primaryModel} onValueChange={setPrimaryModel}>
                    <SelectTrigger className={noFocusClass}>
                      <SelectValue placeholder="Select primary model" />
                    </SelectTrigger>
                    <SelectContent className={glassDropdownClass}>
                      <SelectItem value="gemini" className="focus:bg-white/10 focus:text-white cursor-pointer">Google Gemini (Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gemini API Key */}
                <div>
                  <Label>Google Gemini API Key</Label>
                  <Input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className={cn("mt-2 font-mono", noFocusClass)}
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-medium text-foreground mb-4">Service URLs</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Shield Service URL</Label>
                      <Input
                        value={shieldUrl}
                        onChange={(e) => setShieldUrl(e.target.value)}
                        className={cn("mt-2 font-mono", noFocusClass)}
                      />
                    </div>
                    <div>
                      <Label>Scrubber Service URL</Label>
                      <Input
                        value={scrubberUrl}
                        onChange={(e) => setScrubberUrl(e.target.value)}
                        className={cn("mt-2 font-mono", noFocusClass)}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveApiConfig}>Save API Configuration</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Email Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive email for critical threats</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">Weekly security summary email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Real-time Threat Alerts</p>
                    <p className="text-sm text-muted-foreground">Instant notifications for high-severity threats</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;