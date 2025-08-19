import ResultsSections from './outputs/results-sections';
import ResultsColumnHeader from './outputs/results-column-header';

export default function DesktopMainArea() {
  return (
    <div className="hidden xl:block">
      <div className="sticky top-0 z-10">
        <ResultsColumnHeader />
      </div>
      <ResultsSections />
    </div>
  );
}
