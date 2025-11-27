const faqs = [
  {
    question: 'Can Ignidash give me advice about what to invest in?',
    answer:
      'No. Ignidash is a financial planning tool that helps you model and simulate your financial future. We do not provide personalized investment advice or recommendations. For investment advice tailored to your specific situation, please consult with a licensed financial advisor.',
  },
  {
    question: 'Does Ignidash support multiple currencies?',
    answer:
      'Currently, Ignidash only supports USD ($) and is tailored for US-based financial planning, including US tax rules and retirement accounts. International support is on our roadmap.',
  },
  {
    question: 'Is my financial data secure?',
    answer:
      'Yes. Your data is encrypted and stored securely using Convex, a modern database platform with enterprise-grade security. We never sell your personal information.',
  },
];

export default function FAQSection() {
  return (
    <div id="faq">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight text-pretty text-zinc-900 sm:text-4xl dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base/7 text-pretty text-zinc-600 dark:text-zinc-400">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our{' '}
              <a
                href="mailto:joe@schelske.dev"
                className="font-semibold text-rose-600 hover:text-rose-500 dark:text-rose-400 dark:hover:text-rose-300"
              >
                customer support
              </a>{' '}
              team (which is just me).
            </p>
          </div>
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-base/7 font-semibold text-zinc-900 dark:text-white">{faq.question}</dt>
                  <dd className="mt-2 text-base/7 text-zinc-600 dark:text-zinc-400">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
