import LegalNavbar from '../components/legal-navbar';

export default function TermsPage() {
  return (
    <>
      <LegalNavbar title="Terms of Service" />
      <main className="h-full overflow-y-auto">
        <div className="mx-auto max-w-prose px-4 pt-[4.25rem] pb-[2.125rem] sm:px-6 lg:px-8"></div>
      </main>
    </>
  );
}
