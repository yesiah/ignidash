import SectionContainer from '@/components/ui/section-container';

export default function FooterDisclaimer() {
  return (
    <SectionContainer showBottomBorder={false} className="mb-0 py-4">
      <p className="text-muted-foreground text-center text-xs/6">
        For educational purposes only. Past performance is not indicative of future results.
      </p>
    </SectionContainer>
  );
}
