'use client';

import { useState } from 'react';

import { DesktopSidebar } from '@/components/layout/sidebar/desktop-sidebar';
import MobileHeader from '@/components/layout/sidebar/mobile-header';
import MobileSidebar from '@/components/layout/sidebar/mobile-sidebar';
import { useSidebarCollapsed } from '@/lib/stores/simulator-store';
import UnauthenticatedWrapper from '@/components/layout/unauthenticated-wrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarClose = () => setSidebarOpen(false);

  const sidebarCollapsed = useSidebarCollapsed();

  return (
    <div className="group/sidebar h-full" data-state={sidebarCollapsed ? 'collapsed' : 'expanded'}>
      <MobileSidebar open={sidebarOpen} onClose={handleSidebarClose} />
      <DesktopSidebar />
      <div className="flex h-full flex-col">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <UnauthenticatedWrapper>{children}</UnauthenticatedWrapper>
      </div>
    </div>
  );
}
