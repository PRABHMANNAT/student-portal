import { NavLink } from 'react-router-dom';
import { Bookmark, Briefcase, FileText, Map } from 'lucide-react';
import ingenLogo from '../../assets/ingen-logo.png';
import './SideNav.css';

const NAV_ITEMS = [
  {
    to: '/roadmap',
    variant: 'aristotle',
    icon: Map,
    label: 'Roadmap',
    accent: '#FF6B35',
  },
  {
    to: '/jobs',
    variant: 'columbus',
    icon: Briefcase,
    label: 'Jobs',
    accent: '#3B82F6',
  },
  {
    to: '/notes',
    variant: 'athena',
    icon: FileText,
    label: 'Notes',
    accent: '#A855F7',
  },
  {
    to: '/collections',
    variant: 'collection',
    icon: Bookmark,
    label: 'Collections',
    accent: '#F59E0B',
  }
];

export default function SideNav() {
  return (
    <nav className="shell-nav">
      <div className="shell-nav-top">
        <NavLink to="/roadmap" className="shell-logo" aria-label="Go to roadmap">
          <img src={ingenLogo} alt="Ingen" className="shell-logo-image" />
        </NavLink>

        <span className="shell-nav-divider" aria-hidden="true" />

        <div className="shell-nav-stack">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `shell-nav-item ${isActive ? 'is-active' : ''}`}
                style={{ '--shell-agent-accent': item.accent }}
                aria-label={item.label}
              >
                <span className="shell-nav-icon-box">
                  <Icon size={20} strokeWidth={1.9} />
                </span>
                <span className="shell-nav-tooltip">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
