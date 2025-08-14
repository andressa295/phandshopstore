'use client';
import React from 'react';
import styles from './Sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSupabase } from '@/app/(site)/components/SupabaseProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  // onLogout agora não é mais uma prop, pois o logout é gerenciado internamente
}

const Sidebar: React.FC = () => {
  const { user } = useSupabase();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Receita', path: '/admin/receita' },
    { name: 'Lojistas', path: '/admin/usuarios' },
    { name: 'Suporte', path: '/admin/suporte' },
    { name: 'Planos', path: '/admin/planos' },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login');
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <Image
          src="/logo.png"
          alt="Phandshop Logo"
          width={170}
          height={40}
          className={styles.logo}
        />
      </div>
      <nav>
        <ul className={styles.sidebarNav}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.sidebarNavItem}>
              <Link href={item.path} passHref>
                <a className={styles.sidebarLink}>
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
          <li className={styles.sidebarNavItem}>
            <button onClick={handleLogout} className={styles.sidebarButton}>
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;