import { BriefcaseBusiness, BookOpenText, Compass, Map } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import UserAvatar from '../UserAvatar';

const items = [
  { to: '/roadmap', icon: Map, label: 'Aristotle' },
  { to: '/jobs', icon: Compass, label: 'Columbus' },
  { to: '/notes', icon: BookOpenText, label: 'Athena' },
  { to: '/collections', icon: BriefcaseBusiness, label: 'Collections' }
];

export default function NavBar({ onOpenAuth, session }) {
  return (
    <nav className="nav-rail">
      <NavLink className="brand-mark" to="/roadmap" title="NEXUS">
        NX
      </NavLink>

      <div className="nav-rail-links">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => `nav-icon-button ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={18} strokeWidth={2.1} />
            </NavLink>
          );
        })}
      </div>

      <button
        type="button"
        className="nav-icon-button profile-trigger"
        onClick={onOpenAuth}
        title={session.meta?.guest ? 'Open sign in' : session.user?.email}
      >
        <UserAvatar seed={session.user?.username || session.user?.name} name={session.user?.name} size={40} />
      </button>
    </nav>
  );
}
