import React from 'react'
import { PlaceholderLayout } from './PlaceholderLayout'

export default function PrivacyPolicy() {
  return (
    <PlaceholderLayout title="Privacy Policy">
      <div className="terms-content privacy-content">
        <p>
          DatingPool LLC (“DatingPool,” “we,” “us,” or “our”) is committed to protecting your privacy. This policy describes our practices regarding the collection, use, and disclosure of information via the DatingPool mobile application and related services (the “Service”).
        </p>
        <p>
          This Service is intended for users in the United States. If you do not agree with this policy, please discontinue use of the Service immediately.
        </p>

        <h2>1. Contact Information</h2>
        <p>DatingPool LLC is the business responsible for your data.</p>
        <ul>
          <li><strong>Address:</strong> 5473 Blair Road STE 100, Dallas, Texas, United States</li>
          <li><strong>Website:</strong> <a href="https://datingpool.ai" target="_blank" rel="noopener noreferrer">https://datingpool.ai</a></li>
          <li><strong>Support Email:</strong> <a href="mailto:dev@datingpool.ai">dev@datingpool.ai</a></li>
        </ul>

        <h2>2. Information We Collect</h2>
        <p>We collect data to help you build connections and to keep our community safe.</p>

        <h3>A. Information You Provide</h3>
        <ul>
          <li><strong>Account Details:</strong> Email, phone number, and login credentials.</li>
          <li><strong>Profile Data:</strong> Photos, gender, interests, and “prompts.”</li>
          <li><strong>Identity Verification:</strong> If you use our “Verified” features, we may process your government ID or face-geometry data (biometrics) to confirm your identity.</li>
        </ul>

        <h3>B. Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage Metadata:</strong> Features used, time spent in-app, and interaction history.</li>
          <li><strong>Device Information:</strong> IP address, device model, OS version, and unique device identifiers (e.g., IDFA/AAID).</li>
        </ul>

        <h3>C. Precise Location Data</h3>
        <p>With your permission, we collect GPS-level location to show you nearby matches. You can toggle this off in your device settings, though it will limit the app’s core functionality.</p>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li><strong>Matching &amp; Connection:</strong> Using your preferences and location to suggest compatible partners.</li>
          <li><strong>Safety &amp; Moderation:</strong> Using automated systems and human review to detect harassment, fake profiles, and prohibited content.</li>
          <li><strong>Service Improvement:</strong> Training our algorithms to show you more relevant profiles.</li>
          <li><strong>Marketing:</strong> With your consent, we may send you news about new features or local DatingPool events.</li>
        </ul>

        <h2>4. How We Share Information</h2>
        <ul>
          <li><strong>With Other Users:</strong> Any information you set as “Public” or “Visible” can be seen by other users.</li>
          <li><strong>Service Providers:</strong> We share data with third parties for cloud hosting (e.g., AWS/Google Cloud), analytics, and payment processing.</li>
          <li><strong>Legal &amp; Law Enforcement:</strong> We will disclose data if required by a subpoena, court order, or to protect the physical safety of our users.</li>
        </ul>

        <h2>5. Key Legal Protections</h2>

        <h3>A. Biometric Data (Photo Verification)</h3>
        <p>If you opt-in to photo verification, we use facial recognition technology to compare your “selfie” to your profile photos. This data is used only for verification and is generally deleted once the process is complete, unless legal retention is required.</p>

        <h3>B. “Do Not Sell or Share” My Information</h3>
        <p>DatingPool does not sell your personal data for money. However, under some US state laws, sharing data for targeted advertising may be considered a “sale.” You may opt-out of this sharing by contacting <a href="mailto:dev@datingpool.ai">dev@datingpool.ai</a>.</p>

        <h3>C. Data Retention Limits</h3>
        <p>We keep your data only as long as your account is active. If your account is inactive for two years, we reserve the right to delete your data to protect your privacy.</p>

        <h2>6. Your Rights &amp; Choices</h2>
        <p>Depending on your state of residence (e.g., California, Texas, Virginia, Colorado), you have the following rights:</p>
        <ul>
          <li><strong>Right to Know:</strong> Request a list of the data we have collected about you.</li>
          <li><strong>Right to Delete:</strong> Request that we wipe your account and all associated data.</li>
          <li><strong>Right to Correct:</strong> Update inaccurate info directly in the app.</li>
          <li><strong>Right to Appeal:</strong> If we deny a privacy request, you can appeal by emailing us.</li>
        </ul>
        <p>To exercise these rights, please email <a href="mailto:dev@datingpool.ai">dev@datingpool.ai</a> with the subject line “Privacy Rights Request.”</p>

        <h2>7. Security Measures</h2>
        <p>We use industry-standard encryption (SSL/TLS) for data in transit and at rest. While we strive to protect your data, no system is 100% secure. We encourage users to use strong, unique passwords.</p>

        <h2>8. Children’s Privacy</h2>
        <p>The Service is restricted to users 18 years of age or older. If we discover a user is under 18, we will terminate the account and delete all associated data immediately.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this policy to reflect changes in the law or our app features. We will notify you of material changes via an in-app alert or email.</p>

        <h2 id="data-deletion">10. Data Deletion Requests</h2>
        <p>To request deletion of your personal data and account information, please contact us using the information below. We will process valid requests in accordance with applicable law.</p>
        <div className="privacy-contact-box" aria-label="Data deletion contact">
          <p className="privacy-contact-label">Contact for data deletion and privacy requests:</p>
          <p className="privacy-contact-email">
            <a href="mailto:dev@datingpool.ai?subject=Data%20Deletion%20Request">dev@datingpool.ai</a>
          </p>
          <p className="privacy-contact-note">Include “Data Deletion Request” or “Privacy Rights Request” in the subject line so we can route your request quickly.</p>
        </div>
      </div>
    </PlaceholderLayout>
  )
}
