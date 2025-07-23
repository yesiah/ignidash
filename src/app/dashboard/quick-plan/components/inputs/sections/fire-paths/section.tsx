import SectionHeader from '@/components/ui/section-header';
import SectionContainer from '@/components/ui/section-container';

import CoastFIRE from './coast-fire';
import BaristaFIRE from './barista-fire';

export default function FIREPathsSection() {
  return (
    <SectionContainer showBottomBorder={false}>
      <SectionHeader
        title="Flexible Paths"
        desc="Blend work and freedom in ways that fit your life. Explore if curious, skip if not."
        status="optional"
      />
      <CoastFIRE />
      <BaristaFIRE />
    </SectionContainer>
  );
}
