export const LEGAL_PROMPTS = {
  'nda-generator': {
    user: `Draft a comprehensive Non-Disclosure Agreement (NDA) for the state of {{stateName}}{{#if state}} ({{state}}){{/if}}.

**Party Details:**
- Disclosing Party: {{disclosingParty}}
- Receiving Party: {{receivingParty}}
- NDA Type: {{ndaType}} ({{#ifEquals ndaType "mutual"}}both parties share confidential information{{else}}one-way disclosure{{/ifEquals}})
- Duration: {{duration}}

**Scope of Confidential Information:**
{{confidentialInfo}}

**Purpose of Disclosure:**
{{purpose}}

Generate a complete, enforceable NDA with all standard provisions including: definitions, obligations, exclusions, term and termination, remedies, governing law ({{stateName}} law), dispute resolution, and signature blocks.`,
  },

  'privacy-policy-generator': {
    user: `Draft a comprehensive Privacy Policy for the following website/app based in {{stateName}}{{#if state}} ({{state}}){{/if}}.

**Business Information:**
- Business Name: {{businessName}}
- Website/App: {{websiteUrl}}
- Business Type: {{businessType}}

**Data Collection:**
- Types of data collected: {{dataTypes}}
- Uses cookies/tracking: {{usesCookies}}
- Third-party services: {{thirdParties}}

**User Rights:**
- Accepts users from California (CCPA required): {{californiaUsers}}
- Accepts EU users (GDPR considerations): {{euUsers}}

Generate a complete Privacy Policy compliant with applicable US laws (CCPA, COPPA if applicable), with sections for: data collection, use, sharing, retention, user rights, contact information, and effective date.`,
  },

  'tos-generator': {
    user: `Draft comprehensive Terms of Service for the following business in {{stateName}}{{#if state}} ({{state}}){{/if}}.

**Business Information:**
- Business Name: {{businessName}}
- Service Type: {{serviceType}}
- Website/App: {{websiteUrl}}

**Key Terms:**
- Payment terms: {{paymentTerms}}
- Subscription/refund policy: {{refundPolicy}}
- User-generated content: {{hasUGC}}
- Age restrictions: {{ageRestriction}}

Generate complete Terms of Service with sections for: acceptance, service description, user accounts, payment, intellectual property, prohibited uses, disclaimers, limitation of liability, dispute resolution, governing law ({{stateName}}), and contact.`,
  },

  'cease-desist-generator': {
    user: `Draft a professional Cease and Desist letter based in {{stateName}}{{#if state}} ({{state}}){{/if}}.

**Sender Information:**
- Sender Name/Business: {{senderName}}
- Address: {{senderAddress}}

**Recipient Information:**
- Recipient Name/Business: {{recipientName}}
- Address: {{recipientAddress}}

**Violation Details:**
- Type of violation: {{violationType}}
- Description: {{violationDescription}}
- Date(s) of violation: {{violationDate}}

**Demands:**
- Specific demands: {{demands}}
- Response deadline: {{deadline}} days

Generate a firm, professional cease and desist letter with legal citations where applicable, clear demands, and consequences of non-compliance.`,
  },

  'lease-agreement-generator': {
    user: `Draft a comprehensive Residential Lease Agreement compliant with {{stateName}}{{#if state}} ({{state}}){{/if}} landlord-tenant law.

**Property Details:**
- Property Address: {{propertyAddress}}
- Property Type: {{propertyType}}
- Monthly Rent: \$\{\{monthlyRent}}
- Security Deposit: \$\{\{securityDeposit}}

**Lease Terms:**
- Lease Start: {{leaseStart}}
- Lease End: {{leaseEnd}}
- Lease Type: {{leaseType}}

**Parties:**
- Landlord: {{landlordName}}
- Tenant(s): {{tenantNames}}

**Utilities & Rules:**
- Utilities included: {{utilitiesIncluded}}
- Pets allowed: {{petsAllowed}}
- Smoking policy: {{smokingPolicy}}

Generate a complete lease agreement with all state-required disclosures for {{stateName}}, covering: parties, property, term, rent, security deposit, maintenance, rules, entry rights, termination, and signatures.`,
  },
} as const;
