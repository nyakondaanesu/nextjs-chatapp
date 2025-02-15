import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <SessionProvider session={session}>
        <div className="flex-col text-white ">
          <h1 className="text-white text-lg font-bold">
            Terms of Service for StreaMates
          </h1>
          <p className="mt-2 text-white">Last updated: 15/02/2025</p>
          <h3 className="mt-10 text-lg text-white font-bold">
            1. Acceptance of Terms
          </h3>
          <p className="mt-2 text-white">
            By accessing or using StreaMates "the Service", you agree to comply
            with these Terms of Service "Terms" and our Privacy Policy. If you
            do not agree to these Terms, you must not use the Service.
          </p>
          <h3 className="mt-10 text-lg text-white font-bold">2. Eligibility</h3>
          <p className="mt-2">
            You must be at least 18 years old to use StreaMates. By using the
            Service, you represent and warrant that you are at least 13 years of
            age or have the consent of a parent or guardian.
          </p>
          <h3 className="mt-10 text-lg font-bold tect-white">
            3. Account Registration
          </h3>
          <p className="mt-2">
            To use certain features of the Service, you may be required to
            create an account. You agree to provide accurate, current, and
            complete information during the registration process and to update
            your information to keep it accurate. You are responsible for
            maintaining the confidentiality of your account credentials and are
            fully responsible for all activities that occur under your account.
            If you believe your account has been compromised, you agree to
            notify us immediately.
          </p>
          <h3 className="mt-10 text-lg font-bold text-white">User Conduct</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>Use the Service for any unlawful or prohibited purposes.</li>
            <li>
              Engage in harassment, hate speech, or harmful behavior towards
              other users.
            </li>
            <li>
              Upload, post, or share content that is offensive, harmful, or
              violates any intellectual property rights.
            </li>
            <li>
              Attempt to access or interfere with any part of the Service that
              you are not authorized to use.
            </li>
          </ul>
          <h3 className="mt-10 text-lg font-bold text-white">
            5. User Content
          </h3>
          <p className="mt-2 text-white">
            You retain ownership of any content you post, upload, or share
            through the Service. By submitting content to StreaMates, you grant
            us a worldwide, royalty-free, non-exclusive license to use, display,
            and distribute your content solely for the purpose of providing the
            Service. You acknowledge that we may remove or refuse to display
            content that we deem inappropriate, in violation of these Terms, or
            harmful to the Service or other users.
          </p>
          <h3 className="mt-10 text-lg font-bold text-white">6. Privacy</h3>
          <p className="mt-2 text-white">
            We respect your privacy and handle your data in accordance with our
            Privacy Policy. By using the Service, you agree to the collection,
            storage, and processing of your personal data as described in our
            Privacy Policy.
          </p>
          <h3 className="mt-10 text-lg font-bold text-white">7. Termination</h3>
          <p className="mt-2">
            We may suspend or terminate your account and access to the Service
            at any time, without prior notice, if we believe you have violated
            these Terms or for any other reason at our sole discretion. You may
            terminate your account at any time by contacting us or through the
            app settings.
          </p>
          <h3 className="mt-10 text-lg font-bold">
            8. Limitation of Liability
          </h3>
          <p className="mt-2">
            StreaMates and its affiliates, partners, or employees are not liable
            for any direct, indirect, incidental, special, or consequential
            damages resulting from your use or inability to use the Service,
            including but not limited to any loss of data, revenue, or
            reputation.
          </p>
          <h3 className="mt-10 text-lg font-bold">
            9. Disclaimer of Warranties
          </h3>
          <p className="mt-2">
            The Service is provided "as is" and "as available," without any
            warranties of any kind, either express or implied. We do not
            guarantee the accuracy, completeness, or reliability of the Service
            and are not responsible for any errors or interruptions in service.
          </p>
          <h3 className="mt-10 text-lg font-bold">10. Changes to Terms</h3>
          <p className="mt-2">
            We may update these Terms from time to time. We will notify you of
            any significant changes through the Service or by email. Your
            continued use of the Service after changes to these Terms
            constitutes your acceptance of the updated Terms.
          </p>
          <h3 className="mt-10 text-lg font-bold">11. Governing Law</h3>
          <p className="mt-2">
            These Terms are governed by the laws of your country. Any disputes
            will be resolved in the competent courts of [Your Jurisdiction].
          </p>
          <h3 className="mt-10 text-lg font-bold">12. Contact Us</h3>
          <p className="mt-2">
            If you have any questions about these Terms or the Service, please
            contact us at: Email: [nyakondaa@africau.edu] Website: [
            https://nextjs-chatapp-zeta.vercel.app]
          </p>
        </div>
      </SessionProvider>
    </>
  );
};

export default Home;
