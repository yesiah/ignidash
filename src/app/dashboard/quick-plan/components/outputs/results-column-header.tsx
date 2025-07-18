'use client';

import { useState, useCallback } from 'react';
import { PresentationChartLineIcon, LinkIcon, CheckIcon } from '@heroicons/react/24/outline';

import IconButton from '@/components/ui/icon-button';
import ColumnHeader from '@/components/ui/column-header';

export default function ResultsColumnHeader() {
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleLinkClick = useCallback(() => {
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2500);
  }, []);

  let icon;
  let label;

  if (isLinkCopied) {
    icon = CheckIcon;
    label = 'Link copied';
  } else {
    icon = LinkIcon;
    label = 'Link sharing';
  }

  return (
    <ColumnHeader
      title="Results"
      icon={PresentationChartLineIcon}
      iconButton={<IconButton icon={icon} label={label} onClick={handleLinkClick} />}
    />
  );
}
