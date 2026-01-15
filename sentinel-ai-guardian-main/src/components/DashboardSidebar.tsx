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

const DashboardSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const adminNavItems: NavItem[] = [
    { label: 'AI Chatbot', href: '/dashboard/admin/chatbot', icon: Bot },
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Threats', href: '/dashboard/admin/threats', icon: AlertTriangle },
    { label: 'Security Logs', href: '/dashboard/admin/logs', icon: FileText },
    { label: 'Integrations', href: '/dashboard/admin/integrations', icon: Link2 },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const employeeNavItems: NavItem[] = [
    { label: 'AI Workspace', href: '/dashboard/employee', icon: MessageSquare },
    { label: 'My Prompt Log', href: '/dashboard/employee/logs', icon: History },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[220px] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <SentinelLogo size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard/admin' || item.href === '/dashboard/employee'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
