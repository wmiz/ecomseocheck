<script>
  import SEO from "$lib/components/SEO.svelte";
  import logo from "$lib/assets/logo.png";

  const pageTitle = "Terms of Service";
  const pageDescription =
    "Terms of Service for eComSEOCheck - Read our terms and conditions for using our Shopify store health audit tool.";
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
          Terms of Service
        </h1>
        <p class="text-sm text-[#26363f]/80">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <!-- Content -->
      <div class="bg-white shadow rounded-lg border border-gray-200 p-6 md:p-8 prose prose-slate max-w-none">
        <div class="text-[#26363f] space-y-6">
          
          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">1. Acceptance of Terms</h2>
            <p class="text-base leading-relaxed">
              By accessing and using eComSEOCheck ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p class="text-base leading-relaxed mt-4">
              These Terms of Service ("Terms") govern your access to and use of the eComSEOCheck website and services operated by Misback Consulting ("we," "us," or "our").
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">2. Description of Service</h2>
            <p class="text-base leading-relaxed">
              eComSEOCheck is a free Shopify store health audit tool that analyzes public product catalog data from Shopify stores. The Service:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>Analyzes publicly available product data from Shopify stores via the /products.json endpoint</li>
              <li>Provides SEO, conversion, and data integrity assessments</li>
              <li>Generates audit reports identifying potential issues and improvements</li>
              <li>Offers optional paid services for catalog cleanup and implementation</li>
            </ul>
            <p class="text-base leading-relaxed mt-4">
              We reserve the right to modify, suspend, or discontinue the Service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">3. Use of the Service</h2>
            
            <h3 class="text-xl font-semibold text-[#26363f] mb-3 mt-6">3.1 Eligibility</h3>
            <p class="text-base leading-relaxed">
              You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are of legal age to form a binding contract.
            </p>

            <h3 class="text-xl font-semibold text-[#26363f] mb-3 mt-6">3.2 Acceptable Use</h3>
            <p class="text-base leading-relaxed">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>Use the Service to audit stores you do not own or have authorization to audit</li>
              <li>Attempt to gain unauthorized access to any part of the Service or related systems</li>
              <li>Use automated systems (bots, scrapers) to access the Service in a manner that could harm or overload our servers</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any applicable local, state, national, or international law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">4. Data and Privacy</h2>
            <p class="text-base leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as described in our Privacy Policy.
            </p>
            <p class="text-base leading-relaxed mt-4">
              We only access publicly available data from Shopify stores (via /products.json). We do not require or collect passwords, admin access, or private store data. Any store data we access is already publicly available on the internet.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">5. Revenue Projections and Estimates</h2>
            <p class="text-base leading-relaxed">
              <strong class="font-semibold text-red-600">IMPORTANT DISCLAIMER:</strong> Any revenue projections, estimates, or potential revenue impact figures provided by the Service are rough, directional estimates based on generic benchmarks and simple assumptions. These projections are:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li><strong>Not guarantees or forecasts:</strong> Revenue projections are not promises of actual results</li>
              <li><strong>Highly speculative:</strong> Actual results may be significantly higher or lower than estimated</li>
              <li><strong>Based on assumptions:</strong> Estimates assume generic conversion improvements that may not apply to your specific store</li>
              <li><strong>Subject to many variables:</strong> Actual revenue depends on traffic mix, merchandising, pricing, ad spend, competition, market conditions, and many other factors beyond catalog health</li>
            </ul>
            <p class="text-base leading-relaxed mt-4">
              <strong>You should take all revenue projections with a large grain of salt.</strong> These estimates are provided for informational purposes only and should not be relied upon as the sole basis for business decisions. We make no representations or warranties regarding the accuracy of any revenue projections or estimates.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">6. Audit Results and Accuracy</h2>
            <p class="text-base leading-relaxed">
              While we strive to provide accurate and helpful audit results, we make no guarantees about:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>The completeness or accuracy of audit findings</li>
              <li>Whether fixing identified issues will result in improved SEO rankings, conversions, or revenue</li>
              <li>The applicability of recommendations to your specific business situation</li>
            </ul>
            <p class="text-base leading-relaxed mt-4">
              Audit results are based on automated analysis of publicly available data and may not capture all issues or nuances of your store. You are responsible for evaluating the relevance and accuracy of audit findings for your specific circumstances.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">7. Paid Services</h2>
            <p class="text-base leading-relaxed">
              We offer optional paid services, including catalog cleanup and implementation services. These services are subject to separate agreements and terms that will be provided at the time of purchase.
            </p>
            <p class="text-base leading-relaxed mt-4">
              Payment terms, refund policies, and service guarantees for paid services are governed by the specific terms provided with those services. Our satisfaction guarantee applies only to paid services as described in our guarantee policy.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">8. Intellectual Property</h2>
            <p class="text-base leading-relaxed">
              The Service and its original content, features, and functionality are owned by Misback Consulting and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p class="text-base leading-relaxed mt-4">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
            </p>
            <p class="text-base leading-relaxed mt-4">
              Audit reports generated for you are provided for your use, but the underlying methodology, algorithms, and Service remain our intellectual property.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">9. Disclaimer of Warranties</h2>
            <p class="text-base leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p class="text-base leading-relaxed mt-4">
              We do not warrant that:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>Any defects or errors will be corrected</li>
              <li>The Service is free of viruses or other harmful components</li>
              <li>The results of using the Service will meet your requirements</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">10. Limitation of Liability</h2>
            <p class="text-base leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MISBACK CONSULTING, ITS AFFILIATES, AGENTS, DIRECTORS, EMPLOYEES, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
            </p>
            <p class="text-base leading-relaxed mt-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL LIABILITY FOR ANY CLAIMS UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID US FOR THE SERVICE IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
            </p>
            <p class="text-base leading-relaxed mt-4">
              Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the above limitations may not apply to you.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">11. Indemnification</h2>
            <p class="text-base leading-relaxed">
              You agree to defend, indemnify, and hold harmless Misback Consulting and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney's fees and costs, arising out of or in any way connected with:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>Your access to or use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party right, including without limitation any intellectual property right, privacy right, or other proprietary right</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">12. Termination</h2>
            <p class="text-base leading-relaxed">
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p class="text-base leading-relaxed mt-4">
              Upon termination, your right to use the Service will cease immediately. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">13. Governing Law</h2>
            <p class="text-base leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Misback Consulting operates, without regard to its conflict of law provisions.
            </p>
            <p class="text-base leading-relaxed mt-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">14. Changes to Terms</h2>
            <p class="text-base leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p class="text-base leading-relaxed mt-4">
              What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-[#26363f] mb-4">15. Contact Information</h2>
            <p class="text-base leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
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

