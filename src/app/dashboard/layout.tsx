'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { DesktopSidebar } from '@/components/layout/sidebar/desktop-sidebar';
import MobileHeader from '@/components/layout/sidebar/mobile-header';
import MobileSidebar from '@/components/layout/sidebar/mobile-sidebar';
import { getNavigation, getSecondaryNavigation, getCurrentPageTitle, getCurrentPageIcon } from '@/lib/navigation';
import { useSidebarCollapsed } from '@/lib/stores/quick-plan-store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const navigation = getNavigation(pathname);
  const secondaryNavigation = getSecondaryNavigation();
  const currentPageTitle = getCurrentPageTitle(pathname);
  const currentPageIcon = getCurrentPageIcon(pathname);
  const sidebarCollapsed = useSidebarCollapsed();

  return (
    <div className="group/sidebar" data-state={sidebarCollapsed ? 'collapsed' : 'expanded'}>
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        secondaryNavigation={secondaryNavigation}
      />
      <DesktopSidebar navigation={navigation} secondaryNavigation={secondaryNavigation} />
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} currentPageTitle={currentPageTitle} currentPageIcon={currentPageIcon} />
      {children}
    </div>
  );
}
