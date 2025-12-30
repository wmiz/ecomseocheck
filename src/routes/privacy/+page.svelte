<script>
  import SEO from "$lib/components/SEO.svelte";
  import logo from "$lib/assets/logo.png";

  const pageTitle = "Privacy Policy";
  const pageDescription =
    "Privacy Policy for eComSEOCheck - Learn how we collect, use, and protect your information when using our Shopify store audit tool.";
</script>

<SEO
  title={pageTitle}
  description={pageDescription}
  image="/logo.png"
  type="website"
/>

<main class="min-h-[80vh] flex justify-center items-start pt-15 pb-15">
  <div class="container mx-auto px-4 w-full">
    <div class="max-w-4xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-10">
        <img
          src={logo}
          alt="eComSEOCheck - Shopify Store Health Audit Tool"
          width="200"
          height="auto"
          class="mx-auto mb-2 max-w-[200px] h-auto"
        />
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[#26363f]">
          Privacy Policy
        </h1>
        <p class="text-sm text-[#26363f]/80">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <!-- Content -->
      <div class="bg-white shadow rounded-lg border border-gray-200 p-6 md:p-8 prose prose-slate max-w-none">
        <div class="text-[#26363f] space-y-6">
          
          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">1. Introduction</h2>
            <p class="text-base leading-relaxed">
              Welcome to eComSEOCheck ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your information. This Privacy Policy explains our practices regarding data collection and usage when you use our Shopify store health audit tool.
            </p>
            <p class="text-base leading-relaxed mt-4">
              By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">2. Information We Collect</h2>
            
            <h3 class="text-xl font-semibold text-[#26363f] mb-3 mt-6">2.1 Information You Provide</h3>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li><strong>Store URL:</strong> When you submit a Shopify store URL for auditing, we collect and process this information to perform the audit.</li>
              <li><strong>Email Address:</strong> If you choose to download your audit report, we collect your email address to send you the report and may contact you about the audit and related ecommerce topics (with your consent).</li>
              <li><strong>Contact Information:</strong> If you contact us through our contact form, we collect your name, email address, subject, and message content.</li>
            </ul>

            <h3 class="text-xl font-semibold text-[#26363f] mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p class="text-base leading-relaxed">
              When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Date and time of visits</li>
              <li>Click patterns and user interactions</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">3. How We Use Your Information</h2>
            <p class="text-base leading-relaxed">
              We use the information we collect for the following purposes:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li><strong>Service Delivery:</strong> To provide our audit service, analyze Shopify store data, and generate audit reports.</li>
              <li><strong>Communication:</strong> To send you audit reports, respond to your inquiries, and (with your consent) contact you about our services and related ecommerce topics.</li>
              <li><strong>Analytics and Improvement:</strong> To understand how users interact with our website, improve our services, and enhance user experience.</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">4. Analytics and Tracking Technologies</h2>
            
            <h3 class="text-xl font-semibold text-[#26363f] mb-3 mt-6">4.1 Google Analytics 4 (GA4)</h3>
            <p class="text-base leading-relaxed">
              We use Google Analytics 4, a web analytics service provided by Google LLC, to collect and analyze information about how visitors use our website. GA4 uses cookies and similar technologies to track and report website traffic and user behavior.
            </p>
            <p class="text-base leading-relaxed mt-4">
              Google Analytics collects information such as:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>How you found our website (referral sources)</li>
              <li>Pages you visit and time spent on each page</li>
              <li>User interactions (clicks, scrolls, form submissions)</li>
              <li>Device and browser information</li>
              <li>Geographic location (general, not specific)</li>
            </ul>
            <p class="text-base leading-relaxed mt-4">
              This information is used to help us understand website usage patterns and improve our services. Google Analytics may collect your IP address, but we have configured it to anonymize IP addresses where possible. Google's use of data collected through Google Analytics is governed by Google's Privacy Policy, available at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-[#00a979] hover:underline">https://policies.google.com/privacy</a>.
            </p>
            <p class="text-base leading-relaxed mt-4">
              You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on, available at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="text-[#00a979] hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
            </p>

            <h3 class="text-xl font-semibold text-[#26363f] mb-3 mt-6">4.2 Microsoft Clarity</h3>
            <p class="text-base leading-relaxed">
              We use Microsoft Clarity, a web analytics and user behavior analysis tool provided by Microsoft Corporation, to understand how users interact with our website. Clarity helps us identify usability issues and improve the user experience.
            </p>
            <p class="text-base leading-relaxed mt-4">
              Microsoft Clarity collects information such as:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>Mouse movements, clicks, and scrolling behavior</li>
              <li>Session recordings (heatmaps and replays)</li>
              <li>Page views and navigation patterns</li>
              <li>Device and browser information</li>
              <li>Performance metrics</li>
            </ul>
            <p class="text-base leading-relaxed mt-4">
              Microsoft Clarity may collect your IP address and other device identifiers. Microsoft's use of data collected through Clarity is governed by Microsoft's Privacy Statement, available at <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" class="text-[#00a979] hover:underline">https://privacy.microsoft.com/privacystatement</a>.
            </p>
            <p class="text-base leading-relaxed mt-4">
              You can learn more about Microsoft Clarity and opt out at <a href="https://clarity.microsoft.com/opt-out" target="_blank" rel="noopener noreferrer" class="text-[#00a979] hover:underline">https://clarity.microsoft.com/opt-out</a>.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">5. Cookies and Similar Technologies</h2>
            <p class="text-base leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small data files stored on your device that help us improve your experience and analyze website usage.
            </p>
            <p class="text-base leading-relaxed mt-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">6. Data Sharing and Disclosure</h2>
            <p class="text-base leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf, such as analytics providers (Google Analytics, Microsoft Clarity), email service providers, and hosting services. These providers are contractually obligated to protect your information and use it only for the purposes we specify.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or others.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">7. Data Security</h2>
            <p class="text-base leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">8. Data Retention</h2>
            <p class="text-base leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">9. Your Rights and Choices</h2>
            <p class="text-base leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li><strong>Access:</strong> Request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information.</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format.</li>
            </ul>
            <p class="text-base leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">10. Children's Privacy</h2>
            <p class="text-base leading-relaxed">
              Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">11. International Data Transfers</h2>
            <p class="text-base leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our service, you consent to the transfer of your information to these countries.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">12. Changes to This Privacy Policy</h2>
            <p class="text-base leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">13. Contact Us</h2>
            <p class="text-base leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul class="list-none pl-0 space-y-2 text-base leading-relaxed mt-4">
              <li><strong>Website:</strong> <a href="/contact" class="text-[#00a979] hover:underline">Contact Us</a></li>
              <li><strong>Company:</strong> Misback Consulting</li>
              <li><strong>Website:</strong> <a href="https://willmisback.com" target="_blank" rel="noopener noreferrer" class="text-[#00a979] hover:underline">willmisback.com</a></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  </div>
</main>


