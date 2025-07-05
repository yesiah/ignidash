"use client";

import { useState } from "react";
import { DesktopSidebar } from "./components/desktop-sidebar";
import { MainArea } from "./components/main-area";
import { MobileHeader } from "./components/mobile-header";
import { MobileSidebar } from "./components/mobile-sidebar";
import { SecondaryColumn } from "./components/secondary-column";
import { navigation } from "./navigation";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <MobileSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          navigation={navigation}
        />

        <DesktopSidebar navigation={navigation} />

        <MobileHeader
          onMenuClick={() => setSidebarOpen(true)}
          currentPageTitle="Quick Plan"
        />

        <MainArea />
        <SecondaryColumn />
      </div>
    </>
  );
}
