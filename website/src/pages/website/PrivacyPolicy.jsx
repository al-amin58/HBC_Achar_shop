
const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: `Welcome to HBC Achar ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website hbcachar.com (the "Site") and use our services.

By accessing or using our Site, you agree to the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our Site.`
    },
    {
      title: "2. Information We Collect",
      content: `We collect personal information that you voluntarily provide to us when you:

• Register on our website or place an order
• Express interest in obtaining information about our products
• Participate in activities on the Site (such as promotions or surveys)
• Contact our customer support team

The personal information we collect may include:

• Name, email address, phone number, and delivery address
• Billing and payment information (processed securely through third-party payment gateways)
• Account login credentials
• Order history and product preferences
• Any other information you choose to provide`
    },
    {
      title: "3. How We Use Your Information",
      content: `We use the information we collect for various purposes, including:

• Processing and fulfilling your orders for our premium pickles and achar products
• Managing your account and providing customer support
• Communicating with you about orders, promotions, and updates
• Improving our website, products, and services
• Sending marketing communications (with your consent)
• Complying with legal obligations and preventing fraud
• Analyzing usage patterns to enhance user experience`
    },
    {
      title: "4. Cookies and Tracking Technologies",
      content: `We use cookies and similar tracking technologies to enhance your browsing experience. These help us:

• Remember your preferences and login sessions
• Understand how you interact with our Site
• Improve website functionality and performance
• Deliver personalized content and advertisements

You can manage your cookie preferences through your browser settings. However, disabling cookies may affect certain features of our Site.`
    },
    {
      title: "5. Sharing Your Information",
      content: `We do not sell or rent your personal information to third parties. We may share your information with:

• Delivery partners to fulfill your orders
• Payment processors to securely handle transactions
• Service providers who assist in operating our business
• Legal authorities when required by law

All third-party partners are contractually obligated to protect your information and use it only for the specified purposes.`
    },
    {
      title: "6. Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information:

• SSL encryption for data transmission
• Secure server infrastructure
• Regular security audits and updates
• Access controls and authentication procedures

While we strive to protect your data, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.`
    },
    {
      title: "7. Your Rights and Choices",
      content: `Depending on your location, you may have the following rights regarding your personal data:

• Access: Request a copy of the information we hold about you
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your personal data
• Opt-out: Unsubscribe from marketing communications
• Portability: Request transfer of your data to another service

To exercise these rights, please contact us at support@hbcachar.com.`
    },
    {
      title: "8. Data Retention",
      content: `We retain your personal information for as long as necessary to:

• Fulfill the purposes outlined in this Privacy Policy
• Comply with legal and regulatory requirements
• Resolve disputes and enforce our agreements

When your information is no longer needed, we will securely delete or anonymize it.`
    },
    {
      title: "9. Children's Privacy",
      content: `Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a minor, we will take steps to delete that information promptly.

If you believe we may have information from a child, please contact us immediately.`
    },
    {
      title: "10. Third-Party Links",
      content: `Our Site may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.`
    },
    {
      title: "11. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by:

• Posting the updated policy on our Site
• Sending an email notification to registered users
• Displaying a prominent notice on our homepage

The "Last Updated" date at the top of this page indicates when the policy was last revised.`
    },
    {
      title: "12. Contact Us",
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

📧 Email: support@hbcachar.com
📞 Phone: 017XX-XXXXXX
📍 Address: Dhaka, Bangladesh
🌐 Website: www.hbcachar.com

Our customer support team is available Sunday through Thursday, 9:00 AM to 6:00 PM (BST).`
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50/30 via-white to-orange-50/20">
      {/* Header Section */}
      <div className="bg-linear-to-r from-emerald-100/50 via-white to-orange-100/50 border-b border-emerald-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-orange-300 to-orange-400 rounded-2xl shadow-lg shadow-orange-200 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-800 mb-3">
              Privacy Policy
            </h1>
            <p className="text-emerald-600/80 text-sm md:text-base font-medium">
              Last Updated: May 5, 2026
            </p>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-1 w-12 bg-orange-300 rounded-full"></div>
              <div className="h-1 w-3 bg-emerald-300 rounded-full"></div>
              <div className="h-1 w-12 bg-orange-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          {/* Introduction Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8 mb-8">
            <p className="text-emerald-800/80 text-sm md:text-base leading-relaxed">
              At <span className="font-bold text-orange-500">HBC Achar</span>, we value your trust and are dedicated to safeguarding your personal information. This Privacy Policy outlines how we handle your data while you enjoy our premium pickles and traditional Bangladeshi achar products.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-emerald-100 hover:border-orange-200 transition-all duration-300 overflow-hidden group"
              >
                {/* Section Header */}
                <div className="px-6 md:px-8 py-5 bg-linear-to-r from-emerald-50/50 to-orange-50/30 border-b border-emerald-100/50">
                  <h2 className="text-lg md:text-xl font-bold text-emerald-800 group-hover:text-orange-600 transition-colors">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="px-6 md:px-8 py-5">
                  <div className="text-emerald-800/70 text-sm md:text-[15px] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-10 bg-linear-to-r from-orange-100/40 to-emerald-100/40 rounded-2xl p-6 md:p-8 border border-orange-200/50 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🥒</span>
              <span className="text-2xl">🌶️</span>
              <span className="text-2xl">🍯</span>
            </div>
            <p className="text-emerald-800 font-semibold text-sm md:text-base">
              Thank you for trusting HBC Achar with your information.
            </p>
            <p className="text-emerald-600/70 text-xs md:text-sm mt-2">
              Your privacy is as important to us as the quality of our pickles.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-300 to-orange-400 text-white font-bold rounded-xl hover:from-orange-400 hover:to-orange-500 transition shadow-md shadow-orange-200 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;