
interface CreatorLayoutProps {
  children: React.ReactNode;
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <main style={{ flexGrow: 1 }}>{children}</main>
    </div>
  );
}
