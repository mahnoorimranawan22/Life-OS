import { Bell, LogOut, Search } from 'lucide-react';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Dropdown, {
  DropdownItem,
  DropdownCaption,
  DropdownDivider,
} from '../components/ui/Dropdown.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { brand } from './navigation.js';

export default function Topbar({ title, user }) {
  const { logout } = useAuth();
  const displayName = user?.name || 'Guest';

  return (
    <header className="topbar">
      <span className="topbar-title topbar-title--desktop">{title}</span>
      <span className="topbar-title topbar-title--mobile">{brand.name}</span>

      <div className="topbar-spacer" />

      <div className="topbar-search">
        <Input type="search" placeholder="Search LifeOS…" icon={Search} aria-label="Search" />
      </div>

      <div className="topbar-right">
        <Badge variant="soft" dot>
          Beta
        </Badge>

        <button className="icon-btn" type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <Dropdown trigger={<Avatar name={displayName} />} align="end">
          <DropdownCaption>{displayName}</DropdownCaption>
          <DropdownDivider />
          <DropdownItem danger icon={LogOut} onClick={logout}>
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}