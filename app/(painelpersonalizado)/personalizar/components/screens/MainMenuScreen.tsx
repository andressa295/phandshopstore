import React, { Fragment } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { PersonalizacaoMenuItem } from '../utils/constants';

interface MainMenuScreenProps {
  personalizacaoMenuItems: PersonalizacaoMenuItem[];
  activeScreenKey: string;
  navigateToScreen: (key: string) => void;
  openMenus: Record<string, boolean>;
  setOpenMenus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  personalizacaoMenuItems,
  activeScreenKey,
  navigateToScreen,
  openMenus,
  setOpenMenus,
}) => {
  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div style={{ padding: 12, flexGrow: 1, overflowY: 'auto', fontFamily: 'Poppins, sans-serif' }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#888' }}>
        IMAGEM DA SUA MARCA
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {personalizacaoMenuItems.map(item => (
          <li key={item.label} style={{ marginBottom: 6 }}>
            {item.children ? (
              <Fragment>
                <div
                  onClick={() => toggleMenu(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 500,
                    color: '#333',
                    fontSize: 14,
                    userSelect: 'none',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    background: activeScreenKey === item.screenKey ? '#f7f4fc' : 'transparent',
                    borderRadius: 4,
                  }}
                  aria-expanded={!!openMenus[item.label]}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleMenu(item.label);
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {openMenus[item.label] ? (
                    <FaChevronUp size={12} style={{ marginLeft: 'auto' }} />
                  ) : (
                    <FaChevronDown size={12} style={{ marginLeft: 'auto' }} />
                  )}
                </div>
                {openMenus[item.label] && (
                  <ul style={{ marginTop: 4, paddingLeft: 12, listStyle: 'none' }}>
                    {item.children.map(child => (
                      <li key={child.label} style={{ padding: '3px 0', fontSize: 13 }}>
                        <div
                          onClick={() => navigateToScreen(child.screenKey)}
                          style={{
                            color: activeScreenKey === child.screenKey ? '#7C3AED' : '#666',
                            cursor: 'pointer',
                            background: activeScreenKey === child.screenKey ? '#f7f4fc' : 'transparent',
                            borderRadius: 4,
                            padding: '4px 10px',
                            userSelect: 'none',
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              navigateToScreen(child.screenKey);
                            }
                          }}
                          aria-current={activeScreenKey === child.screenKey ? 'page' : undefined}
                        >
                          {child.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Fragment>
            ) : (
              <div
                onClick={() => item.screenKey && navigateToScreen(item.screenKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontWeight: 500,
                  color: activeScreenKey === item.screenKey ? '#7C3AED' : '#333',
                  fontSize: 14,
                  userSelect: 'none',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  background: activeScreenKey === item.screenKey ? '#f7f4fc' : 'transparent',
                  borderRadius: 4,
                }}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.screenKey && navigateToScreen(item.screenKey);
                  }
                }}
                aria-current={activeScreenKey === item.screenKey ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainMenuScreen;
