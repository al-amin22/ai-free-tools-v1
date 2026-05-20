import type { ToolConfig } from '@aifreetools/shared-types';
import { US_STATES, LEGAL_TEMPLATE, HR_TEMPLATE, FINANCE_TEMPLATE } from '../constants';

export const CATEGORY_7_TOOLS: ToolConfig[] = [
  {
    id: 'promissory-note-generator', slug: 'promissory-note-generator', name: 'Free Promissory Note Generator', shortName: 'Promissory Note Generator',
    category: 'high-intent-legal', description: 'Generate a legally binding promissory note for personal loans, business loans, or IOU agreements.', tagline: 'Create a legally binding promissory note in minutes.', icon: 'file-text', sortOrder: 59, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'lenderName', type: 'text', label: 'Lender Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'borrowerName', type: 'text', label: 'Borrower Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'state', type: 'select', label: 'Governing State', required: true, options: US_STATES },
        { id: 'loanAmount', type: 'currency', label: 'Loan Amount ($)', required: true, validation: { min: 1 } },
        { id: 'interestRate', type: 'percentage', label: 'Annual Interest Rate (%)', required: true, validation: { min: 0, max: 36 } },
        { id: 'repaymentType', type: 'select', label: 'Repayment Type', required: true, defaultValue: 'installment', options: [{ value: 'lump_sum', label: 'Lump Sum (Due Date)' }, { value: 'installment', label: 'Monthly Installments' }, { value: 'interest_only', label: 'Interest Only + Balloon' }] },
        { id: 'loanTerm', type: 'select', label: 'Loan Term', required: false, options: [{ value: '3', label: '3 Months' }, { value: '6', label: '6 Months' }, { value: '12', label: '12 Months' }, { value: '24', label: '24 Months' }, { value: '36', label: '36 Months' }, { value: '60', label: '60 Months' }] },
        { id: 'loanDate', type: 'date', label: 'Loan Date', required: false },
        { id: 'secured', type: 'toggle', label: 'Secured by Collateral?', defaultValue: false },
        { id: 'collateral', type: 'text', label: 'Collateral Description', required: false, validation: { maxLength: 300 }, showWhen: { field: 'secured', operator: 'equals', value: true } },
      ],
      groups: [
        { id: 'parties', title: 'Parties', fieldIds: ['lenderName', 'borrowerName', 'state'] },
        { id: 'loan', title: 'Loan Terms', fieldIds: ['loanAmount', 'interestRate', 'repaymentType', 'loanTerm', 'loanDate'] },
        { id: 'security', title: 'Security', fieldIds: ['secured', 'collateral'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a finance and contract law attorney. Generate legally binding promissory notes that comply with state usury laws and include all required provisions.' },
        { id: 'generate', role: 'user', template: `Generate a Promissory Note:\n\nLender: {{lenderName}}\nBorrower: {{borrowerName}}\nState: {{state}}\nAmount: ${{loanAmount}}\nRate: {{interestRate}}% APR\nRepayment: {{repaymentType}}\nTerm: {{loanTerm}} months\nDate: {{loanDate}}\nSecured: {{secured}}\nCollateral: {{collateral}}\n\nInclude: principal, interest rate (verify usury limit for {{state}}), repayment schedule, default provisions, acceleration clause, governing law, signatures. Legal disclaimer included.` },
      ],
      outputFormat: 'text', maxTokens: 2500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Promissory-Note', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Promissory Note Generator — Legal Loan Agreement | AIFreeTools', descriptionTemplate: 'Generate a legally binding promissory note for personal or business loans. All 50 states supported. Free AI-powered, PDF download.', primaryKeyword: 'promissory note generator', keywords: ['promissory note generator', 'free promissory note', 'loan agreement generator', 'iou generator', 'personal loan agreement'], faqCount: 7, generateStatePages: true, articleTopics: ['what is a promissory note', 'promissory note vs loan agreement', 'usury laws by state', 'how to collect on a promissory note'], relatedTools: ['demand-letter-generator', 'nda-generator', 'freelance-contract-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['legalzoom', 'rocket-lawyer'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'bill-of-sale-generator', slug: 'bill-of-sale-generator', name: 'Free Bill of Sale Generator', shortName: 'Bill of Sale Generator',
    category: 'high-intent-legal', description: 'Generate a legally valid Bill of Sale for vehicles, boats, personal property, or business assets.', tagline: 'Create a legal bill of sale for any property transfer.', icon: 'shopping-cart', sortOrder: 60, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'sellerName', type: 'text', label: 'Seller Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'buyerName', type: 'text', label: 'Buyer Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
        { id: 'propertyType', type: 'select', label: 'Property Type', required: true, options: [{ value: 'vehicle', label: 'Motor Vehicle' }, { value: 'boat', label: 'Boat/Watercraft' }, { value: 'firearm', label: 'Firearm' }, { value: 'equipment', label: 'Equipment/Machinery' }, { value: 'personal_property', label: 'Personal Property' }, { value: 'business_assets', label: 'Business Assets' }] },
        { id: 'propertyDescription', type: 'textarea', label: 'Property Description', required: true, validation: { minLength: 10, maxLength: 1000 } },
        { id: 'salePrice', type: 'currency', label: 'Sale Price ($)', required: true, validation: { min: 0 } },
        { id: 'saleDate', type: 'date', label: 'Sale Date', required: false },
        { id: 'asIs', type: 'toggle', label: '"As-Is" Sale (No Warranty)?', defaultValue: true },
        { id: 'vin', type: 'text', label: 'VIN/Serial Number (if applicable)', required: false, validation: { maxLength: 50 } },
      ],
      groups: [
        { id: 'parties', title: 'Parties', fieldIds: ['sellerName', 'buyerName', 'state'] },
        { id: 'property', title: 'Property', fieldIds: ['propertyType', 'propertyDescription', 'vin'] },
        { id: 'sale', title: 'Sale Terms', fieldIds: ['salePrice', 'saleDate', 'asIs'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a contract law specialist. Generate legally valid bills of sale with state-compliant provisions and all necessary disclosures.' },
        { id: 'generate', role: 'user', template: `Generate a Bill of Sale:\n\nSeller: {{sellerName}}\nBuyer: {{buyerName}}\nState: {{state}}\nProperty: {{propertyType}} — {{propertyDescription}}\nVIN/Serial: {{vin}}\nPrice: ${{salePrice}}\nDate: {{saleDate}}\nAs-Is: {{asIs}}\n\nInclude: complete property description, sale price, payment terms, as-is clause (if applicable), {{state}}-specific disclosures for {{propertyType}}, warranties (or disclaimer), signatures, notary block if required by {{state}}.` },
      ],
      outputFormat: 'text', maxTokens: 2000, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Bill-of-Sale', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Bill of Sale Generator — Vehicle & Property | AIFreeTools', descriptionTemplate: 'Generate a legally valid bill of sale for vehicles, boats, or personal property. State-compliant, free AI-powered, PDF download.', primaryKeyword: 'bill of sale generator', keywords: ['bill of sale generator', 'free bill of sale', 'vehicle bill of sale', 'car bill of sale generator', 'bill of sale template'], faqCount: 7, generateStatePages: true, articleTopics: ['what is a bill of sale', 'bill of sale requirements by state', 'vehicle bill of sale guide', 'do I need a bill of sale'], relatedTools: ['promissory-note-generator', 'demand-letter-generator', 'lease-agreement-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['carfax', 'autotrader', 'dmv-org'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'power-of-attorney-generator', slug: 'power-of-attorney-generator', name: 'Free Power of Attorney Generator', shortName: 'POA Generator',
    category: 'high-intent-legal', description: 'Generate a Power of Attorney for financial, healthcare, or general matters. Includes durable POA and healthcare proxy options.', tagline: 'Designate someone you trust with a legal Power of Attorney.', icon: 'shield', sortOrder: 61, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'principalName', type: 'text', label: 'Principal Name (Granting POA)', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'agentName', type: 'text', label: 'Agent Name (Receiving POA)', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
        { id: 'poaType', type: 'select', label: 'POA Type', required: true, options: [{ value: 'general', label: 'General POA' }, { value: 'durable', label: 'Durable POA (survives incapacity)' }, { value: 'limited', label: 'Limited/Special POA' }, { value: 'healthcare', label: 'Healthcare/Medical POA' }, { value: 'financial', label: 'Financial POA' }] },
        { id: 'powers', type: 'multiselect', label: 'Granted Powers', required: true, options: [{ value: 'banking', label: 'Banking & Financial' }, { value: 'real_estate', label: 'Real Estate Transactions' }, { value: 'legal', label: 'Legal Matters' }, { value: 'taxes', label: 'Tax Matters' }, { value: 'business', label: 'Business Operations' }, { value: 'medical', label: 'Medical Decisions' }, { value: 'all', label: 'All Powers (General)' }] },
        { id: 'effective', type: 'radio', label: 'When Effective', required: true, defaultValue: 'immediate', options: [{ value: 'immediate', label: 'Immediately' }, { value: 'incapacity', label: 'Upon Incapacity' }] },
        { id: 'expirationDate', type: 'date', label: 'Expiration Date (leave blank for indefinite)', required: false },
        { id: 'alternateAgent', type: 'text', label: 'Alternate Agent (optional)', required: false, validation: { maxLength: 200 } },
      ],
      groups: [
        { id: 'parties', title: 'Parties', fieldIds: ['principalName', 'agentName', 'alternateAgent', 'state'] },
        { id: 'poa', title: 'POA Details', fieldIds: ['poaType', 'powers', 'effective', 'expirationDate'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are an estate planning and elder law attorney. Generate legally compliant Powers of Attorney with state-specific formalities. Always include the legal disclaimer that POA documents should be reviewed by an attorney.' },
        { id: 'generate', role: 'user', template: `Generate a {{poaType}} Power of Attorney:\n\nPrincipal: {{principalName}}\nAgent: {{agentName}}\nAlternate: {{alternateAgent}}\nState: {{state}}\nType: {{poaType}}\nPowers: {{powers}}\nEffective: {{effective}}\nExpires: {{expirationDate}}\n\nInclude: proper {{state}} statutory language, granted powers enumerated clearly, durability clause if {{poaType}} is durable, revocation provisions, notary block (required in most states), witness signature lines. Note {{state}}-specific requirements. Add legal disclaimer.` },
      ],
      outputFormat: 'text', maxTokens: 3000, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Power-of-Attorney', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Power of Attorney Generator — All 50 States | AIFreeTools', descriptionTemplate: 'Generate a durable, healthcare, or general Power of Attorney. State-compliant, AI-powered. Free PDF download. All 50 states.', primaryKeyword: 'power of attorney generator', keywords: ['power of attorney generator', 'free power of attorney', 'durable power of attorney', 'poa generator', 'healthcare power of attorney'], faqCount: 8, generateStatePages: true, articleTopics: ['what is a power of attorney', 'durable vs regular poa', 'power of attorney requirements by state', 'when do you need a poa'], relatedTools: ['last-will-generator', 'promissory-note-generator', 'nda-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['legalzoom', 'trust-will', 'fabric'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export', leadGenCTA: 'Get your POA notarized and reviewed by a licensed attorney.' },
  },
  {
    id: 'last-will-generator', slug: 'last-will-generator', name: 'Free Last Will Generator', shortName: 'Last Will Generator',
    category: 'high-intent-legal', description: 'Generate a basic Last Will and Testament with asset distribution, beneficiary designations, executor appointment, and guardian provisions.', tagline: 'Create a Last Will and Testament to protect your loved ones.', icon: 'file-text', sortOrder: 62, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'testatorName', type: 'text', label: 'Your Full Legal Name (Testator)', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'state', type: 'select', label: 'State of Residence', required: true, options: US_STATES },
        { id: 'executorName', type: 'text', label: 'Executor Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'alternateExecutor', type: 'text', label: 'Alternate Executor', required: false, validation: { maxLength: 200 } },
        { id: 'beneficiaries', type: 'textarea', label: 'Beneficiaries & Distributions', required: true, validation: { minLength: 10, maxLength: 1000 }, placeholder: 'e.g. Spouse Jane Doe — 50%, Son John Doe — 25%, Daughter Mary Doe — 25%' },
        { id: 'hasMinorChildren', type: 'toggle', label: 'Do you have minor children?', defaultValue: false },
        { id: 'guardianName', type: 'text', label: 'Guardian for Minor Children', required: false, validation: { maxLength: 200 }, showWhen: { field: 'hasMinorChildren', operator: 'equals', value: true } },
        { id: 'specificBequests', type: 'textarea', label: 'Specific Bequests (optional)', required: false, validation: { maxLength: 1000 }, placeholder: 'e.g. My 1967 Ford Mustang to son John, Diamond ring to daughter Mary' },
        { id: 'charitableGifts', type: 'textarea', label: 'Charitable Gifts (optional)', required: false, validation: { maxLength: 500 } },
      ],
      groups: [
        { id: 'basics', title: 'Testator & Executor', fieldIds: ['testatorName', 'state', 'executorName', 'alternateExecutor'] },
        { id: 'beneficiaries_section', title: 'Beneficiaries', fieldIds: ['beneficiaries', 'specificBequests', 'charitableGifts'] },
        { id: 'children', title: 'Children', fieldIds: ['hasMinorChildren', 'guardianName'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are an estate planning attorney. Generate legally structured Last Will and Testament documents that comply with {{state}} requirements. Always include prominent disclaimer that this is a basic template and professional legal review is strongly recommended for complex estates.' },
        { id: 'generate', role: 'user', template: `Generate a Last Will and Testament:\n\nTestator: {{testatorName}}\nState: {{state}}\nExecutor: {{executorName}} / Alternate: {{alternateExecutor}}\nBeneficiaries: {{beneficiaries}}\nSpecific Bequests: {{specificBequests}}\nCharitable: {{charitableGifts}}\nMinor Children: {{hasMinorChildren}}\nGuardian: {{guardianName}}\n\nInclude: testamentary capacity declaration, revocation of prior wills, executor appointment, specific bequests, residuary estate distribution, guardian appointment (if children), self-proving affidavit block, witness and signature lines per {{state}} requirements. Add legal disclaimer prominently.` },
      ],
      outputFormat: 'text', maxTokens: 4000, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Last-Will-Testament', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Last Will Generator — Simple Will Template | AIFreeTools', descriptionTemplate: 'Generate a basic Last Will and Testament for asset distribution and guardian appointment. Free AI-powered, state-compliant. PDF download.', primaryKeyword: 'last will generator', keywords: ['last will generator', 'will generator', 'free will template', 'testament generator', 'simple will maker', 'online will generator'], faqCount: 8, generateStatePages: true, articleTopics: ['how to write a will', 'will vs trust', 'what happens if you die without a will', 'executor responsibilities'], relatedTools: ['power-of-attorney-generator', 'affidavit-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['trust-will', 'legalzoom', 'fabric', 'tomorrow'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export', leadGenCTA: 'Get a comprehensive estate plan reviewed by an attorney. Free consultation.' },
  },
  {
    id: 'affidavit-generator', slug: 'affidavit-generator', name: 'Free Affidavit Generator', shortName: 'Affidavit Generator',
    category: 'high-intent-legal', description: 'Generate a legally structured affidavit for general use, financial statements, residency, heirship, or identity verification.', tagline: 'Create a notarizable affidavit in minutes.', icon: 'file-check', sortOrder: 63, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'affiantName', type: 'text', label: 'Affiant Name (Person Making Statement)', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
        { id: 'county', type: 'text', label: 'County', required: true, validation: { minLength: 2, maxLength: 100 } },
        { id: 'affidavitType', type: 'select', label: 'Affidavit Type', required: true, options: [{ value: 'general', label: 'General Statement of Fact' }, { value: 'financial', label: 'Financial Affidavit' }, { value: 'residency', label: 'Affidavit of Residency' }, { value: 'heirship', label: 'Affidavit of Heirship' }, { value: 'identity', label: 'Affidavit of Identity' }, { value: 'support', label: 'Affidavit of Support' }] },
        { id: 'statementFacts', type: 'textarea', label: 'Facts to be Sworn (numbered list)', required: true, validation: { minLength: 20, maxLength: 2000 }, placeholder: '1. I am a resident of...\n2. On the date of...\n3. I personally witnessed...' },
        { id: 'purpose', type: 'text', label: 'Purpose of Affidavit', required: true, validation: { minLength: 5, maxLength: 300 } },
      ],
      groups: [
        { id: 'affiant', title: 'Affiant', fieldIds: ['affiantName', 'state', 'county'] },
        { id: 'content', title: 'Affidavit Content', fieldIds: ['affidavitType', 'statementFacts', 'purpose'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a legal document specialist. Generate properly formatted affidavits with all required legal language, notary blocks, and state-compliant structures.' },
        { id: 'generate', role: 'user', template: `Generate a {{affidavitType}} Affidavit:\n\nAffiant: {{affiantName}}\nState: {{state}}, County of {{county}}\nPurpose: {{purpose}}\nFacts:\n{{statementFacts}}\n\nFormat: Title, jurisdiction statement (State of {{state}}, County of {{county}}), affiant identification, sworn statement of facts (numbered), jurat clause, signature line, notary block with seal space. Legally proper language throughout.` },
      ],
      outputFormat: 'text', maxTokens: 2000, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Affidavit', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Affidavit Generator — Sworn Statement Template | AIFreeTools', descriptionTemplate: 'Generate a legally structured affidavit for general, financial, residency, or identity purposes. Free AI-powered, notary-ready. PDF download.', primaryKeyword: 'affidavit generator', keywords: ['affidavit generator', 'free affidavit template', 'sworn statement generator', 'affidavit form', 'affidavit of residency generator'], faqCount: 7, generateStatePages: true, articleTopics: ['what is an affidavit', 'how to write an affidavit', 'affidavit notarization requirements', 'types of affidavits'], relatedTools: ['power-of-attorney-generator', 'last-will-generator', 'nda-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['notarize', 'notarycam', 'legalzoom'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'ats-resume-checker', slug: 'ats-resume-checker', name: 'Free ATS Resume Checker', shortName: 'ATS Resume Checker',
    category: 'high-intent-legal', description: 'Check your resume against ATS (Applicant Tracking System) requirements and get AI-powered optimization recommendations.', tagline: 'Make sure your resume passes ATS screening before applying.', icon: 'check-circle', sortOrder: 64, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'resumeText', type: 'textarea', label: 'Paste Your Resume Text', required: true, validation: { minLength: 100, maxLength: 10000 }, placeholder: 'Paste your full resume text here...' },
        { id: 'jobTitle', type: 'text', label: 'Target Job Title', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'jobDescription', type: 'textarea', label: 'Target Job Description (optional but recommended)', required: false, validation: { maxLength: 5000 }, placeholder: 'Paste the job description to check keyword match...' },
        { id: 'industry', type: 'select', label: 'Industry', required: false, options: [{ value: 'technology', label: 'Technology' }, { value: 'finance', label: 'Finance' }, { value: 'healthcare', label: 'Healthcare' }, { value: 'marketing', label: 'Marketing' }, { value: 'sales', label: 'Sales' }, { value: 'hr', label: 'HR' }, { value: 'legal', label: 'Legal' }, { value: 'operations', label: 'Operations' }, { value: 'other', label: 'Other' }] },
      ],
      groups: [
        { id: 'resume', title: 'Your Resume', fieldIds: ['resumeText'] },
        { id: 'job', title: 'Target Job', fieldIds: ['jobTitle', 'jobDescription', 'industry'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a senior recruiter and ATS optimization expert with experience at Fortune 500 companies. Analyze resumes for ATS compatibility and provide specific, actionable improvements.' },
        { id: 'generate', role: 'user', template: `Analyze this resume for ATS compatibility:\n\nTarget: {{jobTitle}} in {{industry}}\n\nRESUME:\n{{resumeText}}\n\nJOB DESCRIPTION:\n{{jobDescription}}\n\nProvide:\n1. ATS Compatibility Score (0-100) with explanation\n2. Keyword Match Analysis (keywords found vs. missing from JD)\n3. Format Issues (tables, columns, headers, fonts that confuse ATS)\n4. Section Assessment (Professional Summary, Work Experience, Skills, Education)\n5. Missing Critical Keywords (with suggested additions)\n6. Quantification Score (are achievements measurable?)\n7. Top 5 Improvements (specific, actionable)\n8. Quick Wins (changes that take < 5 minutes)\n9. Rewritten Professional Summary (optimized version)\n10. Skills Section Recommendation\n\nBe specific with line-by-line examples where possible.` },
      ],
      outputFormat: 'text', maxTokens: 3000, temperature: 0.3,
    },
    exportConfig: { pdfTemplate: HR_TEMPLATE, docxTemplate: HR_TEMPLATE, fileNameTemplate: 'ATS-Resume-Analysis', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free ATS Resume Checker — Does Your Resume Pass ATS? | AIFreeTools', descriptionTemplate: 'Check your resume against ATS requirements and get AI optimization tips. Free ATS resume scanner with keyword analysis. Get more interviews.', primaryKeyword: 'ats resume checker', keywords: ['ats resume checker', 'resume ats scanner', 'ats resume test', 'resume keyword checker', 'applicant tracking system checker', 'resume optimizer'], faqCount: 8, generateStatePages: false, articleTopics: ['what is ats and how does it work', 'how to optimize resume for ats', 'ats resume format tips', 'resume keywords for ats systems'], relatedTools: ['resume-summary-generator', 'cover-letter-generator', 'job-description-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['jobscan', 'resume-worded', 'linkedin-premium', 'resume-com'], adPlacements: ['header', 'post-result', 'sidebar', 'in-content'], upsellTrigger: 'export' },
  },
  {
    id: 'pay-stub-generator', slug: 'pay-stub-generator', name: 'Free Pay Stub Generator', shortName: 'Pay Stub Generator',
    category: 'high-intent-legal', description: 'Generate professional pay stubs for employees or self-employed individuals with accurate tax withholding calculations.', tagline: 'Create professional pay stubs for your business or records.', icon: 'dollar-sign', sortOrder: 65, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'employerName', type: 'text', label: 'Employer/Company Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'employerAddress', type: 'textarea', label: 'Employer Address', required: true, validation: { minLength: 5, maxLength: 300 } },
        { id: 'employeeName', type: 'text', label: 'Employee Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'employeeId', type: 'text', label: 'Employee ID (optional)', required: false, validation: { maxLength: 50 } },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
        { id: 'payPeriodStart', type: 'date', label: 'Pay Period Start', required: true },
        { id: 'payPeriodEnd', type: 'date', label: 'Pay Period End', required: true },
        { id: 'payDate', type: 'date', label: 'Pay Date', required: true },
        { id: 'payType', type: 'radio', label: 'Pay Type', required: true, defaultValue: 'salary', options: [{ value: 'salary', label: 'Salary' }, { value: 'hourly', label: 'Hourly' }] },
        { id: 'grossPay', type: 'currency', label: 'Gross Pay This Period ($)', required: true, validation: { min: 1 } },
        { id: 'hoursWorked', type: 'number', label: 'Hours Worked', required: false, validation: { min: 0, max: 744 }, showWhen: { field: 'payType', operator: 'equals', value: 'hourly' } },
        { id: 'filingStatus', type: 'select', label: 'Tax Filing Status', required: true, options: [{ value: 'single', label: 'Single' }, { value: 'married', label: 'Married' }, { value: 'hoh', label: 'Head of Household' }] },
        { id: 'federalAllowances', type: 'number', label: 'Federal Allowances (W4)', required: false, defaultValue: 0, validation: { min: 0, max: 20 } },
        { id: 'additionalDeductions', type: 'textarea', label: 'Additional Deductions (Name | Amount)', required: false, validation: { maxLength: 500 }, placeholder: 'Health Insurance | 150\n401k | 200' },
        { id: 'ytdGross', type: 'currency', label: 'YTD Gross Pay ($)', required: false, validation: { min: 0 } },
      ],
      groups: [
        { id: 'employer', title: 'Employer', fieldIds: ['employerName', 'employerAddress'] },
        { id: 'employee', title: 'Employee', fieldIds: ['employeeName', 'employeeId', 'state', 'filingStatus', 'federalAllowances'] },
        { id: 'pay', title: 'Pay Details', fieldIds: ['payType', 'grossPay', 'hoursWorked', 'payPeriodStart', 'payPeriodEnd', 'payDate', 'ytdGross'] },
        { id: 'deductions', title: 'Deductions', fieldIds: ['additionalDeductions'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a payroll specialist and CPA. Generate accurate pay stubs with precise tax withholding calculations. Show all deductions and net pay clearly.' },
        { id: 'generate', role: 'user', template: `Generate a Pay Stub:\n\nEmployer: {{employerName}}\nAddress: {{employerAddress}}\nEmployee: {{employeeName}} (ID: {{employeeId}})\nState: {{state}}\nPay Period: {{payPeriodStart}} — {{payPeriodEnd}}\nPay Date: {{payDate}}\nType: {{payType}}\nGross Pay: ${{grossPay}}\nHours: {{hoursWorked}}\nFiling Status: {{filingStatus}}\nAllowances: {{federalAllowances}}\nExtra Deductions: {{additionalDeductions}}\nYTD Gross: ${{ytdGross}}\n\nCalculate and format a complete pay stub with:\n- Earnings section (regular pay, overtime if applicable)\n- Federal tax withholding (estimate based on filing status)\n- Social Security (6.2% up to wage base)\n- Medicare (1.45%)\n- State income tax for {{state}}\n- Additional deductions\n- Total deductions\n- Net pay\n- YTD totals\n\nFormat as a professional payroll document.` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.1,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'Pay-Stub-{{employeeName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Pay Stub Generator — Professional Paycheck Stubs | AIFreeTools', descriptionTemplate: 'Generate accurate pay stubs with tax withholding calculations. Free AI-powered pay stub maker for employers and self-employed. PDF download.', primaryKeyword: 'free pay stub generator', keywords: ['pay stub generator', 'free pay stub maker', 'paycheck stub generator', 'payroll stub creator', 'check stub maker free'], faqCount: 7, generateStatePages: true, articleTopics: ['what is a pay stub', 'pay stub requirements by state', 'how to read a pay stub', 'pay stub for self-employed'], relatedTools: ['invoice-generator', 'freelancer-tax-estimator', 'w4-withholding-calculator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['gusto', 'adp', 'paychex', 'rippling'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export', leadGenCTA: 'Run payroll automatically. Try Gusto free for 30 days.' },
  },
];
