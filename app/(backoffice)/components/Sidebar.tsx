"use client";
import React from 'react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Receita', path: '/admin/receita' },
    { name: 'Lojistas', path: '/admin/usuarios' },
    { name: 'Suporte', path: '/admin/suporte' },
    { name: 'Planos', path: '/admin/planos' },
    { name: 'Sair', path: 'logout', action: onLogout }
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'var(--purple-dark)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      gap: '1rem',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        
        <img
          src="/logo.png"
          alt="Phandshop Logo"
          style={{ width: '170px', height: 'auto' }}
        />
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '0.75rem' }}>
              {item.action ? (
                <button
                  onClick={item.action}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'none'}
                >
                  {item.name}
                </button>
              ) : (
                <a
                  href={item.path}
                  style={{
                    color: 'white',
                    padding: '0.75rem 1rem',
                    display: 'block',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'none'}
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

