"use client";
import "./terms.css";
import React from "react";

const Terms : React.FC = () => {
  return (
    <div className="terms-container">
      <h1>Terms of Use</h1>
      <p>Effective: December 24, 2024</p>

      <section>
        <p>
          Welcome to Anecdote, a content-hosting 
          platform where creators can build, 
          showcase, and exchange unique digital content in a protected, 
          secure environment. By using Anecdote’s services (“Services”), 
          you agree to these Terms of Use (“Terms”) and accept the rights 
          and responsibilities associated with our platform. These Terms 
          apply to all users, including creators, buyers, and public browsers.
        </p>
      </section>

      <section>
        <h1>1. Account Registration and Access</h1>
        <p>
          <strong>1.1 General Browsing Access:</strong> The general public may freely 
          browse Anecdote-hosted content, but creating or purchasing content 
          requires a paid monthly or annual subscription.
        </p>
        <p>
          <strong>1.2 Age Requirement:</strong> Users as young as 8 years old 
          may create content on Anecdote. We recommend that users 
          under 18 seek parental guidance for safe usage and assistance 
          with any income management.
        </p>
        <p>
          <strong>1.3 Registration Requirements:</strong> No Know-Your-Customer (KYC) 
          verification is required for Anecdote. Users do not need 
          to provide a real name, home address, or similar identifying information.
        </p>
        <p>
          <strong>1.4 Account Security and Deactivation:</strong> Users are 
          responsible for protecting their account 
          credentials. Creators may delete content they 
          have created and deactivate their accounts without full deletion.
        </p>
      </section>

      <section>
        <h1>2. Content Ownership, Authorship, and Intellectual Property</h1>
        <p>
          <strong>2.1 User-Created Content:</strong> Creators retain all authorship and intellectual 
          property rights for their content on Anecdote, securing recognition 
          and protection as the original creator even after the content is sold.
        </p>
        <p>
          <strong>2.2 Transfer of Ownership and Usage Rights:</strong> 
          When content is sold, the buyer receives full 
          ownership rights for personal or commercial use, 
          while authorship and intellectual property rights 
          remain with the original creator.
        </p>
        <p>
          <strong>2.3 Content Deletion by Creator:</strong> Creators may delete 
          their unsold content at their discretion. Once deleted, 
          Anecdote ceases to protect the intellectual property of the deleted content.
        </p>
      </section>

      <section>
        <h1>3. Content Usage and Platform Restrictions</h1>
        <p>
          <strong>3.1 Permitted Use:</strong> Users are granted a limited, 
          revocable license to access and use Anecdote strictly 
          for personal, non-commercial purposes unless 
          otherwise permitted in writing.
        </p>
        <p>
          <strong>3.2 Prohibited Activities:</strong> Users agree not to engage in:
        </p>
        <ul>
          <li>Any unlawful, harmful, or abusive activities.</li>
          <li>Intellectual property infringements or unauthorized reproductions.</li>
          <li>Attempts to modify, decompile, or reverse engineer any part of Anecdote’s Services.</li>
          <li>Automated data scraping or unauthorized data extraction.</li>
          <li>Misrepresentation of any Anecdote-hosted content.</li>
        </ul>
        <p>
          <strong>3.3 Security and Integrity Compliance:</strong> Users 
          must not interfere with Anecdote’s infrastructure, attempt to bypass security protections, or engage 
          in activities that compromise the 
          security and integrity of the Services.
        </p>
      </section>

      <section>
        <h1>4. Subscription, Billing, and Refunds</h1>
        <p>
          <strong>4.1 Paid Subscriptions:</strong> To access content creation and 
          purchase features, users must subscribe to a paid monthly or annual plan.
        </p>
        <p>
          <strong>4.2 Billing Cycle and Payment:</strong>Subscriptions are automatically billed at the start of each billing cycle 
          (monthly or annual). Users are responsible for 
          maintaining valid payment information.
        </p>
        <p>
          <strong>4.3 Refunds:</strong>
        </p>
        <ul>
          <li>
            <strong>Monthly Subscription:</strong> A 95% refund is 
            available if canceled within 14 days of purchase. After this duration, 
            monthly subscription is non-refundable.
          </li>
          <li>
            <strong>Annual Subscription:</strong> A 90% refund is 
            available if canceled within 23 days of purchase.
            After this duration, 
            annual subscription is non-refundable.
          </li>
        </ul>
      </section>

      <section>
        <h1>5. Termination and Account Suspension</h1>
        <p>
          <strong>5.1 User-Initiated Termination:</strong> Users may deactivate 
          their Anecdote account at any time, retaining historical access as needed.
        </p>
        <p>
          <strong>5.2 Anecdote’s Right to Suspend or Terminate Accounts:</strong> Anecdote 
          reserves the right to suspend or remove any content or account that violates 
          these Terms, infringes on rights, or contravenes applicable laws or platform guidelines.
        </p>
      </section>

      <section>
        <h1>6. Dispute Resolution and Governing Law</h1>
        <p>
          <strong>6.1 Informal Resolution:</strong> In the event of a dispute, 
          users agree to first contact Anecdote for an informal resolution.
        </p>
        <p>
          <strong>6.2 Governing Law:</strong> These Terms are governed 
          by the applicable laws in your region.
        </p>
      </section>

      <section>
        <h1>7. Updates to These Terms</h1>
        <p>
          <strong>7.1 Changes to Terms:</strong> Anecdote reserves the right to update 
          these Terms periodically, reflecting service improvements, 
          regulatory changes, or security enhancements. Users will 
          receive notice of material changes at least 30 days in advance.
        </p>
        <p>
          <strong>7.2 Acceptance of Updated Terms:</strong> Continuing to use Anecdote’s 
          Services following a change in 
          Terms signifies acceptance of the updated Terms.
        </p>
        <p>
        Thank you for being a valued part of the Anecdote community. 
        We are committed to ensuring a safe, secure, and 
        creative environment that honors your rights, intellectual 
        property, and the unique value of your work.
        </p>
      </section>
    </div>
  );
};

export default Terms;
