import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn.js';

const DropdownContext = createContext(null);

export default function Dropdown({ trigger, children, align = 'end', className }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ close: () => setOpen(false), open }}>
      <div className={cn('dropdown', className)} ref={containerRef}>
        <span
          className="dropdown-trigger"
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen((value) => !value);
            }
          }}
        >
          {trigger}
        </span>
        {open && (
          <div className={cn('dropdown-menu', align === 'start' && 'dropdown-menu--start')} role="menu">
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownItem({ icon: Icon, danger, disabled, onClick, children }) {
  const { close } = useContext(DropdownContext);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    close();
  };

  return (
    <button
      type="button"
      className={cn('dropdown-item', danger && 'dropdown-item--danger', disabled && 'dropdown-item--disabled')}
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
    >
      {Icon && <Icon size={17} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function DropdownCaption({ children }) {
  return <div className="dropdown-caption">{children}</div>;
}

export function DropdownDivider() {
  return <div className="dropdown-divider" role="separator" />;
}