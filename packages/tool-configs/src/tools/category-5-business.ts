import type { ToolConfig } from '@aifreetools/shared-types';
import { BUSINESS_TEMPLATE, LEGAL_TEMPLATE } from '../constants';

export const CATEGORY_5_TOOLS: ToolConfig[] = [
  {
    id: 'business-plan-generator', slug: 'business-plan-generator', name: 'Free Business Plan Generator', shortName: 'Business Plan Generator',
    category: 'small-business', description: 'Generate a comprehensive business plan with executive summary, market analysis, financial projections, and go-to-market strategy.', tagline: 'Generate an investor-ready business plan with AI.', icon: 'map', sortOrder: 39, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'industry', type: 'text', label: 'Industry', required: true, validation: { minLength: 2, maxLength: 100 } },
        { id: 'businessModel', type: 'select', label: 'Business Model', required: true, options: [{ value: 'b2b_saas', label: 'B2B SaaS' }, { value: 'b2c_ecommerce', label: 'B2C E-commerce' }, { value: 'marketplace', label: 'Marketplace' }, { value: 'service_business', label: 'Service Business' }, { value: 'brick_mortar', label: 'Brick & Mortar' }, { value: 'franchise', label: 'Franchise' }, { value: 'other', label: 'Other' }] },
        { id: 'targetMarket', type: 'textarea', label: 'Target Market / Customers', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'problemSolved', type: 'textarea', label: 'Problem You Solve', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'solution', type: 'textarea', label: 'Your Solution / Product', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'competitors', type: 'textarea', label: 'Main Competitors', required: false, validation: { maxLength: 500 } },
        { id: 'revenueModel', type: 'multiselect', label: 'Revenue Model', required: true, options: [{ value: 'subscription', label: 'Subscription' }, { value: 'one_time', label: 'One-Time Purchase' }, { value: 'commission', label: 'Commission/Transaction Fee' }, { value: 'advertising', label: 'Advertising' }, { value: 'freemium', label: 'Freemium' }, { value: 'services', label: 'Professional Services' }] },
        { id: 'startupCosts', type: 'currency', label: 'Estimated Startup Costs ($)', required: false },
        { id: 'firstYearRevenue', type: 'currency', label: 'First Year Revenue Target ($)', required: false },
        { id: 'planType', type: 'radio', label: 'Plan Type', required: true, defaultValue: 'full', options: [{ value: 'full', label: 'Full Business Plan' }, { value: 'lean', label: 'Lean One-Page Plan' }, { value: 'executive_summary', label: 'Executive Summary Only' }] },
      ],
      groups: [
        { id: 'basics', title: 'Business Basics', fieldIds: ['businessName', 'industry', 'businessModel', 'planType'] },
        { id: 'market', title: 'Market & Opportunity', fieldIds: ['targetMarket', 'problemSolved', 'solution', 'competitors'] },
        { id: 'financials', title: 'Financial Overview', fieldIds: ['revenueModel', 'startupCosts', 'firstYearRevenue'] },
      ],
    },
    promptConfig: {
      version: '1.1.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a seasoned startup advisor, MBA, and venture capital consultant. Generate comprehensive, realistic, investor-grade business plans.' },
        { id: 'generate', role: 'user', template: `Generate a {{planType}} for:\n\nBusiness: {{businessName}}\nIndustry: {{industry}}\nModel: {{businessModel}}\nTarget: {{targetMarket}}\nProblem: {{problemSolved}}\nSolution: {{solution}}\nCompetitors: {{competitors}}\nRevenue: {{revenueModel}}\nStartup Cost: ${{startupCosts}}\nYear 1 Target: ${{firstYearRevenue}}\n\nInclude: Executive Summary, Company Description, Market Analysis, Products/Services, Marketing Strategy, Operations Plan, Management Team section, Financial Projections (3-year), Funding Requirements. Be specific and realistic.` },
      ],
      outputFormat: 'text', maxTokens: 5000, temperature: 0.4,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'Business-Plan-{{businessName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Business Plan Generator — AI-Powered Plans | AIFreeTools', descriptionTemplate: 'Generate a comprehensive business plan with AI. Executive summary, market analysis, and financial projections. Free PDF download.', primaryKeyword: 'free business plan generator', keywords: ['business plan generator', 'free business plan', 'business plan template', 'startup business plan', 'small business plan generator'], faqCount: 8, generateStatePages: false, articleTopics: ['how to write a business plan', 'business plan sections explained', 'lean business plan guide', 'investor business plan tips'], relatedTools: ['business-proposal-generator', 'swot-analysis-generator', 'mission-statement-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['liveplan', 'bplans', 'shopify', 'stripe'], adPlacements: ['header', 'post-result', 'sidebar', 'in-content'], upsellTrigger: 'export' },
  },
  {
    id: 'business-proposal-generator', slug: 'business-proposal-generator', name: 'Free Business Proposal Generator', shortName: 'Business Proposal Generator',
    category: 'small-business', description: 'Generate professional business proposals that win clients. Covers project scope, timeline, pricing, and value proposition.', tagline: 'Write winning business proposals in minutes.', icon: 'send', sortOrder: 40, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'senderCompany', type: 'text', label: 'Your Company Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'clientCompany', type: 'text', label: 'Client Company Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'projectTitle', type: 'text', label: 'Project/Proposal Title', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'problemStatement', type: 'textarea', label: 'Client\'s Problem / Need', required: true, validation: { minLength: 20, maxLength: 1000 } },
        { id: 'proposedSolution', type: 'textarea', label: 'Your Proposed Solution', required: true, validation: { minLength: 20, maxLength: 1000 } },
        { id: 'deliverables', type: 'textarea', label: 'Deliverables', required: true, validation: { minLength: 10, maxLength: 1000 } },
        { id: 'timeline', type: 'text', label: 'Project Timeline', required: true, placeholder: 'e.g. 8 weeks', validation: { minLength: 2, maxLength: 200 } },
        { id: 'totalCost', type: 'currency', label: 'Total Project Cost ($)', required: true, validation: { min: 1 } },
        { id: 'paymentTerms', type: 'text', label: 'Payment Terms', required: false, placeholder: 'e.g. 50% upfront, 50% on delivery' },
        { id: 'tone', type: 'radio', label: 'Proposal Tone', required: true, defaultValue: 'professional', options: [{ value: 'professional', label: 'Professional' }, { value: 'consultative', label: 'Consultative' }, { value: 'aggressive', label: 'Competitive / Aggressive' }] },
      ],
      groups: [
        { id: 'parties', title: 'Parties', fieldIds: ['senderCompany', 'clientCompany', 'projectTitle'] },
        { id: 'project', title: 'Project Details', fieldIds: ['problemStatement', 'proposedSolution', 'deliverables', 'timeline'] },
        { id: 'financial', title: 'Financial', fieldIds: ['totalCost', 'paymentTerms', 'tone'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a business development expert and proposal writer. Generate compelling, persuasive business proposals that focus on client value.' },
        { id: 'generate', role: 'user', template: `Generate a {{tone}} business proposal:\n\nFrom: {{senderCompany}}\nTo: {{clientCompany}}\nTitle: {{projectTitle}}\nProblem: {{problemStatement}}\nSolution: {{proposedSolution}}\nDeliverables: {{deliverables}}\nTimeline: {{timeline}}\nCost: ${{totalCost}}\nPayment: {{paymentTerms}}\n\nStructure: Executive Summary, Understanding of Client's Needs, Proposed Solution, Deliverables & Timeline, Investment/Pricing, About Us, Next Steps. Focus on client ROI and value, not just features.` },
      ],
      outputFormat: 'text', maxTokens: 3000, temperature: 0.4,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'Business-Proposal-{{projectTitle}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Business Proposal Generator — Win More Clients | AIFreeTools', descriptionTemplate: 'Generate professional business proposals that win clients. AI-powered, covers scope, pricing, and timeline. Free PDF download.', primaryKeyword: 'free business proposal generator', keywords: ['business proposal generator', 'free business proposal', 'proposal template', 'rfp response generator', 'client proposal generator'], faqCount: 6, generateStatePages: false, articleTopics: ['how to write a business proposal', 'business proposal vs business plan', 'winning proposal tips'], relatedTools: ['business-plan-generator', 'cold-email-generator', 'invoice-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['proposify', 'pandadoc', 'honeybook', 'bonsai'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'cold-email-generator', slug: 'cold-email-generator', name: 'Free Cold Email Generator', shortName: 'Cold Email Generator',
    category: 'small-business', description: 'Generate high-converting cold emails with AI. Personalized, compelling subject lines and CTAs for B2B outreach.', tagline: 'Write cold emails that get replies.', icon: 'mail', sortOrder: 41, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'senderName', type: 'text', label: 'Your Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'company', type: 'text', label: 'Your Company', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'prospect', type: 'text', label: 'Prospect\'s Name / Company', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'prospectRole', type: 'text', label: 'Prospect\'s Role / Industry', required: false, validation: { maxLength: 200 } },
        { id: 'offer', type: 'textarea', label: 'What You\'re Offering', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'valueProposition', type: 'textarea', label: 'Key Value / Result You Deliver', required: true, validation: { minLength: 10, maxLength: 500 }, placeholder: 'e.g. We help SaaS companies reduce churn by 25%' },
        { id: 'cta', type: 'select', label: 'Call to Action', required: true, defaultValue: 'meeting', options: [{ value: 'meeting', label: 'Schedule a Meeting' }, { value: 'call', label: 'Schedule a Call' }, { value: 'demo', label: 'Product Demo' }, { value: 'free_trial', label: 'Free Trial' }, { value: 'reply', label: 'Simple Reply' }] },
        { id: 'emailSequence', type: 'select', label: 'Email in Sequence', required: true, defaultValue: 'first', options: [{ value: 'first', label: 'First Contact Email' }, { value: 'follow_up_1', label: 'Follow-Up #1 (3 days)' }, { value: 'follow_up_2', label: 'Follow-Up #2 (7 days)' }, { value: 'breakup', label: 'Breakup Email' }] },
        { id: 'tone', type: 'radio', label: 'Tone', required: true, defaultValue: 'conversational', options: [{ value: 'conversational', label: 'Conversational' }, { value: 'professional', label: 'Professional' }, { value: 'direct', label: 'Direct & Brief' }] },
      ],
      groups: [
        { id: 'sender', title: 'Sender', fieldIds: ['senderName', 'company'] },
        { id: 'prospect_info', title: 'Prospect', fieldIds: ['prospect', 'prospectRole'] },
        { id: 'email_content', title: 'Email Content', fieldIds: ['offer', 'valueProposition', 'cta', 'emailSequence', 'tone'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a top B2B sales copywriter and cold email specialist. Write concise, personalized cold emails that feel human and get replies. Follow best practices: short, value-focused, single CTA.' },
        { id: 'generate', role: 'user', template: `Write a {{emailSequence}} cold email ({{tone}} tone):\n\nFrom: {{senderName}} at {{company}}\nTo: {{prospect}} ({{prospectRole}})\nOffer: {{offer}}\nValue: {{valueProposition}}\nCTA: {{cta}}\n\nRules: Under 120 words for email body. Start with them, not you. Lead with value/pain point. One clear CTA. Natural, not salesy. Provide 3 subject line options. Format: Subject Lines → Email Body.` },
      ],
      outputFormat: 'text', maxTokens: 600, temperature: 0.6,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'Cold-Email', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Cold Email Generator — AI B2B Outreach Emails | AIFreeTools', descriptionTemplate: 'Generate high-converting cold emails with AI. Personalized, value-focused B2B outreach. Free tool with subject line options.', primaryKeyword: 'cold email generator', keywords: ['cold email generator', 'b2b cold email template', 'sales email generator', 'outreach email template', 'cold outreach email'], faqCount: 6, generateStatePages: false, articleTopics: ['cold email best practices', 'b2b cold email strategies', 'cold email subject lines that get opens', 'email follow-up sequence guide'], relatedTools: ['email-subject-line-generator', 'business-proposal-generator', 'thank-you-email-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['lemlist', 'instantly', 'apollo', 'hunter'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'google-review-response-generator', slug: 'google-review-response-generator', name: 'Free Google Review Response Generator', shortName: 'Review Response Generator',
    category: 'small-business', description: 'Generate professional, SEO-friendly responses to Google reviews — positive, negative, or neutral.', tagline: 'Respond to every Google review professionally with AI.', icon: 'star', sortOrder: 42, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'reviewType', type: 'radio', label: 'Review Type', required: true, defaultValue: 'positive', options: [{ value: 'positive', label: '5-Star Positive' }, { value: 'neutral', label: '3-Star Neutral' }, { value: 'negative', label: '1-2 Star Negative' }] },
        { id: 'reviewContent', type: 'textarea', label: 'The Review (paste here)', required: true, validation: { minLength: 5, maxLength: 1000 } },
        { id: 'responseGoal', type: 'select', label: 'Response Goal', required: true, defaultValue: 'thank_retain', options: [{ value: 'thank_retain', label: 'Thank & Retain' }, { value: 'resolve_issue', label: 'Resolve Issue' }, { value: 'defend_reputation', label: 'Defend Reputation' }, { value: 'seo_local', label: 'SEO / Local Search Boost' }] },
        { id: 'ownerName', type: 'text', label: 'Owner/Manager Name', required: false, validation: { maxLength: 100 } },
        { id: 'contactInfo', type: 'text', label: 'Contact Email/Phone (for negative reviews)', required: false, validation: { maxLength: 100 } },
      ],
      groups: [
        { id: 'review', title: 'Review Details', fieldIds: ['businessName', 'reviewType', 'reviewContent'] },
        { id: 'response', title: 'Response Options', fieldIds: ['responseGoal', 'ownerName', 'contactInfo'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a reputation management specialist and local SEO expert. Write Google review responses that are professional, personalized, include relevant keywords for local SEO, and appropriately address the review content.' },
        { id: 'generate', role: 'user', template: `Generate a Google review response:\n\nBusiness: {{businessName}}\nReview Type: {{reviewType}}\nReview: {{reviewContent}}\nGoal: {{responseGoal}}\nOwner: {{ownerName}}\nContact: {{contactInfo}}\n\nWrite a {{responseGoal}} response that: acknowledges the reviewer personally, thanks them (if positive), addresses specific points from their review, includes business name and relevant keywords for SEO, is genuine and not templated. For negative reviews: acknowledge, apologize (if warranted), offer resolution, take it offline. Under 150 words.` },
      ],
      outputFormat: 'text', maxTokens: 400, temperature: 0.5,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'Google-Review-Response', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Google Review Response Generator — AI Reputation Management | AIFreeTools', descriptionTemplate: 'Generate professional Google review responses for positive, negative, and neutral reviews. AI-powered, SEO-friendly. Free tool for business owners.', primaryKeyword: 'google review response generator', keywords: ['google review response generator', 'review response template', 'how to respond to google reviews', 'negative review response', 'business review response'], faqCount: 6, generateStatePages: false, articleTopics: ['how to respond to negative reviews', 'google review response best practices', 'local seo review strategy'], relatedTools: ['business-proposal-generator', 'cold-email-generator', 'thank-you-email-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['birdeye', 'podium', 'grade-us', 'reviewtrackers'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'sop-generator', slug: 'sop-generator', name: 'Free SOP Generator', shortName: 'SOP Generator',
    category: 'small-business', description: 'Generate detailed Standard Operating Procedures (SOPs) for any business process with step-by-step instructions.', tagline: 'Document your business processes with professional SOPs.', icon: 'list', sortOrder: 43, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business/Department Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'processTitle', type: 'text', label: 'Process Title', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'processDescription', type: 'textarea', label: 'Process Description', required: true, validation: { minLength: 20, maxLength: 1000 } },
        { id: 'whoPerforms', type: 'text', label: 'Who Performs This Process?', required: true, placeholder: 'e.g. Customer Service Rep, Sales Manager', validation: { minLength: 2, maxLength: 200 } },
        { id: 'frequency', type: 'select', label: 'How Often?', required: true, options: [{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'as_needed', label: 'As Needed' }] },
        { id: 'tools', type: 'textarea', label: 'Tools/Systems Used', required: false, validation: { maxLength: 500 }, placeholder: 'Software, apps, equipment used...' },
        { id: 'successCriteria', type: 'textarea', label: 'Success Criteria', required: false, validation: { maxLength: 500 }, placeholder: 'How do you know the process was done correctly?' },
      ],
      groups: [
        { id: 'basics', title: 'SOP Basics', fieldIds: ['businessName', 'processTitle', 'frequency'] },
        { id: 'process', title: 'Process Details', fieldIds: ['processDescription', 'whoPerforms', 'tools', 'successCriteria'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are an operations consultant and process documentation specialist. Write clear, comprehensive SOPs that anyone can follow.' },
        { id: 'generate', role: 'user', template: `Generate an SOP:\n\nBusiness: {{businessName}}\nProcess: {{processTitle}}\nDescription: {{processDescription}}\nPerformed by: {{whoPerforms}}\nFrequency: {{frequency}}\nTools: {{tools}}\nSuccess: {{successCriteria}}\n\nFormat: Purpose, Scope, Who, When, Prerequisites, Step-by-Step Procedure (numbered), Quality Checks, Troubleshooting, Success Criteria, Related Documents. Clear, actionable language.` },
      ],
      outputFormat: 'text', maxTokens: 2500, temperature: 0.3,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'SOP-{{processTitle}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free SOP Generator — Standard Operating Procedure Template | AIFreeTools', descriptionTemplate: 'Generate detailed SOPs for any business process. AI-powered, professional format. Free PDF download for operations teams.', primaryKeyword: 'sop generator', keywords: ['sop generator', 'standard operating procedure generator', 'sop template', 'sop creator', 'business process document generator'], faqCount: 6, generateStatePages: false, articleTopics: ['what is an sop', 'how to write an sop', 'sop templates for small business', 'business process documentation'], relatedTools: ['business-plan-generator', 'meeting-agenda-generator', 'partnership-agreement-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['notion', 'confluence', 'trainual', 'process-street'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'refund-policy-generator', slug: 'refund-policy-generator', name: 'Free Refund Policy Generator', shortName: 'Refund Policy Generator',
    category: 'small-business', description: 'Generate a clear, customer-friendly refund and return policy for your ecommerce, SaaS, or service business.', tagline: 'Create a clear refund policy that builds customer trust.', icon: 'rotate-ccw', sortOrder: 44, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'businessType', type: 'select', label: 'Business Type', required: true, options: [{ value: 'ecommerce', label: 'E-commerce (Physical Products)' }, { value: 'digital_products', label: 'Digital Products' }, { value: 'saas', label: 'SaaS/Subscription' }, { value: 'services', label: 'Services' }, { value: 'mixed', label: 'Mixed (Products + Services)' }] },
        { id: 'refundWindow', type: 'select', label: 'Refund Window', required: true, defaultValue: '30', options: [{ value: '7', label: '7 Days' }, { value: '14', label: '14 Days' }, { value: '30', label: '30 Days' }, { value: '60', label: '60 Days' }, { value: '90', label: '90 Days' }, { value: 'no_refunds', label: 'No Refunds' }] },
        { id: 'conditions', type: 'multiselect', label: 'Refund Conditions', required: false, options: [{ value: 'unopened', label: 'Must be Unopened' }, { value: 'original_packaging', label: 'Original Packaging Required' }, { value: 'receipt', label: 'Receipt Required' }, { value: 'no_digital', label: 'No Refunds on Digital' }, { value: 'partial_refund', label: 'Partial Refund After X Days' }] },
        { id: 'contactEmail', type: 'email', label: 'Refund Contact Email', required: true },
        { id: 'processingTime', type: 'select', label: 'Refund Processing Time', required: true, defaultValue: '5_10', options: [{ value: '3_5', label: '3-5 Business Days' }, { value: '5_10', label: '5-10 Business Days' }, { value: '7_14', label: '7-14 Business Days' }] },
      ],
      groups: [
        { id: 'business', title: 'Business Details', fieldIds: ['businessName', 'businessType', 'contactEmail'] },
        { id: 'policy', title: 'Policy Terms', fieldIds: ['refundWindow', 'conditions', 'processingTime'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a customer experience and ecommerce legal specialist. Generate clear, fair refund policies that protect businesses and satisfy customers.' },
        { id: 'generate', role: 'user', template: `Generate a Refund Policy for:\n\nBusiness: {{businessName}} ({{businessType}})\nWindow: {{refundWindow}} days\nConditions: {{conditions}}\nContact: {{contactEmail}}\nProcessing: {{processingTime}}\n\nCreate a clear, comprehensive refund policy with sections: Eligibility, How to Request, Process & Timeline, Exceptions, Exchanges, Damaged/Defective Items (if applicable), Contact Info. Customer-friendly language that's also legally sound.` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'Refund-Policy-{{businessName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Refund Policy Generator — Return Policy Template | AIFreeTools', descriptionTemplate: 'Generate a clear refund and return policy for your ecommerce, SaaS, or service business. Free AI-powered, PDF download.', primaryKeyword: 'refund policy generator', keywords: ['refund policy generator', 'return policy generator', 'free return policy template', 'ecommerce return policy', 'money back guarantee policy'], faqCount: 6, generateStatePages: false, articleTopics: ['how to write a refund policy', 'ecommerce return policy best practices', 'refund policy requirements by country'], relatedTools: ['privacy-policy-generator', 'terms-of-service-generator', 'business-plan-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['shopify', 'woocommerce', 'termly'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'partnership-agreement-generator', slug: 'partnership-agreement-generator', name: 'Free Partnership Agreement Generator', shortName: 'Partnership Agreement',
    category: 'small-business', description: 'Generate a comprehensive partnership agreement covering profit sharing, decision making, dissolution, and partner duties.', tagline: 'Protect your business partnership with a clear agreement.', icon: 'users', sortOrder: 45, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business/Partnership Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'partner1', type: 'text', label: 'Partner 1 Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'partner2', type: 'text', label: 'Partner 2 Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'partner1Ownership', type: 'percentage', label: 'Partner 1 Ownership (%)', required: true, validation: { min: 1, max: 99 } },
        { id: 'businessPurpose', type: 'textarea', label: 'Business Purpose', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'profitSharing', type: 'radio', label: 'Profit Sharing', required: true, defaultValue: 'proportional', options: [{ value: 'proportional', label: 'Proportional to Ownership' }, { value: 'equal', label: 'Equal Split' }, { value: 'custom', label: 'Custom (specify in details)' }] },
        { id: 'managementType', type: 'radio', label: 'Management', required: true, defaultValue: 'joint', options: [{ value: 'joint', label: 'Joint Decision Making' }, { value: 'managing_partner', label: 'One Managing Partner' }] },
      ],
      groups: [
        { id: 'basics', title: 'Partnership Basics', fieldIds: ['businessName', 'businessPurpose'] },
        { id: 'partners', title: 'Partners', fieldIds: ['partner1', 'partner2', 'partner1Ownership'] },
        { id: 'governance', title: 'Governance', fieldIds: ['profitSharing', 'managementType'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a business law attorney specializing in partnership and business formation. Generate comprehensive partnership agreements that protect all parties.' },
        { id: 'generate', role: 'user', template: `Generate a Partnership Agreement:\n\nPartnership: {{businessName}}\nPartner 1: {{partner1}} ({{partner1Ownership}}%)\nPartner 2: {{partner2}} ({{100 - partner1Ownership}}%)\nPurpose: {{businessPurpose}}\nProfit: {{profitSharing}}\nManagement: {{managementType}}\n\nInclude: formation, purpose, capital contributions, profit/loss sharing, management rights, decisions requiring unanimous consent, admission of new partners, dispute resolution, dissolution procedures, non-compete provisions.` },
      ],
      outputFormat: 'text', maxTokens: 3500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Partnership-Agreement-{{businessName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Partnership Agreement Generator — AI Business Partner Contract | AIFreeTools', descriptionTemplate: 'Generate a comprehensive partnership agreement covering profit sharing, management, and dissolution. Free AI-powered, PDF download.', primaryKeyword: 'partnership agreement generator', keywords: ['partnership agreement generator', 'business partnership contract', 'free partnership agreement', 'partnership agreement template', 'business partner agreement'], faqCount: 6, generateStatePages: false, articleTopics: ['partnership agreement essentials', 'business partnership rights', 'dissolving a business partnership'], relatedTools: ['llc-operating-agreement-generator', 'business-plan-generator', 'nda-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['legalzoom', 'incfile', 'rocket-lawyer'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'mission-statement-generator', slug: 'mission-statement-generator', name: 'Free Mission Statement Generator', shortName: 'Mission Statement Generator',
    category: 'small-business', description: 'Generate a compelling mission statement that captures your company\'s purpose, values, and impact.', tagline: 'Craft your company\'s mission statement in seconds.', icon: 'compass', sortOrder: 46, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'company', type: 'text', label: 'Company Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'industry', type: 'text', label: 'Industry', required: true, validation: { minLength: 2, maxLength: 100 } },
        { id: 'whatYouDo', type: 'textarea', label: 'What You Do', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'whoYouServe', type: 'text', label: 'Who You Serve', required: true, validation: { minLength: 5, maxLength: 200 } },
        { id: 'coreValues', type: 'textarea', label: 'Core Values', required: true, validation: { minLength: 10, maxLength: 300 }, placeholder: 'e.g. Innovation, Integrity, Customer Focus' },
        { id: 'impact', type: 'textarea', label: 'The Impact You Want to Make', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'tone', type: 'radio', label: 'Tone', required: true, defaultValue: 'inspirational', options: [{ value: 'inspirational', label: 'Inspirational' }, { value: 'professional', label: 'Professional & Direct' }, { value: 'bold', label: 'Bold & Ambitious' }] },
      ],
      groups: [
        { id: 'company_info', title: 'Company', fieldIds: ['company', 'industry', 'tone'] },
        { id: 'mission', title: 'Mission Elements', fieldIds: ['whatYouDo', 'whoYouServe', 'coreValues', 'impact'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a brand strategist and corporate communications expert. Write concise, memorable mission statements that inspire and differentiate.' },
        { id: 'generate', role: 'user', template: `Generate mission statements for:\n\nCompany: {{company}} ({{industry}})\nWhat: {{whatYouDo}}\nWho: {{whoYouServe}}\nValues: {{coreValues}}\nImpact: {{impact}}\nTone: {{tone}}\n\nProvide 3 mission statement options (1-2 sentences each). Then provide 1 extended vision statement (2-3 sentences). Make them memorable, authentic, and action-oriented.` },
      ],
      outputFormat: 'text', maxTokens: 600, temperature: 0.7,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'Mission-Statement-{{company}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Mission Statement Generator — Company Mission & Vision | AIFreeTools', descriptionTemplate: 'Generate a compelling mission statement for your company. AI-powered, 3 options, free. Create your brand purpose statement instantly.', primaryKeyword: 'mission statement generator', keywords: ['mission statement generator', 'company mission statement generator', 'free mission statement', 'vision statement generator', 'business mission statement creator'], faqCount: 5, generateStatePages: false, articleTopics: ['how to write a mission statement', 'mission vs vision statement', 'examples of great mission statements'], relatedTools: ['business-plan-generator', 'tagline-generator', 'swot-analysis-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['shopify', 'wix', 'squarespace'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'swot-analysis-generator', slug: 'swot-analysis-generator', name: 'Free SWOT Analysis Generator', shortName: 'SWOT Analysis Generator',
    category: 'small-business', description: 'Generate a comprehensive SWOT analysis with AI-powered strategic insights and actionable recommendations.', tagline: 'Analyze your business position with an AI SWOT analysis.', icon: 'grid', sortOrder: 47, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business / Project Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'industry', type: 'text', label: 'Industry', required: true, validation: { minLength: 2, maxLength: 100 } },
        { id: 'businessDescription', type: 'textarea', label: 'Brief Business Description', required: true, validation: { minLength: 20, maxLength: 500 } },
        { id: 'targetMarket', type: 'text', label: 'Target Market', required: true, validation: { minLength: 5, maxLength: 200 } },
        { id: 'strengths', type: 'textarea', label: 'Known Strengths (optional)', required: false, validation: { maxLength: 500 } },
        { id: 'challenges', type: 'textarea', label: 'Known Challenges (optional)', required: false, validation: { maxLength: 500 } },
        { id: 'goal', type: 'text', label: 'Primary Business Goal', required: true, validation: { minLength: 10, maxLength: 300 } },
      ],
      groups: [
        { id: 'business', title: 'Business Context', fieldIds: ['businessName', 'industry', 'businessDescription', 'targetMarket', 'goal'] },
        { id: 'known', title: 'Known Factors (Optional)', fieldIds: ['strengths', 'challenges'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a strategic management consultant with MBA and McKinsey-level analysis skills. Generate insightful, actionable SWOT analyses with strategic recommendations.' },
        { id: 'generate', role: 'user', template: `Conduct a SWOT Analysis:\n\nBusiness: {{businessName}} ({{industry}})\nDescription: {{businessDescription}}\nTarget: {{targetMarket}}\nGoal: {{goal}}\nKnown strengths: {{strengths}}\nKnown challenges: {{challenges}}\n\nGenerate:\n1. Strengths (4-6 specific, internal advantages)\n2. Weaknesses (3-5 honest, internal limitations)\n3. Opportunities (4-6 external growth opportunities)\n4. Threats (3-5 external risks)\n5. SO Strategies (use strengths to capture opportunities)\n6. WO Strategies (overcome weaknesses to pursue opportunities)\n7. Priority action plan (top 3 immediate actions)\n\nBe specific and insightful, not generic.` },
      ],
      outputFormat: 'text', maxTokens: 2000, temperature: 0.4,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'SWOT-Analysis-{{businessName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free SWOT Analysis Generator — AI Strategic Business Analysis | AIFreeTools', descriptionTemplate: 'Generate a comprehensive SWOT analysis with AI strategic insights and action plans. Free tool for business owners and managers.', primaryKeyword: 'swot analysis generator', keywords: ['swot analysis generator', 'free swot analysis', 'business swot analysis tool', 'swot template generator', 'strategic analysis generator'], faqCount: 6, generateStatePages: false, articleTopics: ['what is swot analysis', 'how to do a swot analysis', 'swot analysis examples', 'swot to strategy'], relatedTools: ['business-plan-generator', 'mission-statement-generator', 'business-proposal-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['miro', 'notion', 'lucidchart'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'meeting-agenda-generator', slug: 'meeting-agenda-generator', name: 'Free Meeting Agenda Generator', shortName: 'Meeting Agenda Generator',
    category: 'small-business', description: 'Generate structured meeting agendas with time allocations, discussion points, and action item tracking.', tagline: 'Run more productive meetings with a structured agenda.', icon: 'clock', sortOrder: 48, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'meetingTitle', type: 'text', label: 'Meeting Title', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'meetingDate', type: 'date', label: 'Meeting Date', required: false },
        { id: 'duration', type: 'select', label: 'Meeting Duration', required: true, defaultValue: '60', options: [{ value: '30', label: '30 Minutes' }, { value: '45', label: '45 Minutes' }, { value: '60', label: '1 Hour' }, { value: '90', label: '1.5 Hours' }, { value: '120', label: '2 Hours' }] },
        { id: 'meetingType', type: 'select', label: 'Meeting Type', required: true, options: [{ value: 'weekly_standup', label: 'Weekly Standup' }, { value: 'strategy', label: 'Strategy Session' }, { value: 'project_kickoff', label: 'Project Kickoff' }, { value: 'retrospective', label: 'Retrospective' }, { value: 'board', label: 'Board/Executive Meeting' }, { value: 'client', label: 'Client Meeting' }, { value: 'all_hands', label: 'All-Hands' }, { value: 'other', label: 'Other' }] },
        { id: 'attendees', type: 'text', label: 'Attendees / Roles', required: false, placeholder: 'e.g. CEO, CTO, Marketing Lead', validation: { maxLength: 300 } },
        { id: 'topics', type: 'textarea', label: 'Key Topics to Cover', required: true, validation: { minLength: 10, maxLength: 1000 } },
        { id: 'objective', type: 'text', label: 'Meeting Objective', required: true, validation: { minLength: 10, maxLength: 300 } },
      ],
      groups: [
        { id: 'meeting', title: 'Meeting Details', fieldIds: ['meetingTitle', 'meetingDate', 'duration', 'meetingType', 'attendees'] },
        { id: 'content', title: 'Content', fieldIds: ['objective', 'topics'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a business operations and productivity expert. Create structured, time-boxed meeting agendas that keep meetings focused and productive.' },
        { id: 'generate', role: 'user', template: `Generate a meeting agenda:\n\nTitle: {{meetingTitle}}\nDate: {{meetingDate}}\nDuration: {{duration}} minutes\nType: {{meetingType}}\nAttendees: {{attendees}}\nObjective: {{objective}}\nTopics: {{topics}}\n\nCreate a structured agenda with: meeting objective, time-boxed agenda items (total = {{duration}} min), who leads each item, pre-read/prep required, action items template, decision tracking section. Include 5-min buffer for Q&A.` },
      ],
      outputFormat: 'text', maxTokens: 1200, temperature: 0.4,
    },
    exportConfig: { pdfTemplate: BUSINESS_TEMPLATE, docxTemplate: BUSINESS_TEMPLATE, fileNameTemplate: 'Meeting-Agenda-{{meetingTitle}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Meeting Agenda Generator — Productive Meeting Templates | AIFreeTools', descriptionTemplate: 'Generate structured meeting agendas with time allocations and action item tracking. Free AI-powered meeting agenda maker.', primaryKeyword: 'meeting agenda generator', keywords: ['meeting agenda generator', 'free meeting agenda', 'meeting agenda template', 'business meeting agenda', 'team meeting agenda creator'], faqCount: 5, generateStatePages: false, articleTopics: ['how to run effective meetings', 'meeting agenda best practices', 'daily standup vs weekly meeting'], relatedTools: ['sop-generator', 'performance-review-generator', 'business-proposal-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['notion', 'fellow-app', 'otter-ai'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
];
