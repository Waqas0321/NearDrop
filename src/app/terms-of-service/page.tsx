import type { Metadata } from "next";
import {
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service — NearDrop",
  description: "Terms and conditions for using the NearDrop proximity sharing service.",
};

const CONTACT_EMAIL = "waqasakhtar548@gmail.com";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="June 19, 2025">
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using NearDrop (&quot;the Service&quot;), you agree to be bound
          by these Terms of Service. If you do not agree to these terms, please
          do not use the Service.
        </p>
        <p>
          NearDrop is operated by Muhammad Waqas Akhtar and provides web-based
          proximity sharing for text and files between nearby devices.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of Service">
        <p>
          NearDrop enables instant sharing of clipboard content and files with
          devices in your proximity using peer-to-peer technology. Features may
          include account registration, visibility radius controls, and connected
          device management.
        </p>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of
          the Service at any time with or without notice.
        </p>
      </LegalSection>

      <LegalSection title="3. User Accounts">
        <p>
          To access certain features, you may need to create an account. You are
          responsible for maintaining the confidentiality of your credentials
          and for all activity under your account.
        </p>
        <p>
          You agree to provide accurate information and notify us immediately of
          any unauthorized use of your account.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable Use">
        <p>You agree not to use NearDrop to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Share illegal, harmful, or infringing content</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Attempt to gain unauthorized access to systems or data</li>
          <li>Interfere with or disrupt the Service or connected devices</li>
          <li>Use the Service for any unlawful purpose</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Shared Content">
        <p>
          You retain ownership of content you share through NearDrop. You are
          solely responsible for the content you transmit and must ensure you
          have the right to share it with recipients.
        </p>
        <p>
          We do not monitor shared content but may remove access or suspend
          accounts that violate these Terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>
          The NearDrop name, logo, website design, and underlying technology
          are owned by Muhammad Waqas Akhtar and protected by applicable
          intellectual property laws. You may not copy, modify, or distribute
          our materials without written permission.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimer of Warranties">
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties
          of any kind, express or implied. We do not guarantee uninterrupted,
          error-free, or secure operation. Use of proximity sharing is at your
          own risk.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, NearDrop and its operator shall
          not be liable for any indirect, incidental, special, or consequential
          damages arising from your use of the Service, including loss of data
          or unauthorized access to shared content.
        </p>
      </LegalSection>

      <LegalSection title="9. Termination">
        <p>
          We may suspend or terminate your access to the Service at any time for
          violation of these Terms or for any other reason. You may delete your
          account at any time through your profile settings.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with
          applicable laws. Any disputes shall be resolved in the appropriate
          courts of jurisdiction where the operator resides, unless otherwise
          required by local law.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to Terms">
        <p>
          We may revise these Terms at any time. Updated terms will be posted on
          this page with a new &quot;Last updated&quot; date. Your continued use of
          NearDrop after changes constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          For questions about these Terms of Service, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary hover:text-primary-hover"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
