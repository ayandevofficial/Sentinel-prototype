import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Settings,
  AlertTriangle,
  Link2,
  MessageSquare,
  LogOut,
  History,
  Bot,
} from 'lucide-react';
import SentinelLogo from './SentinelLogo';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

/**
 * DashboardSidebar Component
 * Provides primary navigation for the Sentinel AI Admin & Employee consoles.
 * Responsive behavior: Visible as a fixed sidebar on Desktop (lg+), 
 * intended to be wrapped in a Drawer/Sheet for Mobile viewports.
 */
const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // Navigation configuration for Admin persona
  const adminNavItems: NavItem[] = [
    { label: 'AI Chatbot', href: '/dashboard/admin/chatbot', icon: Bot },
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Threats', href: '/dashboard/admin/threats', icon: AlertTriangle },
    { label: 'Security Logs', href: '/dashboard/admin/logs', icon: FileText },
    { label: 'Integrations', href: '/dashboard/admin/integrations', icon: Link2 },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  // Navigation configuration for Employee persona
  const employeeNavItems: NavItem[] = [
    { label: 'AI Workspace', href: '/dashboard/employee', icon: MessageSquare },
    { label: 'My Prompt Log', href: '/dashboard/employee/logs', icon: History },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  /**
   * Clears authentication session and redirects to identity provider/login.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex w-[240px] h-screen bg-sidebar border-r border-sidebar-border flex-col sticky top-0">
      
      {/* Branding Section - Consistent padding with the DashboardHeader */}
      <div className="p-6 border-b border-sidebar-border">
        <SentinelLogo size="md" />
      </div>

      {/* Primary Navigation - Scrollable area for long nav lists */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard/admin' || item.href === '/dashboard/employee'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              "text-inherit"
            )} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Session Controls */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/20">
        <div className="px-3 py-3 mb-3 bg-background/50 rounded-xl border border-sidebar-border/50">
          <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate opacity-80">{user?.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
