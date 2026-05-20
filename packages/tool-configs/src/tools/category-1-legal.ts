import type { ToolConfig } from '@aifreetools/shared-types';
import { US_STATES, LEGAL_TEMPLATE } from '../constants';

export const ndaGenerator: ToolConfig = {
  id: 'nda-generator',
  slug: 'nda-generator',
  name: 'Free NDA Generator',
  shortName: 'NDA Generator',
  category: 'legal-documents',
  description: 'Generate a professional, legally structured Non-Disclosure Agreement in seconds using AI. Customizable for any state, business type, or use case.',
  tagline: 'Generate a legally structured NDA in seconds — free, AI-powered.',
  icon: 'shield',
  sortOrder: 1,
  isFeatured: true,
  formSchema: {
    fields: [
      { id: 'disclosingParty', type: 'text', label: 'Disclosing Party (Your Name/Company)', placeholder: 'e.g. Acme Corp or John Smith', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'receivingParty', type: 'text', label: 'Receiving Party', placeholder: 'e.g. Jane Doe or Beta LLC', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'ndaType', type: 'radio', label: 'NDA Type', required: true, defaultValue: 'one-way', options: [{ value: 'one-way', label: 'One-Way (Unilateral)' }, { value: 'mutual', label: 'Mutual (Bilateral)' }] },
      { id: 'state', type: 'select', label: 'Governing State', required: true, options: US_STATES },
      { id: 'duration', type: 'select', label: 'Agreement Duration', required: true, defaultValue: '2', options: [{ value: '1', label: '1 Year' }, { value: '2', label: '2 Years' }, { value: '3', label: '3 Years' }, { value: '5', label: '5 Years' }, { value: 'indefinite', label: 'Indefinite' }] },
      { id: 'scope', type: 'textarea', label: 'Purpose / Scope of Disclosure', placeholder: 'Describe the purpose of sharing confidential information...', required: true, validation: { minLength: 10, maxLength: 1000 } },
      { id: 'effectiveDate', type: 'date', label: 'Effective Date', required: false },
      { id: 'additionalClauses', type: 'multiselect', label: 'Additional Clauses', required: false, options: [{ value: 'return_info', label: 'Return of Information' }, { value: 'no_solicitation', label: 'Non-Solicitation' }, { value: 'remedies', label: 'Specific Remedies' }, { value: 'arbitration', label: 'Arbitration Clause' }] },
    ],
    groups: [
      { id: 'parties', title: 'Parties', fieldIds: ['disclosingParty', 'receivingParty', 'ndaType'] },
      { id: 'terms', title: 'Agreement Terms', fieldIds: ['state', 'duration', 'effectiveDate'] },
      { id: 'details', title: 'Details', fieldIds: ['scope', 'additionalClauses'] },
    ],
  },
  promptConfig: {
    version: '1.2.0',
    steps: [
      {
        id: 'system',
        role: 'system',
        template: 'You are an expert US legal document specialist with deep knowledge of NDA law across all 50 states. Generate professional, legally sound, and comprehensive NDA agreements. Always include a legal disclaimer that this is not legal advice.',
      },
      {
        id: 'generate',
        role: 'user',
        template: `Generate a complete, professional Non-Disclosure Agreement with these specifications:

NDA Type: {{ndaType}}
Disclosing Party: {{disclosingParty}}
Receiving Party: {{receivingParty}}
Governing State: {{state}}
Duration: {{duration}} {{#if (eq duration "indefinite")}}(indefinite){{else}}year(s){{/if}}
Effective Date: {{#if effectiveDate}}{{effectiveDate}}{{else}}[DATE]{{/if}}
Purpose: {{scope}}
Additional Clauses: {{additionalClauses}}

Requirements:
- Use professional legal language appropriate for {{state}} law
- Include all standard NDA sections: Definitions, Obligations, Exclusions, Term, Return of Information, Remedies, Governing Law
- Include signature blocks for both parties
- Add a brief legal disclaimer at the end
- Format with proper headings and numbered sections

Generate the complete NDA document now.`,
      },
    ],
    outputFormat: 'text',
    maxTokens: 3000,
    temperature: 0.2,
  },
  exportConfig: {
    pdfTemplate: LEGAL_TEMPLATE,
    docxTemplate: LEGAL_TEMPLATE,
    fileNameTemplate: 'NDA-Agreement-{{disclosingParty}}',
    pageSize: 'letter',
    margins: { top: 72, right: 72, bottom: 72, left: 72 },
  },
  seoConfig: {
    titleTemplate: 'Free NDA Generator — AI-Powered Non-Disclosure Agreement | AIFreeTools',
    descriptionTemplate: 'Generate a professional NDA in seconds with AI. Free, customizable for any US state, legally structured. No lawyer needed. Download as PDF or Word.',
    primaryKeyword: 'free nda generator',
    keywords: ['nda generator', 'non disclosure agreement generator', 'free nda template', 'nda maker', 'create nda online', 'nda form', 'confidentiality agreement generator'],
    faqCount: 8,
    generateStatePages: true,
    articleTopics: ['what is an nda', 'nda laws by state', 'how to write an nda', 'nda mistakes to avoid', 'mutual vs one-way nda', 'nda enforcement', 'nda vs confidentiality agreement'],
    relatedTools: ['non-compete-agreement-generator', 'freelance-contract-generator', 'independent-contractor-agreement-generator', 'cease-desist-letter-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['legalzoom', 'rocket-lawyer', 'docusign'],
    adPlacements: ['header', 'post-result', 'sidebar', 'in-content'],
    upsellTrigger: 'export',
    leadGenCTA: 'Need a lawyer to review? Get a free consultation.',
  },
};

export const privacyPolicyGenerator: ToolConfig = {
  id: 'privacy-policy-generator',
  slug: 'privacy-policy-generator',
  name: 'Free Privacy Policy Generator',
  shortName: 'Privacy Policy Generator',
  category: 'legal-documents',
  description: 'Generate a comprehensive, GDPR and CCPA compliant privacy policy for your website or app in seconds using AI.',
  tagline: 'Generate a GDPR & CCPA compliant privacy policy for free.',
  icon: 'lock',
  sortOrder: 2,
  isFeatured: true,
  formSchema: {
    fields: [
      { id: 'businessName', type: 'text', label: 'Business/Website Name', placeholder: 'e.g. My Startup Inc', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'websiteUrl', type: 'text', label: 'Website URL', placeholder: 'https://yourwebsite.com', required: true },
      { id: 'businessType', type: 'select', label: 'Business Type', required: true, options: [{ value: 'saas', label: 'SaaS / Software' }, { value: 'ecommerce', label: 'E-commerce' }, { value: 'blog', label: 'Blog / Content Site' }, { value: 'mobile_app', label: 'Mobile App' }, { value: 'marketplace', label: 'Marketplace' }, { value: 'ai_product', label: 'AI Product' }, { value: 'other', label: 'Other' }] },
      { id: 'state', type: 'select', label: 'Business State', required: true, options: US_STATES },
      { id: 'email', type: 'email', label: 'Contact Email', placeholder: 'privacy@yourcompany.com', required: true },
      { id: 'dataTypes', type: 'multiselect', label: 'Data Collected', required: true, options: [{ value: 'name', label: 'Name' }, { value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'address', label: 'Address' }, { value: 'payment', label: 'Payment Info' }, { value: 'usage_data', label: 'Usage Data' }, { value: 'cookies', label: 'Cookies' }, { value: 'location', label: 'Location Data' }, { value: 'ai_inputs', label: 'AI-Generated Content/Inputs' }] },
      { id: 'thirdParties', type: 'multiselect', label: 'Third-Party Services', required: false, options: [{ value: 'google_analytics', label: 'Google Analytics' }, { value: 'stripe', label: 'Stripe' }, { value: 'paypal', label: 'PayPal' }, { value: 'mailchimp', label: 'Mailchimp' }, { value: 'hubspot', label: 'HubSpot' }, { value: 'facebook', label: 'Facebook Pixel' }, { value: 'aws', label: 'AWS' }, { value: 'openai', label: 'OpenAI' }] },
      { id: 'gdprApplicable', type: 'toggle', label: 'GDPR Applicable (EU users)?', defaultValue: false },
      { id: 'ccpaApplicable', type: 'toggle', label: 'CCPA Applicable (California users)?', defaultValue: true },
      { id: 'coppaApplicable', type: 'toggle', label: 'COPPA (children under 13)?', defaultValue: false },
    ],
    groups: [
      { id: 'business', title: 'Business Details', fieldIds: ['businessName', 'websiteUrl', 'businessType', 'state', 'email'] },
      { id: 'data', title: 'Data Collection', fieldIds: ['dataTypes', 'thirdParties'] },
      { id: 'compliance', title: 'Compliance Requirements', fieldIds: ['gdprApplicable', 'ccpaApplicable', 'coppaApplicable'] },
    ],
  },
  promptConfig: {
    version: '1.1.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are an expert privacy law specialist and compliance attorney. Generate comprehensive, legally sound privacy policies compliant with applicable US and international privacy laws.' },
      {
        id: 'generate',
        role: 'user',
        template: `Generate a comprehensive Privacy Policy for:

Business: {{businessName}}
Website: {{websiteUrl}}
Type: {{businessType}}
State: {{state}}
Contact: {{email}}
Data Collected: {{dataTypes}}
Third Parties: {{thirdParties}}
GDPR: {{gdprApplicable}}
CCPA: {{ccpaApplicable}}
COPPA: {{coppaApplicable}}

Include all required sections: Information Collection, Use, Sharing, Cookies, Security, Children's Privacy (if COPPA), User Rights (GDPR/CCPA if applicable), Contact Information, Updates to Policy.
Format professionally with clear headings.`,
      },
    ],
    outputFormat: 'text',
    maxTokens: 4000,
    temperature: 0.2,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Privacy-Policy-{{businessName}}', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Privacy Policy Generator — GDPR & CCPA Compliant | AIFreeTools',
    descriptionTemplate: 'Generate a free GDPR and CCPA compliant privacy policy for your website or app in seconds. Customized for your business type. Download as PDF or Word.',
    primaryKeyword: 'free privacy policy generator',
    keywords: ['privacy policy generator', 'free privacy policy', 'gdpr privacy policy generator', 'ccpa privacy policy', 'privacy policy maker', 'website privacy policy'],
    faqCount: 8,
    generateStatePages: false,
    articleTopics: ['what is a privacy policy', 'gdpr requirements', 'ccpa explained', 'privacy policy for saas', 'privacy policy vs terms of service'],
    relatedTools: ['terms-of-service-generator', 'refund-policy-generator', 'nda-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['termly', 'iubenda', 'cookieyes'],
    adPlacements: ['header', 'post-result', 'sidebar', 'in-content'],
    upsellTrigger: 'export',
  },
};

export const tosGenerator: ToolConfig = {
  id: 'terms-of-service-generator',
  slug: 'terms-of-service-generator',
  name: 'Free Terms of Service Generator',
  shortName: 'Terms of Service Generator',
  category: 'legal-documents',
  description: 'Generate comprehensive Terms of Service for your website, SaaS, or app using AI. Covers liability, user conduct, intellectual property, and more.',
  tagline: 'Generate legally structured Terms of Service for free.',
  icon: 'file-text',
  sortOrder: 3,
  isFeatured: true,
  formSchema: {
    fields: [
      { id: 'businessName', type: 'text', label: 'Business/Service Name', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'websiteUrl', type: 'text', label: 'Website URL', required: true },
      { id: 'serviceType', type: 'select', label: 'Service Type', required: true, options: [{ value: 'saas', label: 'SaaS' }, { value: 'ecommerce', label: 'E-commerce' }, { value: 'marketplace', label: 'Marketplace' }, { value: 'mobile_app', label: 'Mobile App' }, { value: 'blog', label: 'Blog/Content' }, { value: 'ai_product', label: 'AI Product/Service' }, { value: 'social_platform', label: 'Social Platform' }] },
      { id: 'state', type: 'select', label: 'Governing State', required: true, options: US_STATES },
      { id: 'email', type: 'email', label: 'Contact Email', required: true },
      { id: 'hasSubscription', type: 'toggle', label: 'Subscription/Paid Service?', defaultValue: false },
      { id: 'hasUGC', type: 'toggle', label: 'User-Generated Content?', defaultValue: false },
      { id: 'ageRequirement', type: 'select', label: 'Minimum Age Requirement', required: false, defaultValue: '18', options: [{ value: '13', label: '13+' }, { value: '16', label: '16+' }, { value: '18', label: '18+' }] },
    ],
    groups: [
      { id: 'basics', title: 'Service Details', fieldIds: ['businessName', 'websiteUrl', 'serviceType', 'state', 'email'] },
      { id: 'features', title: 'Features', fieldIds: ['hasSubscription', 'hasUGC', 'ageRequirement'] },
    ],
  },
  promptConfig: {
    version: '1.0.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are an expert technology and business law attorney. Generate comprehensive Terms of Service agreements that are legally sound, user-friendly, and appropriate for the business type.' },
      { id: 'generate', role: 'user', template: `Generate complete Terms of Service for:\n\nService: {{businessName}} ({{serviceType}})\nURL: {{websiteUrl}}\nState: {{state}}\nContact: {{email}}\nSubscription: {{hasSubscription}}\nUser Content: {{hasUGC}}\nAge: {{ageRequirement}}+\n\nInclude: Acceptance, Services, Account Terms, Payment (if applicable), Intellectual Property, User Content (if applicable), Prohibited Conduct, Disclaimers, Limitation of Liability, Governing Law, Termination, Contact. Format professionally.` },
    ],
    outputFormat: 'text',
    maxTokens: 4000,
    temperature: 0.2,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Terms-of-Service-{{businessName}}', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Terms of Service Generator — AI-Powered ToS | AIFreeTools',
    descriptionTemplate: 'Generate professional Terms of Service for your website, SaaS, or app instantly. AI-powered, legally structured, free PDF download.',
    primaryKeyword: 'free terms of service generator',
    keywords: ['terms of service generator', 'tos generator', 'terms and conditions generator', 'free terms of service', 'website terms generator'],
    faqCount: 7,
    generateStatePages: false,
    articleTopics: ['what is terms of service', 'tos vs privacy policy', 'saas terms of service requirements', 'terms of service for ecommerce'],
    relatedTools: ['privacy-policy-generator', 'refund-policy-generator', 'nda-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['termly', 'iubenda', 'legalzoom'],
    adPlacements: ['header', 'post-result', 'sidebar', 'in-content'],
    upsellTrigger: 'export',
  },
};

export const ceaseDesistGenerator: ToolConfig = {
  id: 'cease-desist-letter-generator',
  slug: 'cease-desist-letter-generator',
  name: 'Free Cease & Desist Letter Generator',
  shortName: 'Cease & Desist Generator',
  category: 'legal-documents',
  description: 'Generate a professional Cease & Desist letter for copyright infringement, trademark violations, harassment, or defamation using AI.',
  tagline: 'Generate a powerful Cease & Desist letter in minutes.',
  icon: 'alert-triangle',
  sortOrder: 4,
  isFeatured: false,
  formSchema: {
    fields: [
      { id: 'senderName', type: 'text', label: 'Your Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'recipientName', type: 'text', label: 'Recipient Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'claimType', type: 'select', label: 'Type of Claim', required: true, options: [{ value: 'copyright', label: 'Copyright Infringement' }, { value: 'trademark', label: 'Trademark Violation' }, { value: 'harassment', label: 'Harassment' }, { value: 'defamation', label: 'Defamation/Libel' }, { value: 'debt', label: 'Debt Collection' }, { value: 'contract_breach', label: 'Contract Breach' }, { value: 'other', label: 'Other' }] },
      { id: 'state', type: 'select', label: 'Governing State', required: true, options: US_STATES },
      { id: 'description', type: 'textarea', label: 'Describe the Violation', placeholder: 'Describe what the recipient is doing that you want them to stop...', required: true, validation: { minLength: 20, maxLength: 2000 } },
      { id: 'demands', type: 'textarea', label: 'Your Demands', placeholder: 'What specific actions do you want them to take or stop?', required: true, validation: { minLength: 10, maxLength: 1000 } },
      { id: 'deadline', type: 'select', label: 'Response Deadline', required: true, defaultValue: '14', options: [{ value: '7', label: '7 days' }, { value: '10', label: '10 days' }, { value: '14', label: '14 days' }, { value: '30', label: '30 days' }] },
      { id: 'legalAction', type: 'toggle', label: 'Threaten Legal Action?', defaultValue: true },
    ],
    groups: [
      { id: 'parties', title: 'Parties', fieldIds: ['senderName', 'recipientName', 'claimType', 'state'] },
      { id: 'details', title: 'Violation Details', fieldIds: ['description', 'demands', 'deadline', 'legalAction'] },
    ],
  },
  promptConfig: {
    version: '1.0.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are an experienced US litigation attorney. Generate firm, professional, and legally appropriate Cease and Desist letters. The tone should be authoritative but professional.' },
      { id: 'generate', role: 'user', template: `Generate a Cease & Desist letter:\n\nFrom: {{senderName}}\nTo: {{recipientName}}\nClaim: {{claimType}}\nState: {{state}}\nViolation: {{description}}\nDemands: {{demands}}\nDeadline: {{deadline}} days\nLegal action threat: {{legalAction}}\n\nFormat as a formal legal letter with date, addresses, formal salutation, clear statement of violation, specific demands, deadline, and consequences. Professional and firm tone.` },
    ],
    outputFormat: 'text',
    maxTokens: 2000,
    temperature: 0.3,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Cease-and-Desist-Letter', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Cease & Desist Letter Generator — AI Legal Letter | AIFreeTools',
    descriptionTemplate: 'Generate a professional Cease & Desist letter for copyright, trademark, harassment, or defamation. Free AI-powered, download as PDF.',
    primaryKeyword: 'cease and desist letter generator',
    keywords: ['cease and desist generator', 'free cease desist letter', 'c&d letter generator', 'copyright cease desist', 'trademark cease desist'],
    faqCount: 6,
    generateStatePages: true,
    articleTopics: ['what is cease and desist', 'cease desist vs lawsuit', 'how to write cease desist', 'copyright infringement letter'],
    relatedTools: ['demand-letter-generator', 'nda-generator', 'freelance-contract-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['legalzoom', 'rocket-lawyer', 'nolo'],
    adPlacements: ['header', 'post-result', 'sidebar'],
    upsellTrigger: 'export',
    leadGenCTA: 'Need an attorney to send this? Find one in your state.',
  },
};

export const leaseAgreementGenerator: ToolConfig = {
  id: 'lease-agreement-generator',
  slug: 'lease-agreement-generator',
  name: 'Free Lease Agreement Generator',
  shortName: 'Lease Agreement Generator',
  category: 'legal-documents',
  description: 'Generate a state-compliant residential or commercial lease agreement using AI. Covers rent, security deposit, maintenance, and state-specific clauses.',
  tagline: 'Generate a state-compliant lease agreement for free.',
  icon: 'home',
  sortOrder: 5,
  isFeatured: true,
  formSchema: {
    fields: [
      { id: 'leaseType', type: 'radio', label: 'Lease Type', required: true, defaultValue: 'residential', options: [{ value: 'residential', label: 'Residential' }, { value: 'commercial', label: 'Commercial' }] },
      { id: 'landlordName', type: 'text', label: 'Landlord Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'tenantName', type: 'text', label: 'Tenant Name(s)', required: true, validation: { minLength: 2, maxLength: 300 } },
      { id: 'propertyAddress', type: 'textarea', label: 'Property Address', required: true, validation: { minLength: 10, maxLength: 500 } },
      { id: 'state', type: 'select', label: 'Property State', required: true, options: US_STATES },
      { id: 'monthlyRent', type: 'currency', label: 'Monthly Rent ($)', required: true, validation: { min: 1, max: 100000 } },
      { id: 'securityDeposit', type: 'currency', label: 'Security Deposit ($)', required: true, validation: { min: 0, max: 100000 } },
      { id: 'leaseTerm', type: 'select', label: 'Lease Term', required: true, defaultValue: '12', options: [{ value: 'month-to-month', label: 'Month-to-Month' }, { value: '6', label: '6 Months' }, { value: '12', label: '12 Months' }, { value: '24', label: '24 Months' }] },
      { id: 'startDate', type: 'date', label: 'Lease Start Date', required: false },
      { id: 'petPolicy', type: 'radio', label: 'Pet Policy', defaultValue: 'no_pets', options: [{ value: 'no_pets', label: 'No Pets' }, { value: 'pets_allowed', label: 'Pets Allowed' }, { value: 'case_by_case', label: 'Case-by-Case' }] },
      { id: 'utilitiesIncluded', type: 'multiselect', label: 'Utilities Included', required: false, options: [{ value: 'water', label: 'Water' }, { value: 'electric', label: 'Electric' }, { value: 'gas', label: 'Gas' }, { value: 'trash', label: 'Trash' }, { value: 'internet', label: 'Internet' }] },
      { id: 'lateFee', type: 'currency', label: 'Late Fee Amount ($)', required: false, validation: { min: 0, max: 500 } },
    ],
    groups: [
      { id: 'type', title: 'Lease Type', fieldIds: ['leaseType'] },
      { id: 'parties', title: 'Parties', fieldIds: ['landlordName', 'tenantName'] },
      { id: 'property', title: 'Property', fieldIds: ['propertyAddress', 'state'] },
      { id: 'terms', title: 'Lease Terms', fieldIds: ['monthlyRent', 'securityDeposit', 'leaseTerm', 'startDate'] },
      { id: 'policies', title: 'Policies', fieldIds: ['petPolicy', 'utilitiesIncluded', 'lateFee'] },
    ],
  },
  promptConfig: {
    version: '1.1.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are a real estate law expert specializing in US landlord-tenant law. Generate comprehensive, state-compliant lease agreements that protect both parties.' },
      { id: 'generate', role: 'user', template: `Generate a complete {{leaseType}} Lease Agreement:\n\nLandlord: {{landlordName}}\nTenant: {{tenantName}}\nProperty: {{propertyAddress}}\nState: {{state}}\nRent: ${{monthlyRent}}/month\nDeposit: ${{securityDeposit}}\nTerm: {{leaseTerm}}\nStart: {{startDate}}\nPets: {{petPolicy}}\nUtilities included: {{utilitiesIncluded}}\nLate fee: ${{lateFee}}\n\nInclude all required {{state}} state-specific clauses, disclosures (lead paint if pre-1978, etc.), entry notice requirements, and standard lease provisions. Format with numbered sections.` },
    ],
    outputFormat: 'text',
    maxTokens: 5000,
    temperature: 0.2,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Lease-Agreement-{{state}}', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Lease Agreement Generator — State-Compliant AI Lease | AIFreeTools',
    descriptionTemplate: 'Generate a state-compliant residential or commercial lease agreement in minutes. Free, AI-powered, covers all 50 US states. Download PDF or Word.',
    primaryKeyword: 'free lease agreement generator',
    keywords: ['lease agreement generator', 'free lease agreement', 'rental agreement generator', 'lease template', 'landlord tenant agreement'],
    faqCount: 8,
    generateStatePages: true,
    articleTopics: ['lease agreement requirements by state', 'what to include in lease agreement', 'security deposit laws by state', 'landlord tenant rights'],
    relatedTools: ['eviction-notice-generator', 'rental-application-generator', 'property-management-agreement-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['stessa', 'buildium', 'rentec-direct', 'landlord-studio'],
    adPlacements: ['header', 'post-result', 'sidebar', 'in-content'],
    upsellTrigger: 'export',
  },
};

export const llcOperatingAgreement: ToolConfig = {
  id: 'llc-operating-agreement-generator',
  slug: 'llc-operating-agreement-generator',
  name: 'Free LLC Operating Agreement Generator',
  shortName: 'LLC Operating Agreement',
  category: 'legal-documents',
  description: 'Generate a comprehensive LLC Operating Agreement for single-member or multi-member LLCs. Covers management, voting, profit sharing, and dissolution.',
  tagline: 'Create your LLC Operating Agreement in minutes — free.',
  icon: 'building',
  sortOrder: 6,
  isFeatured: false,
  formSchema: {
    fields: [
      { id: 'llcName', type: 'text', label: 'LLC Name', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'state', type: 'select', label: 'State of Formation', required: true, options: US_STATES },
      { id: 'memberType', type: 'radio', label: 'Member Structure', required: true, defaultValue: 'single', options: [{ value: 'single', label: 'Single-Member' }, { value: 'multi', label: 'Multi-Member' }] },
      { id: 'memberCount', type: 'number', label: 'Number of Members', required: false, validation: { min: 2, max: 50 }, showWhen: { field: 'memberType', operator: 'equals', value: 'multi' } },
      { id: 'managementType', type: 'radio', label: 'Management Type', required: true, defaultValue: 'member_managed', options: [{ value: 'member_managed', label: 'Member-Managed' }, { value: 'manager_managed', label: 'Manager-Managed' }] },
      { id: 'businessPurpose', type: 'textarea', label: 'Business Purpose', required: true, validation: { minLength: 10, maxLength: 500 } },
      { id: 'distributionFrequency', type: 'select', label: 'Profit Distribution', required: true, defaultValue: 'annual', options: [{ value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annual', label: 'Annual' }, { value: 'discretionary', label: 'At Manager Discretion' }] },
      { id: 'capitalContributions', type: 'textarea', label: 'Initial Capital Contributions', required: false, placeholder: 'Describe member contributions...', validation: { maxLength: 1000 } },
    ],
    groups: [
      { id: 'basics', title: 'LLC Information', fieldIds: ['llcName', 'state', 'businessPurpose'] },
      { id: 'structure', title: 'Structure', fieldIds: ['memberType', 'memberCount', 'managementType'] },
      { id: 'financial', title: 'Financial', fieldIds: ['distributionFrequency', 'capitalContributions'] },
    ],
  },
  promptConfig: {
    version: '1.0.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are a business law attorney specializing in LLC formation and governance. Generate comprehensive, state-compliant LLC Operating Agreements.' },
      { id: 'generate', role: 'user', template: `Generate a complete LLC Operating Agreement:\n\nLLC: {{llcName}}\nState: {{state}}\nStructure: {{memberType}} LLC\nMembers: {{memberCount}}\nManagement: {{managementType}}\nPurpose: {{businessPurpose}}\nDistributions: {{distributionFrequency}}\nCapital: {{capitalContributions}}\n\nInclude: Formation, Purpose, Members, Capital, Management, Voting, Distributions, Transfer Restrictions, Dissolution, {{state}}-specific requirements. Format with numbered articles and sections.` },
    ],
    outputFormat: 'text',
    maxTokens: 5000,
    temperature: 0.2,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'LLC-Operating-Agreement-{{llcName}}', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free LLC Operating Agreement Generator — AI-Powered | AIFreeTools',
    descriptionTemplate: 'Generate a complete LLC Operating Agreement for single or multi-member LLCs. State-compliant, AI-powered, free download as PDF or Word.',
    primaryKeyword: 'free llc operating agreement generator',
    keywords: ['llc operating agreement generator', 'free llc agreement', 'operating agreement template', 'llc formation documents', 'single member llc agreement'],
    faqCount: 7,
    generateStatePages: true,
    articleTopics: ['what is an llc operating agreement', 'llc vs corporation', 'do i need an llc operating agreement', 'llc formation by state'],
    relatedTools: ['independent-contractor-agreement-generator', 'partnership-agreement-generator', 'nda-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['incfile', 'northwest-registered-agent', 'legalzoom', 'zenbusiness'],
    adPlacements: ['header', 'post-result', 'sidebar'],
    upsellTrigger: 'export',
    leadGenCTA: 'Need to form your LLC? Compare top formation services.',
  },
};

export const independentContractorAgreement: ToolConfig = {
  id: 'independent-contractor-agreement-generator',
  slug: 'independent-contractor-agreement-generator',
  name: 'Free Independent Contractor Agreement Generator',
  shortName: 'Contractor Agreement Generator',
  category: 'legal-documents',
  description: 'Generate a comprehensive Independent Contractor Agreement protecting IP ownership, payment terms, confidentiality, and contractor status.',
  tagline: 'Protect your freelance work with a professional contractor agreement.',
  icon: 'briefcase',
  sortOrder: 7,
  isFeatured: false,
  formSchema: {
    fields: [
      { id: 'clientName', type: 'text', label: 'Client Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'contractorName', type: 'text', label: 'Contractor Name', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'state', type: 'select', label: 'Governing State', required: true, options: US_STATES },
      { id: 'serviceDescription', type: 'textarea', label: 'Services to be Performed', required: true, validation: { minLength: 10, maxLength: 1000 } },
      { id: 'paymentType', type: 'select', label: 'Payment Structure', required: true, options: [{ value: 'hourly', label: 'Hourly Rate' }, { value: 'fixed', label: 'Fixed Project Fee' }, { value: 'milestone', label: 'Milestone-Based' }, { value: 'retainer', label: 'Monthly Retainer' }] },
      { id: 'paymentAmount', type: 'currency', label: 'Payment Amount ($)', required: true },
      { id: 'projectDuration', type: 'select', label: 'Project Duration', required: true, options: [{ value: 'one_time', label: 'One-Time Project' }, { value: '1_month', label: '1 Month' }, { value: '3_months', label: '3 Months' }, { value: '6_months', label: '6 Months' }, { value: 'ongoing', label: 'Ongoing' }] },
      { id: 'ipOwnership', type: 'radio', label: 'IP Ownership', required: true, defaultValue: 'client', options: [{ value: 'client', label: 'Client Owns All Work' }, { value: 'contractor', label: 'Contractor Retains IP' }, { value: 'shared', label: 'Shared Ownership' }] },
      { id: 'confidentiality', type: 'toggle', label: 'Include Confidentiality Clause?', defaultValue: true },
      { id: 'nonSolicitation', type: 'toggle', label: 'Include Non-Solicitation Clause?', defaultValue: false },
    ],
    groups: [
      { id: 'parties', title: 'Parties', fieldIds: ['clientName', 'contractorName', 'state'] },
      { id: 'work', title: 'Work & Payment', fieldIds: ['serviceDescription', 'paymentType', 'paymentAmount', 'projectDuration'] },
      { id: 'legal', title: 'Legal Terms', fieldIds: ['ipOwnership', 'confidentiality', 'nonSolicitation'] },
    ],
  },
  promptConfig: {
    version: '1.0.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are an employment and contract law attorney. Generate comprehensive Independent Contractor Agreements that clearly establish contractor status and protect all parties.' },
      { id: 'generate', role: 'user', template: `Generate an Independent Contractor Agreement:\n\nClient: {{clientName}}\nContractor: {{contractorName}}\nState: {{state}}\nServices: {{serviceDescription}}\nPayment: {{paymentType}} — ${{paymentAmount}}\nDuration: {{projectDuration}}\nIP: {{ipOwnership}}\nConfidentiality: {{confidentiality}}\nNon-solicitation: {{nonSolicitation}}\n\nInclude: Independent contractor status (IRS test compliance), services, payment, IP ownership, confidentiality, termination, governing law, entire agreement clause. Emphasize independent contractor (not employee) status.` },
    ],
    outputFormat: 'text',
    maxTokens: 3500,
    temperature: 0.2,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Contractor-Agreement', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Independent Contractor Agreement Generator — AI Legal | AIFreeTools',
    descriptionTemplate: 'Generate a professional independent contractor agreement covering IP, payment, and confidentiality. Free AI-powered, ready to sign. PDF download.',
    primaryKeyword: 'independent contractor agreement generator',
    keywords: ['contractor agreement generator', 'free contractor contract', 'freelance agreement template', 'independent contractor form', '1099 contractor agreement'],
    faqCount: 7,
    generateStatePages: true,
    articleTopics: ['independent contractor vs employee', '1099 contractor requirements', 'contractor agreement essentials', 'ip ownership in freelance work'],
    relatedTools: ['freelance-contract-generator', 'nda-generator', 'non-compete-agreement-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['gusto', 'deel', 'remote', 'bonsai'],
    adPlacements: ['header', 'post-result', 'sidebar'],
    upsellTrigger: 'export',
  },
};

export const nonCompeteGenerator: ToolConfig = {
  id: 'non-compete-agreement-generator',
  slug: 'non-compete-agreement-generator',
  name: 'Free Non-Compete Agreement Generator',
  shortName: 'Non-Compete Generator',
  category: 'legal-documents',
  description: 'Generate a state-compliant Non-Compete Agreement with customizable geographic scope, duration, and industry restrictions.',
  tagline: 'Generate a legally compliant non-compete agreement for free.',
  icon: 'x-circle',
  sortOrder: 8,
  isFeatured: false,
  formSchema: {
    fields: [
      { id: 'employerName', type: 'text', label: 'Employer/Company Name', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'employeeName', type: 'text', label: 'Employee/Contractor Name', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'state', type: 'select', label: 'Governing State', required: true, options: US_STATES },
      { id: 'restrictionDuration', type: 'select', label: 'Restriction Period', required: true, defaultValue: '1', options: [{ value: '0.5', label: '6 Months' }, { value: '1', label: '1 Year' }, { value: '2', label: '2 Years' }] },
      { id: 'geographicScope', type: 'select', label: 'Geographic Scope', required: true, options: [{ value: 'city', label: 'City/Local' }, { value: 'state', label: 'State-wide' }, { value: 'regional', label: 'Regional (Multi-state)' }, { value: 'national', label: 'National (US)' }] },
      { id: 'industryScope', type: 'textarea', label: 'Industry/Business Restrictions', required: true, validation: { minLength: 10, maxLength: 500 }, placeholder: 'Describe the industry or specific competitors covered...' },
      { id: 'consideration', type: 'text', label: 'Consideration Provided', required: true, placeholder: 'e.g. Employment, $5,000 payment, stock options' },
    ],
    groups: [
      { id: 'parties', title: 'Parties', fieldIds: ['employerName', 'employeeName', 'state'] },
      { id: 'scope', title: 'Restriction Scope', fieldIds: ['restrictionDuration', 'geographicScope', 'industryScope'] },
      { id: 'legal', title: 'Legal', fieldIds: ['consideration'] },
    ],
  },
  promptConfig: {
    version: '1.0.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are an employment law attorney specializing in restrictive covenants. Generate non-compete agreements that comply with state-specific enforceability standards. Note: California, North Dakota, and Oklahoma have severe restrictions on non-competes — adjust accordingly.' },
      { id: 'generate', role: 'user', template: `Generate a Non-Compete Agreement:\n\nEmployer: {{employerName}}\nEmployee: {{employeeName}}\nState: {{state}}\nDuration: {{restrictionDuration}} year(s)\nGeographic: {{geographicScope}}\nIndustry: {{industryScope}}\nConsideration: {{consideration}}\n\nIMPORTANT: Comply with {{state}} non-compete enforceability requirements. If {{state}} heavily restricts non-competes (e.g., California), note this clearly and generate a less restrictive confidentiality/non-solicitation agreement instead.` },
    ],
    outputFormat: 'text',
    maxTokens: 2500,
    temperature: 0.2,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Non-Compete-Agreement', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Non-Compete Agreement Generator — State-Compliant | AIFreeTools',
    descriptionTemplate: 'Generate a state-compliant non-compete agreement with customizable scope and duration. Free AI-powered, all 50 states supported. PDF download.',
    primaryKeyword: 'non-compete agreement generator',
    keywords: ['non-compete agreement generator', 'free non-compete', 'non-compete clause generator', 'non-compete template', 'non-compete contract'],
    faqCount: 7,
    generateStatePages: true,
    articleTopics: ['non-compete laws by state', 'are non-competes enforceable', 'non-compete vs non-solicitation', 'california non-compete ban'],
    relatedTools: ['nda-generator', 'independent-contractor-agreement-generator', 'termination-letter-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['legalzoom', 'rocket-lawyer'],
    adPlacements: ['header', 'post-result', 'sidebar'],
    upsellTrigger: 'export',
  },
};

export const demandLetterGenerator: ToolConfig = {
  id: 'demand-letter-generator',
  slug: 'demand-letter-generator',
  name: 'Free Demand Letter Generator',
  shortName: 'Demand Letter Generator',
  category: 'legal-documents',
  description: 'Generate a professional Demand Letter for debt collection, refunds, contract disputes, or property damage claims using AI.',
  tagline: 'Generate a professional demand letter to recover what you\'re owed.',
  icon: 'dollar-sign',
  sortOrder: 9,
  isFeatured: false,
  formSchema: {
    fields: [
      { id: 'senderName', type: 'text', label: 'Your Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'recipientName', type: 'text', label: 'Recipient Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'claimType', type: 'select', label: 'Claim Type', required: true, options: [{ value: 'debt', label: 'Unpaid Debt' }, { value: 'refund', label: 'Refund Request' }, { value: 'property_damage', label: 'Property Damage' }, { value: 'contract_breach', label: 'Contract Breach' }, { value: 'security_deposit', label: 'Security Deposit Return' }, { value: 'wages', label: 'Unpaid Wages' }] },
      { id: 'state', type: 'select', label: 'Your State', required: true, options: US_STATES },
      { id: 'amountOwed', type: 'currency', label: 'Amount Owed ($)', required: true, validation: { min: 1 } },
      { id: 'description', type: 'textarea', label: 'Description of Claim', required: true, validation: { minLength: 20, maxLength: 2000 } },
      { id: 'deadline', type: 'select', label: 'Payment Deadline', required: true, defaultValue: '14', options: [{ value: '7', label: '7 days' }, { value: '14', label: '14 days' }, { value: '30', label: '30 days' }] },
    ],
    groups: [
      { id: 'parties', title: 'Parties', fieldIds: ['senderName', 'recipientName', 'state'] },
      { id: 'claim', title: 'Claim Details', fieldIds: ['claimType', 'amountOwed', 'description', 'deadline'] },
    ],
  },
  promptConfig: {
    version: '1.0.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are a litigation attorney. Generate firm, professional demand letters that clearly state the legal basis for the claim and consequences of non-payment.' },
      { id: 'generate', role: 'user', template: `Generate a Demand Letter:\n\nFrom: {{senderName}}\nTo: {{recipientName}}\nState: {{state}}\nClaim: {{claimType}}\nAmount: ${{amountOwed}}\nDetails: {{description}}\nDeadline: {{deadline}} days\n\nFirm but professional tone. Include: clear statement of what is owed and why, specific payment deadline, next steps if not paid (small claims court, legal action). Keep under 1 page.` },
    ],
    outputFormat: 'text',
    maxTokens: 1500,
    temperature: 0.3,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Demand-Letter', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Demand Letter Generator — Get Paid What You\'re Owed | AIFreeTools',
    descriptionTemplate: 'Generate a professional demand letter for unpaid debts, refunds, or contract disputes. AI-powered, free PDF download, all states.',
    primaryKeyword: 'free demand letter generator',
    keywords: ['demand letter generator', 'free demand letter', 'debt collection letter', 'payment demand letter', 'legal demand letter template'],
    faqCount: 6,
    generateStatePages: true,
    articleTopics: ['how demand letters work', 'demand letter before small claims court', 'when to use a demand letter', 'debt collection demand letter'],
    relatedTools: ['cease-desist-letter-generator', 'financial-hardship-letter-generator', 'invoice-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['donotpay', 'rocket-lawyer', 'legalzoom'],
    adPlacements: ['header', 'post-result', 'sidebar'],
    upsellTrigger: 'export',
  },
};

export const freelanceContractGenerator: ToolConfig = {
  id: 'freelance-contract-generator',
  slug: 'freelance-contract-generator',
  name: 'Free Freelance Contract Generator',
  shortName: 'Freelance Contract Generator',
  category: 'legal-documents',
  description: 'Generate a professional freelance contract with milestone clauses, revision policies, payment protection, and IP ownership terms.',
  tagline: 'Protect your freelance work with a professional contract.',
  icon: 'edit',
  sortOrder: 10,
  isFeatured: true,
  formSchema: {
    fields: [
      { id: 'freelancerName', type: 'text', label: 'Freelancer Name', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'clientName', type: 'text', label: 'Client Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'state', type: 'select', label: 'Governing State', required: true, options: US_STATES },
      { id: 'projectTitle', type: 'text', label: 'Project Title', required: true, validation: { minLength: 2, maxLength: 200 } },
      { id: 'projectDescription', type: 'textarea', label: 'Project Description & Deliverables', required: true, validation: { minLength: 20, maxLength: 2000 } },
      { id: 'projectFee', type: 'currency', label: 'Total Project Fee ($)', required: true, validation: { min: 1 } },
      { id: 'paymentSchedule', type: 'select', label: 'Payment Schedule', required: true, options: [{ value: 'upfront', label: '100% Upfront' }, { value: 'split_50', label: '50% Upfront / 50% Completion' }, { value: 'milestones', label: 'Milestone-Based' }, { value: 'on_delivery', label: '100% on Delivery' }, { value: 'net30', label: 'Net 30 Days' }] },
      { id: 'revisions', type: 'select', label: 'Number of Revisions Included', required: true, defaultValue: '2', options: [{ value: '0', label: 'No Revisions' }, { value: '1', label: '1 Revision' }, { value: '2', label: '2 Revisions' }, { value: '3', label: '3 Revisions' }, { value: 'unlimited', label: 'Unlimited Revisions' }] },
      { id: 'deadline', type: 'date', label: 'Project Deadline', required: false },
      { id: 'ipOwnership', type: 'radio', label: 'IP Ownership (after full payment)', required: true, defaultValue: 'client', options: [{ value: 'client', label: 'Client Owns Work' }, { value: 'freelancer', label: 'Freelancer Retains IP' }, { value: 'license', label: 'License to Client' }] },
      { id: 'latePaymentFee', type: 'percentage', label: 'Late Payment Fee (%/month)', required: false, defaultValue: '1.5', validation: { min: 0, max: 5 } },
    ],
    groups: [
      { id: 'parties', title: 'Parties', fieldIds: ['freelancerName', 'clientName', 'state'] },
      { id: 'project', title: 'Project', fieldIds: ['projectTitle', 'projectDescription', 'deadline'] },
      { id: 'payment', title: 'Payment', fieldIds: ['projectFee', 'paymentSchedule', 'latePaymentFee'] },
      { id: 'terms', title: 'Terms', fieldIds: ['revisions', 'ipOwnership'] },
    ],
  },
  promptConfig: {
    version: '1.1.0',
    steps: [
      { id: 'system', role: 'system', template: 'You are a freelance business attorney. Generate comprehensive freelance contracts that protect both parties and clearly define deliverables, payment, and IP ownership.' },
      { id: 'generate', role: 'user', template: `Generate a Freelance Contract:\n\nFreelancer: {{freelancerName}}\nClient: {{clientName}}\nState: {{state}}\nProject: {{projectTitle}}\nDeliverables: {{projectDescription}}\nFee: ${{projectFee}}\nPayment: {{paymentSchedule}}\nRevisions: {{revisions}}\nDeadline: {{deadline}}\nIP: {{ipOwnership}}\nLate fee: {{latePaymentFee}}%/month\n\nInclude: project scope, deliverables, payment terms, revisions policy, IP ownership, confidentiality, termination, dispute resolution, entire agreement. Protect the freelancer's right to payment.` },
    ],
    outputFormat: 'text',
    maxTokens: 3500,
    temperature: 0.2,
  },
  exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Freelance-Contract-{{projectTitle}}', pageSize: 'letter' },
  seoConfig: {
    titleTemplate: 'Free Freelance Contract Generator — Protect Your Work | AIFreeTools',
    descriptionTemplate: 'Generate a professional freelance contract with payment protection, revision limits, and IP terms. Free AI-powered, all states. PDF & Word download.',
    primaryKeyword: 'free freelance contract generator',
    keywords: ['freelance contract generator', 'free freelance contract', 'freelance agreement template', 'client contract for freelancers', 'freelance contract template'],
    faqCount: 8,
    generateStatePages: true,
    articleTopics: ['how to write a freelance contract', 'freelance contract essentials', 'protecting yourself as a freelancer', 'getting paid as a freelancer'],
    relatedTools: ['independent-contractor-agreement-generator', 'invoice-generator', 'nda-generator'],
    searchIntent: 'transactional',
  },
  monetizationConfig: {
    affiliatePartners: ['bonsai', 'honeybook', 'and.co', 'freshbooks'],
    adPlacements: ['header', 'post-result', 'sidebar', 'in-content'],
    upsellTrigger: 'export',
    leadGenCTA: 'Manage all your freelance contracts in one place. Try Bonsai.',
  },
};

export const CATEGORY_1_TOOLS: ToolConfig[] = [
  ndaGenerator,
  privacyPolicyGenerator,
  tosGenerator,
  ceaseDesistGenerator,
  leaseAgreementGenerator,
  llcOperatingAgreement,
  independentContractorAgreement,
  nonCompeteGenerator,
  demandLetterGenerator,
  freelanceContractGenerator,
];
