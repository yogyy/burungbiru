import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-background p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-secondary p-8 shadow-md">
        <div className="mb-3 flex h-fit items-center justify-center gap-3">
          <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
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
            Thank you for using Burbir, a small open-source social app. We are committed to
            protecting your privacy and ensuring transparency about how we handle your data. This
            Privacy Policy explains what information we collect, how we use it, and your rights
            regarding your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">2. Information We Collect</h2>
          <p className="leading-relaxed text-foreground/90">
            We collect the following types of information:
          </p>
          <ul className="list-inside list-disc leading-relaxed text-foreground/90">
            <li>
              <strong>Account Information:</strong> When you create an account, we collect your
              username, email address, and password.
            </li>
            <li>
              <strong>Profile Information:</strong> You may choose to provide additional
              information, such as a profile picture, bio, or interests.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect data about how you interact with the app, such
              as posts, likes, and messages.
            </li>
            <li>
              <strong>Technical Data:</strong> We may collect device information, IP addresses, and
              browser type for analytics and security purposes.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            3. How We Use Your Information
          </h2>
          <p className="leading-relaxed text-foreground/90">We use your information to:</p>
          <ul className="list-inside list-disc leading-relaxed text-foreground/90">
            <li>Provide, maintain, and improve our services.</li>
            <li>Personalize your experience on the app.</li>
            <li>Communicate with you about updates, security alerts, and support messages.</li>
            <li>Monitor and analyze usage trends to improve the app.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">4. Data Sharing</h2>
          <p className="leading-relaxed text-foreground/90">
            We do not sell or share your personal data with third parties, except in the following
            cases:
          </p>
          <ul className="list-inside list-disc leading-relaxed text-foreground/90">
            <li>
              <strong>Open-Source Contributions:</strong> Since this app is open-source, some data
              (e.g., anonymized usage statistics) may be visible to contributors.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your data if required by law or
              to protect our rights and safety.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">5. Data Security</h2>
          <p className="leading-relaxed text-foreground/90">
            We take reasonable measures to protect your data, including encryption and secure server
            practices. However, no system is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">6. Your Rights</h2>
          <p className="leading-relaxed text-foreground/90">You have the right to:</p>
          <ul className="list-inside list-disc leading-relaxed text-foreground/90">
            <li>Access, update, or delete your personal information.</li>
            <li>Opt out of certain data collection or processing.</li>
            <li>Request a copy of your data in a machine-readable format.</li>
          </ul>
          <p className="mt-4 leading-relaxed text-foreground/90">
            To exercise these rights, please contact us at{" "}
            <a href="mailto:m.yogi.fs@gmail.com" className="text-blue-500 hover:underline">
              m.yogi.fs@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">7. Changes to This Policy</h2>
          <p className="leading-relaxed text-foreground/90">
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page, and we will notify you of significant updates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">8. Contact Us</h2>
          <p className="leading-relaxed text-foreground/90">
            If you have any questions about this Privacy Policy, please contact us at{" "}
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
