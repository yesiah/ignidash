import { LayoutDashboardIcon } from 'lucide-react';

import ColumnHeader from '@/components/ui/column-header';

import DashboardColumnHeaderButtons from './dashboard-column-header-buttons';

export default function DashboardColumnHeader() {
  return (
    <ColumnHeader
      title="Dashboard"
      icon={LayoutDashboardIcon}
      className="w-[calc(100%-18rem)] group-data-[state=collapsed]/sidebar:w-[calc(100%-4rem)]"
      iconButton={<DashboardColumnHeaderButtons />}
    />
  );
}
