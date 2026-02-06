import React from 'react'
import { PlaceholderLayout } from './PlaceholderLayout'

export default function Contact() {
  return (
    <PlaceholderLayout title="Contact">
      <div className="terms-content contact-content">
        <p>Reach out for support, partnerships, or general inquiries.</p>

        <h2>Email</h2>
        <p>
          <a href="mailto:dev@datingpool.ai">dev@datingpool.ai</a>
        </p>

        <h2>Mailing address</h2>
        <p>
          DatingPool LLC<br />
          Houston, TX, United States
        </p>

        <div className="privacy-contact-box contact-box" aria-label="Contact details">
          <p className="privacy-contact-label">Quick contact</p>
          <p className="privacy-contact-email">
            <a href="mailto:dev@datingpool.ai">dev@datingpool.ai</a>
          </p>
          <p className="privacy-contact-note">
            Mailing: DatingPool LLC, Houston, TX, United States
          </p>
        </div>
      </div>
    </PlaceholderLayout>
  )
}
