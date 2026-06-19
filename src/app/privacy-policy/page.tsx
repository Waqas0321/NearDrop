import type { Metadata } from "next";
import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — NearDrop",
  description: "How NearDrop collects, uses, and protects your information.",
};

const CONTACT_EMAIL = "waqasakhtar548@gmail.com";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 19, 2025">
      <LegalSection title="1. Introduction">
        <p>
          Welcome to NearDrop (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). NearDrop is a
          web-based proximity sharing service that lets you share text and files
          with nearby devices. This Privacy Policy explains how we handle
          information when you use our website and services.
        </p>
        <p>
          By using NearDrop, you agree to the collection and use of information
          in accordance with this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          <strong className="text-foreground">Information you provide:</strong>{" "}
          When you create an account, we may collect your username, email
          address, and password. Content you type into the shared clipboard or
          files you choose to share are processed locally in your browser
          session unless you explicitly save or transmit them.
        </p>
        <p>
          <strong className="text-foreground">Automatically collected data:</strong>{" "}
          We may collect basic technical information such as browser type, device
          type, and general usage data to improve performance and security.
        </p>
        <p>
          <strong className="text-foreground">Proximity data:</strong> NearDrop
          scans for nearby devices to enable peer-to-peer sharing. We do not
          store your precise location on our servers; discovery happens through
          direct device-to-device communication where supported.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide and maintain the NearDrop service</li>
          <li>Authenticate your account and remember your preferences</li>
          <li>Enable file and clipboard sharing with nearby devices</li>
          <li>Respond to support requests and improve our product</li>
          <li>Protect against fraud, abuse, and security threats</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data Sharing & Transfers">
        <p>
          NearDrop is designed for direct peer-to-peer sharing. Shared content
          is transmitted between devices in your proximity and is not sold to
          third parties. We may share information only when required by law or
          to protect the rights and safety of our users.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>
          We implement industry-standard measures to protect your information,
          including encryption for data in transit where applicable. However, no
          method of transmission over the internet is 100% secure, and we
          cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies & Local Storage">
        <p>
          We use cookies and local storage to keep you signed in, remember your
          preferences, and improve your experience. You can control cookies
          through your browser settings, though some features may not function
          properly if cookies are disabled.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>You may have the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Access, update, or delete your account information</li>
          <li>Request a copy of data we hold about you</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Contact us with privacy-related questions or complaints</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Children&apos;s Privacy">
        <p>
          NearDrop is not intended for users under the age of 13. We do not
          knowingly collect personal information from children. If you believe a
          child has provided us with personal data, please contact us and we
          will take steps to remove it.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated &quot;Last updated&quot; date. Continued
          use of NearDrop after changes constitutes acceptance of the revised
          policy.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact Us">
        <p>
          If you have questions about this Privacy Policy, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary hover:text-primary-hover"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          NearDrop is operated by Muhammad Waqas Akhtar. Web Proximity Sharing
          Platform.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
