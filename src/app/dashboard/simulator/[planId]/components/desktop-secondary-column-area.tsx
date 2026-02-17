import NumbersColumnSections from '../components/inputs/numbers-column-sections';
import NumbersColumnHeader from '../components/inputs/numbers-column-header';

export default function DesktopSecondaryColumnArea() {
  return (
    <>
      <NumbersColumnHeader />
      <div className="flex h-full flex-col pt-[4.3125rem]">
        <NumbersColumnSections />
      </div>
    </>
  );
}
