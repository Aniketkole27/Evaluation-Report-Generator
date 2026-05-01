import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, LogOut } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarProps {
  brandName?: string;
  brandSecondary?: string;
  portalName?: string;
  navItems: NavItem[];
  onLogout?: () => void;
}

const Sidebar = ({
  brandName = 'EVAL',
  brandSecondary = 'GEN',
  portalName = 'Portal',
  navItems,
  onLogout
}: SidebarProps) => {
  return (
    <aside className="w-64 bg-bg-secondary border-r border-border-subtle flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6">
        <span className="text-text-primary font-bold text-2xl tracking-tighter">
          {brandName}<span className="text-text-secondary">{brandSecondary}</span>
        </span>
        <p className="text-xs text-text-secondary mt-1 font-medium uppercase tracking-wider">{portalName}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-btn-bg text-btn-text shadow-lg shadow-btn-bg/10'
                : 'text-text-secondary hover:bg-border-subtle hover:text-text-primary'
              }`
            }
          >
            <div className="flex items-center">
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {onLogout && (
        <div className="p-4 border-t border-border-subtle">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-text-secondary hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
