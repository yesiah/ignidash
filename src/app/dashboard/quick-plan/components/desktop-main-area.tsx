import ResultsSections from './outputs/results-sections';
import ResultsColumnHeader from './outputs/results-column-header';
// import Icons8AttributionLink from './outputs/icons8-attribution-link';

export default function DesktopMainArea() {
  return (
    <div className="hidden xl:block">
      <ResultsColumnHeader />
      <div className="flex h-full flex-col pt-[4.3125rem]">
        <ResultsSections />
        {/* <Icons8AttributionLink /> */}
      </div>
    </div>
  );
}
