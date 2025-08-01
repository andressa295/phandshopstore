import { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import ClientDashboardLayout from './components/ClientDashboardLayout'; 

export default function PainelLayout({ children }: { children: ReactNode }) {
    return (
        <UserProvider> 
            <ClientDashboardLayout>{children}</ClientDashboardLayout>
        </UserProvider>
    );
}