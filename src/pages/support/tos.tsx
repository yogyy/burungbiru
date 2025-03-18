import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

export default function ToSPage() {
  return (
    <div className="min-h-screen w-full bg-background p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-secondary p-8 shadow-md">
        <div className="mb-3 flex h-fit items-center justify-center gap-3">
          <h1 className="text-3xl font-bold text-primary">Terms of Service</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    color="currentColor"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10" />
                    <path d="M12.242 17v-5c0-.471 0-.707-.146-.854c-.147-.146-.382-.146-.854-.146m.75-3h.009" />
                  </g>
                </svg>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                You can just ignore it because this content is AI-generated.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">1. Introduction</h2>
          <p className="leading-relaxed text-foreground/90">
            Welcome to Burbir. By accessing or using our services, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">2. User Responsibilities</h2>
          <p className="leading-relaxed text-foreground/90">
            You are responsible for maintaining the confidentiality of your account and password.
            You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">3. Prohibited Activities</h2>
          <p className="leading-relaxed text-foreground/90">
            You may not use our services for any illegal or unauthorized purpose. You must not, in
            the use of the service, violate any laws in your jurisdiction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            4. Limitation of Liability
          </h2>
          <p className="leading-relaxed text-foreground/90">
            We shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages, including without limitation, loss of profits, data, use, goodwill, or other
            intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">5. Changes to Terms</h2>
          <p className="leading-relaxed text-foreground/90">
            We reserve the right to modify or replace these Terms at any time. Your continued use of
            the service after any changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">6. Contact Us</h2>
          <p className="leading-relaxed text-foreground/90">
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:m.yogi.fs@gmail.com" className="text-blue-500 hover:underline">
              m.yogi.fs@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
