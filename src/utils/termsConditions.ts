export const DEFAULT_TERMS_CONDITIONS = `<h2>Introduction</h2>
<p>By accessing or using the platform, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should not use the platform.</p>

<h2>Platform Services</h2>
<p>The platform provides tools for:</p>
<ul>
  <li>Uploading performance data</li>
  <li>Automated score calculations</li>
  <li>Driver rankings and leaderboards</li>
  <li>Competition management</li>
  <li>Analytics and reporting</li>
</ul>
<p>We reserve the right to modify, suspend, or discontinue any feature at any time.</p>

<h2>User Accounts</h2>
<p>Users are responsible for:</p>
<ul>
  <li>Maintaining the confidentiality of login credentials</li>
  <li>Ensuring account information is accurate</li>
  <li>All activities performed under their account</li>
</ul>
<p>You must immediately notify us of any unauthorized use of your account.</p>

<h2>Company Responsibilities</h2>
<p>Companies are responsible for:</p>
<ul>
  <li>Uploading accurate performance data</li>
  <li>Managing authorized users</li>
  <li>Maintaining compliance with applicable laws and regulations</li>
  <li>Ensuring proper use of the platform</li>
</ul>

<h2>Data Accuracy</h2>
<p>Performance scores, rankings, and reports are generated based on data provided by users.</p>
<p>We are not responsible for inaccuracies resulting from:</p>
<ul>
  <li>Incorrect uploads</li>
  <li>Missing information</li>
  <li>Improper configuration of scoring metrics</li>
  <li>Data entry errors</li>
</ul>

<h2>Intellectual Property</h2>
<p>All platform content, software, designs, logos, and features remain the property of the platform owner and are protected by applicable intellectual property laws.</p>
<p>Users may not copy, distribute, modify, or reproduce platform content without written permission.</p>

<h2>Acceptable Use</h2>
<p>Users agree not to:</p>
<ul>
  <li>Attempt unauthorized access to the platform</li>
  <li>Upload malicious files or software</li>
  <li>Disrupt platform operations</li>
  <li>Use the platform for unlawful activities</li>
  <li>Share access credentials with unauthorized individuals</li>
</ul>

<h2>Service Availability</h2>
<p>While we strive to maintain uninterrupted service, we do not guarantee that the platform will always be available, secure, or error-free.</p>
<p>Scheduled maintenance and unforeseen technical issues may affect availability.</p>

<h2>Limitation of Liability</h2>
<p>To the maximum extent permitted by law:</p>
<ul>
  <li>We are not liable for indirect, incidental, or consequential damages.</li>
  <li>We are not responsible for loss of business, profits, or data resulting from use of the platform.</li>
  <li>Total liability shall not exceed the amount paid for platform services during the preceding twelve months.</li>
</ul>

<h2>Account Suspension</h2>
<p>We reserve the right to suspend or terminate accounts that:</p>
<ul>
  <li>Violate these Terms & Conditions</li>
  <li>Engage in fraudulent activities</li>
  <li>Misuse the platform or its services</li>
</ul>

<h2>Termination</h2>
<p>Users may discontinue use of the platform at any time. Upon termination, access to platform services may be restricted or removed in accordance with applicable policies.</p>

<h2>Changes to Terms</h2>
<p>We may update these Terms & Conditions periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.</p>

<h2>Governing Law</h2>
<p>These Terms & Conditions shall be governed by and interpreted in accordance with applicable laws and regulations.</p>

<h2>Contact Information</h2>
<p>For questions regarding these Terms & Conditions, please contact:</p>
<p>Email: <a href="mailto:support@yourcompany.com" class="text-[#D13900] hover:underline font-bold">support@yourcompany.com</a></p>
<p>Website: <a href="https://www.yourcompany.com" target="_blank" rel="noopener noreferrer" class="text-[#D13900] hover:underline font-bold">www.yourcompany.com</a></p>`;

export const getTermsConditions = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_TERMS_CONDITIONS;
  }
  const saved = localStorage.getItem("terms_conditions_content");
  return saved || DEFAULT_TERMS_CONDITIONS;
};

export const saveTermsConditions = (html: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("terms_conditions_content", html);
  }
};
