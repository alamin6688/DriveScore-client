export const DEFAULT_PRIVACY_POLICY = `<h2>Introduction</h2>
<p>We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard data when you use our platform.</p>

<h2>1. Information We Collect</h2>
<p>We may collect:</p>
<ul>
  <li>Name and contact information</li>
  <li>Company information</li>
  <li>User account details</li>
  <li>Driver performance data</li>
  <li>Uploaded Excel or CSV files</li>
  <li>Login and activity records</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We use your information to:</p>
<ul>
  <li>Provide and maintain the platform</li>
  <li>Calculate performance scores and rankings</li>
  <li>Generate reports and analytics</li>
  <li>Manage competitions and leaderboards</li>
  <li>Improve platform functionality</li>
  <li>Communicate important updates and notifications</li>
</ul>

<h2>3. Data Security</h2>
<p>We do not sell, rent, or trade personal information to third parties.</p>
<p>Information may only be shared:</p>
<ul>
  <li>With authorized users within your organization</li>
  <li>When required by law</li>
  <li>With trusted service providers supporting platform operations</li>
</ul>

<h2>4. Data Storage</h2>
<p>All uploaded files and performance data are stored securely and are accessible only to authorized users associated with the respective company account.</p>

<h2>5. User Rights</h2>
<p>Users may have the right to:</p>
<ul>
  <li>Access their personal information</li>
  <li>Request corrections to inaccurate data</li>
  <li>Request deletion of personal data where applicable</li>
  <li>Update account information</li>
</ul>

<h2>6. Cookies and Analytics</h2>
<p>The platform may use cookies and similar technologies to improve user experience, monitor performance, and enhance security.</p>

<h2>7. Data Retention</h2>
<p>We retain information only for as long as necessary to provide services, comply with legal obligations, and support legitimate business purposes.</p>

<h2>8. Changes to This Policy</h2>
<p>We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date.</p>

<h2>9. Contact Us</h2>
<p>If you have any questions regarding this Privacy Policy, please contact us at:</p>
<p>Email: <a href="mailto:support@yourcompany.com" class="text-[#D13900] hover:underline font-bold">support@yourcompany.com</a></p>
<p>Website: <a href="https://www.yourcompany.com" target="_blank" rel="noopener noreferrer" class="text-[#D13900] hover:underline font-bold">www.yourcompany.com</a></p>`;

export const getPrivacyPolicy = (): string => {
  if (typeof window === "undefined") {
    return DEFAULT_PRIVACY_POLICY;
  }
  const saved = localStorage.getItem("privacy_policy_content");
  return saved || DEFAULT_PRIVACY_POLICY;
};

export const savePrivacyPolicy = (html: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("privacy_policy_content", html);
  }
};
