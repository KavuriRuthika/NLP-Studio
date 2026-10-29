import React from 'react';
import { Search, Bell, Sun, User, Menu } from 'lucide-react';
import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenCommandPalette?: () => void;
  onOpenMobileSidebar?: () => void;
  isCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenCommandPalette,
  onOpenMobileSidebar
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        height: '64px',
        backgroundColor: '#070a14',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 40
      }}
    >
      {/* Mobile Hamburger */}
      <button
        onClick={onOpenMobileSidebar}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '4px'
        }}
        className="mobile-hamburger"
      >
        <Menu size={20} />
      </button>

      {/* Global Search Bar (Exact Match from reference image) */}
      <div
        onClick={onOpenCommandPalette}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '380px',
          maxWidth: '45vw',
          backgroundColor: '#0f1424',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '7px 12px',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <Search size={15} color="#64748b" />
        <span style={{ fontSize: '0.82rem', color: '#64748b', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Search experiments, models, datasets...
        </span>
        <kbd
          style={{
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.66rem',
            color: '#94a3b8',
            fontWeight: 600
          }}
        >
          Ctrl K
        </kbd>
      </div>

      {/* Right Controls (Bell with dot, Sun toggle, User Avatar L) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Notification Bell with red dot */}
        <button
          onClick={onOpenCommandPalette}
          title="Notifications"
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#0f1424',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer'
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '7px',
              right: '8px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#ef4444'
            }}
          />
        </button>

        {/* Theme Toggle Sun Icon */}
        <button
          title="Toggle Theme"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#0f1424',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer'
          }}
        >
          <Sun size={16} />
        </button>

        {/* User Avatar Circle "K" */}
        <div
          title="User Profile: KAVURI RUTHIKA"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.45)'
          }}
        >
          K
        </div>
      </div>
    </header>
  );
};
