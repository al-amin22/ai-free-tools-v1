import type { ToolConfig } from '@aifreetools/shared-types';
import { COPY_TEMPLATE, HR_TEMPLATE } from '../constants';

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'confident', label: 'Confident' },
  { value: 'warm', label: 'Warm & Friendly' },
  { value: 'creative', label: 'Creative' },
];

export const CATEGORY_6_TOOLS: ToolConfig[] = [
  {
    id: 'cover-letter-generator', slug: 'cover-letter-generator', name: 'Free Cover Letter Generator', shortName: 'Cover Letter Generator',
    category: 'copywriting-content', description: 'Generate a tailored, compelling cover letter that highlights your relevant experience and gets you interviews.', tagline: 'Write a cover letter that gets you the interview.', icon: 'file', sortOrder: 49, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'applicantName', type: 'text', label: 'Your Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'jobTitle', type: 'text', label: 'Job Title Applying For', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'company', type: 'text', label: 'Company Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'hiringManager', type: 'text', label: 'Hiring Manager Name (if known)', required: false, validation: { maxLength: 200 } },
        { id: 'experience', type: 'textarea', label: 'Your Relevant Experience', required: true, validation: { minLength: 20, maxLength: 1000 } },
        { id: 'keyAchievements', type: 'textarea', label: 'Top Achievements (with numbers)', required: true, validation: { minLength: 10, maxLength: 500 }, placeholder: 'e.g. Grew revenue by 40%, managed team of 12...' },
        { id: 'whyCompany', type: 'textarea', label: 'Why You Want This Company', required: false, validation: { maxLength: 500 } },
        { id: 'tone', type: 'select', label: 'Tone', required: true, defaultValue: 'professional', options: toneOptions },
      ],
      groups: [
        { id: 'details', title: 'Job Details', fieldIds: ['applicantName', 'jobTitle', 'company', 'hiringManager'] },
        { id: 'content', title: 'Your Background', fieldIds: ['experience', 'keyAchievements', 'whyCompany', 'tone'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are an expert career coach and cover letter writer. Write compelling, personalized cover letters that stand out and get callbacks.' },
        { id: 'generate', role: 'user', template: `Write a cover letter:\n\nApplicant: {{applicantName}}\nRole: {{jobTitle}} at {{company}}\nHiring Manager: {{hiringManager}}\nExperience: {{experience}}\nAchievements: {{keyAchievements}}\nWhy this company: {{whyCompany}}\nTone: {{tone}}\n\nWrite a 3-paragraph cover letter that: opens with a hook (not "I'm applying for"), highlights 2-3 specific achievements with numbers, shows knowledge of {{company}}, ends with confident CTA. Under 350 words. Tailored, not generic.` },
      ],
      outputFormat: 'text', maxTokens: 800, temperature: 0.5,
    },
    exportConfig: { pdfTemplate: HR_TEMPLATE, docxTemplate: HR_TEMPLATE, fileNameTemplate: 'Cover-Letter-{{company}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Cover Letter Generator — AI-Powered Cover Letters | AIFreeTools', descriptionTemplate: 'Generate a tailored cover letter that gets you interviews. AI-powered, job-specific, free PDF download.', primaryKeyword: 'free cover letter generator', keywords: ['cover letter generator', 'free cover letter', 'cover letter maker', 'ai cover letter writer', 'cover letter template'], faqCount: 7, generateStatePages: false, articleTopics: ['how to write a cover letter', 'cover letter mistakes to avoid', 'cover letter opening lines', 'cover letter format 2026'], relatedTools: ['resume-summary-generator', 'job-description-generator', 'linkedin-summary-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['resume-com', 'zety', 'enhancv', 'linkedin'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'resume-summary-generator', slug: 'resume-summary-generator', name: 'Free Resume Summary Generator', shortName: 'Resume Summary Generator',
    category: 'copywriting-content', description: 'Generate a powerful resume summary that highlights your value proposition and passes ATS screening.', tagline: 'Write a resume summary that stops recruiters in their tracks.', icon: 'user', sortOrder: 50, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'jobTitle', type: 'text', label: 'Target Job Title', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'yearsExperience', type: 'select', label: 'Years of Experience', required: true, options: [{ value: '0-2', label: '0-2 Years (Entry)' }, { value: '3-5', label: '3-5 Years (Mid)' }, { value: '6-10', label: '6-10 Years (Senior)' }, { value: '10+', label: '10+ Years (Executive)' }] },
        { id: 'topSkills', type: 'textarea', label: 'Top 5 Skills & Tools', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'topAchievements', type: 'textarea', label: 'Top 3 Achievements (quantified)', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'industryFocus', type: 'text', label: 'Industry Focus', required: false, validation: { maxLength: 100 } },
        { id: 'careerGoal', type: 'text', label: 'Career Goal / What You Bring', required: false, validation: { maxLength: 300 } },
      ],
      groups: [
        { id: 'profile', title: 'Profile', fieldIds: ['jobTitle', 'yearsExperience', 'industryFocus'] },
        { id: 'achievements', title: 'Achievements', fieldIds: ['topSkills', 'topAchievements', 'careerGoal'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are an expert resume writer and career coach. Write punchy, ATS-optimized resume summaries that immediately communicate candidate value.' },
        { id: 'generate', role: 'user', template: `Write 3 resume summary options for:\n\nTitle: {{jobTitle}}\nExperience: {{yearsExperience}} years\nSkills: {{topSkills}}\nAchievements: {{topAchievements}}\nIndustry: {{industryFocus}}\nGoal: {{careerGoal}}\n\nEach summary: 3-4 sentences, ATS-friendly, includes specific numbers/achievements, clearly states value proposition. Vary the opening for each option. Under 80 words each.` },
      ],
      outputFormat: 'text', maxTokens: 600, temperature: 0.6,
    },
    exportConfig: { pdfTemplate: HR_TEMPLATE, docxTemplate: HR_TEMPLATE, fileNameTemplate: 'Resume-Summary', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Resume Summary Generator — ATS-Optimized Professional Summaries | AIFreeTools', descriptionTemplate: 'Generate ATS-optimized resume summaries that get interviews. AI-powered, 3 options. Free resume summary generator.', primaryKeyword: 'resume summary generator', keywords: ['resume summary generator', 'resume objective generator', 'professional summary generator', 'resume profile generator', 'ats resume summary'], faqCount: 6, generateStatePages: false, articleTopics: ['resume summary vs objective', 'how to write a resume summary', 'resume summary examples by industry', 'ats resume tips'], relatedTools: ['cover-letter-generator', 'linkedin-summary-generator', 'ats-resume-checker'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['resume-com', 'zety', 'resumegenius', 'linkedin'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'linkedin-summary-generator', slug: 'linkedin-summary-generator', name: 'Free LinkedIn Summary Generator', shortName: 'LinkedIn Summary Generator',
    category: 'copywriting-content', description: 'Generate a compelling LinkedIn About section that builds your personal brand, attracts opportunities, and tells your story.', tagline: 'Write a LinkedIn summary that opens doors.', icon: 'linkedin', sortOrder: 51, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'name', type: 'text', label: 'Your Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'currentRole', type: 'text', label: 'Current Role / What You Do', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'industry', type: 'text', label: 'Industry', required: true, validation: { minLength: 2, maxLength: 100 } },
        { id: 'targetAudience', type: 'text', label: 'Who Should Find You?', required: true, placeholder: 'e.g. Hiring managers at SaaS companies, potential clients', validation: { minLength: 5, maxLength: 200 } },
        { id: 'background', type: 'textarea', label: 'Your Background & Expertise', required: true, validation: { minLength: 20, maxLength: 1000 } },
        { id: 'achievements', type: 'textarea', label: 'Key Achievements', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'cta', type: 'text', label: 'Call to Action', required: false, placeholder: 'e.g. DM me for consulting, Open to new opportunities', validation: { maxLength: 200 } },
        { id: 'tone', type: 'select', label: 'Tone', required: true, defaultValue: 'professional', options: toneOptions },
      ],
      groups: [
        { id: 'profile', title: 'Profile', fieldIds: ['name', 'currentRole', 'industry', 'targetAudience'] },
        { id: 'content', title: 'Content', fieldIds: ['background', 'achievements', 'cta', 'tone'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a personal branding expert and LinkedIn optimization specialist. Write engaging LinkedIn summaries that attract the right opportunities.' },
        { id: 'generate', role: 'user', template: `Write a LinkedIn About section for:\n\n{{name}}: {{currentRole}} in {{industry}}\nAudience: {{targetAudience}}\nBackground: {{background}}\nAchievements: {{achievements}}\nCTA: {{cta}}\nTone: {{tone}}\n\nWrite a {{tone}} LinkedIn summary that: hooks in the first line (LinkedIn cuts off after 2-3 lines), tells the professional story compellingly, highlights key achievements with numbers, shows personality, ends with clear CTA. 200-300 words. Use line breaks for readability. First person.` },
      ],
      outputFormat: 'text', maxTokens: 600, temperature: 0.6,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'LinkedIn-Summary', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free LinkedIn Summary Generator — Stand Out on LinkedIn | AIFreeTools', descriptionTemplate: 'Generate a compelling LinkedIn About section with AI. Attract recruiters and opportunities. Free LinkedIn summary generator.', primaryKeyword: 'linkedin summary generator', keywords: ['linkedin summary generator', 'linkedin about section generator', 'linkedin bio generator', 'linkedin profile writer', 'linkedin headline generator'], faqCount: 6, generateStatePages: false, articleTopics: ['how to write a linkedin summary', 'linkedin profile optimization tips', 'linkedin summary examples', 'personal branding on linkedin'], relatedTools: ['cover-letter-generator', 'resume-summary-generator', 'bio-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['linkedin-premium', 'resume-worded', 'jobscan'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'email-subject-line-generator', slug: 'email-subject-line-generator', name: 'Free Email Subject Line Generator', shortName: 'Subject Line Generator',
    category: 'copywriting-content', description: 'Generate high-converting email subject lines that boost open rates. Get 10 options with different angles.', tagline: 'Generate subject lines that get your emails opened.', icon: 'mail', sortOrder: 52, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'emailPurpose', type: 'select', label: 'Email Purpose', required: true, options: [{ value: 'newsletter', label: 'Newsletter' }, { value: 'cold_outreach', label: 'Cold Outreach/Sales' }, { value: 'promotional', label: 'Promotional/Offer' }, { value: 'follow_up', label: 'Follow-Up' }, { value: 'announcement', label: 'Announcement' }, { value: 'onboarding', label: 'Onboarding' }, { value: 're_engagement', label: 'Re-engagement' }] },
        { id: 'emailContent', type: 'textarea', label: 'Email Content Summary', required: true, validation: { minLength: 10, maxLength: 500 }, placeholder: 'Describe what\'s inside the email...' },
        { id: 'targetAudience', type: 'text', label: 'Target Audience', required: true, validation: { minLength: 5, maxLength: 200 } },
        { id: 'tone', type: 'select', label: 'Tone', required: true, defaultValue: 'professional', options: [{ value: 'professional', label: 'Professional' }, { value: 'casual', label: 'Casual' }, { value: 'urgent', label: 'Urgent' }, { value: 'curious', label: 'Curiosity-Driven' }, { value: 'benefit_focused', label: 'Benefit-Focused' }] },
        { id: 'count', type: 'select', label: 'Number of Options', required: true, defaultValue: '10', options: [{ value: '5', label: '5 Options' }, { value: '10', label: '10 Options' }, { value: '15', label: '15 Options' }] },
      ],
      groups: [
        { id: 'email', title: 'Email Details', fieldIds: ['emailPurpose', 'emailContent', 'targetAudience'] },
        { id: 'options', title: 'Options', fieldIds: ['tone', 'count'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a top email marketing copywriter with proven 40%+ open rate expertise. Generate diverse, compelling subject lines that drive opens.' },
        { id: 'generate', role: 'user', template: `Generate {{count}} email subject lines:\n\nType: {{emailPurpose}}\nContent: {{emailContent}}\nAudience: {{targetAudience}}\nTone: {{tone}}\n\nCreate {{count}} subject lines using different approaches:\n- Curiosity gap\n- Direct benefit\n- Question format\n- Number/list format\n- Personalization token\n- Urgency/scarcity\n- How-to\n- Bold claim\n\nFor each: subject line + why it works (1 sentence). Include 3 preheader text options at the end.` },
      ],
      outputFormat: 'text', maxTokens: 1000, temperature: 0.7,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'Email-Subject-Lines', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Email Subject Line Generator — Boost Your Open Rates | AIFreeTools', descriptionTemplate: 'Generate 10 high-converting email subject lines with AI. Multiple angles, free. Boost your email open rates instantly.', primaryKeyword: 'email subject line generator', keywords: ['email subject line generator', 'subject line generator', 'email open rate optimizer', 'best email subject lines', 'subject line tester'], faqCount: 6, generateStatePages: false, articleTopics: ['email subject line best practices', 'what makes a good subject line', 'email open rates by industry'], relatedTools: ['cold-email-generator', 'thank-you-email-generator', 'product-description-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['mailchimp', 'convertkit', 'klaviyo', 'activecampaign'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'product-description-generator', slug: 'product-description-generator', name: 'Free Product Description Generator', shortName: 'Product Description Generator',
    category: 'copywriting-content', description: 'Generate compelling, SEO-optimized product descriptions that convert browsers into buyers.', tagline: 'Write product descriptions that sell.', icon: 'package', sortOrder: 53, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'productName', type: 'text', label: 'Product Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'productCategory', type: 'text', label: 'Product Category', required: true, validation: { minLength: 2, maxLength: 100 } },
        { id: 'targetCustomer', type: 'text', label: 'Target Customer', required: true, validation: { minLength: 5, maxLength: 200 } },
        { id: 'keyFeatures', type: 'textarea', label: 'Key Features & Benefits', required: true, validation: { minLength: 10, maxLength: 1000 } },
        { id: 'painPoints', type: 'textarea', label: 'Problem It Solves', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'price', type: 'currency', label: 'Price ($)', required: false },
        { id: 'tone', type: 'select', label: 'Brand Tone', required: true, defaultValue: 'professional', options: [{ value: 'professional', label: 'Professional' }, { value: 'luxury', label: 'Luxury' }, { value: 'playful', label: 'Playful' }, { value: 'technical', label: 'Technical' }, { value: 'minimalist', label: 'Minimalist' }] },
        { id: 'length', type: 'radio', label: 'Description Length', required: true, defaultValue: 'medium', options: [{ value: 'short', label: 'Short (50 words)' }, { value: 'medium', label: 'Medium (100-150 words)' }, { value: 'long', label: 'Long (200-300 words)' }] },
      ],
      groups: [
        { id: 'product', title: 'Product Details', fieldIds: ['productName', 'productCategory', 'targetCustomer', 'price'] },
        { id: 'copy', title: 'Copywriting', fieldIds: ['keyFeatures', 'painPoints', 'tone', 'length'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are an e-commerce conversion copywriter. Write product descriptions that sell benefits (not just features), create desire, and drive purchases.' },
        { id: 'generate', role: 'user', template: `Write a {{length}} product description:\n\nProduct: {{productName}} ({{productCategory}})\nCustomer: {{targetCustomer}}\nFeatures: {{keyFeatures}}\nProblem solved: {{painPoints}}\nPrice: \$\{\{price}}\nTone: {{tone}}\n\nWrite a {{tone}} description that: leads with the customer's pain/desire, highlights benefits over features, includes social proof language naturally, creates desire, ends with subtle CTA. Optimize for relevant search terms. Format with a headline + body.` },
      ],
      outputFormat: 'text', maxTokens: 600, temperature: 0.6,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'Product-Description-{{productName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Product Description Generator — AI Ecommerce Copy | AIFreeTools', descriptionTemplate: 'Generate compelling product descriptions that convert. AI-powered, SEO-optimized, multiple tones. Free for Shopify, Amazon, and more.', primaryKeyword: 'product description generator', keywords: ['product description generator', 'ai product description', 'ecommerce product description', 'shopify product description generator', 'amazon product description'], faqCount: 6, generateStatePages: false, articleTopics: ['how to write product descriptions', 'product description seo optimization', 'conversion-focused product copy tips'], relatedTools: ['tagline-generator', 'email-subject-line-generator', 'blog-title-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['shopify', 'bigcommerce', 'woocommerce'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'blog-title-generator', slug: 'blog-title-generator', name: 'Free Blog Title Generator', shortName: 'Blog Title Generator',
    category: 'copywriting-content', description: 'Generate click-worthy, SEO-optimized blog post titles that rank and get shared.', tagline: 'Generate blog titles that get clicks and rank on Google.', icon: 'type', sortOrder: 54, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'topic', type: 'text', label: 'Blog Topic / Keyword', required: true, validation: { minLength: 3, maxLength: 200 } },
        { id: 'targetAudience', type: 'text', label: 'Target Audience', required: true, validation: { minLength: 5, maxLength: 200 } },
        { id: 'contentType', type: 'select', label: 'Content Type', required: true, options: [{ value: 'listicle', label: 'Listicle (X Ways to...)' }, { value: 'how_to', label: 'How-To Guide' }, { value: 'ultimate_guide', label: 'Ultimate Guide' }, { value: 'comparison', label: 'Comparison' }, { value: 'case_study', label: 'Case Study' }, { value: 'opinion', label: 'Opinion/Hot Take' }, { value: 'news', label: 'News/Trend' }] },
        { id: 'count', type: 'select', label: 'Number of Titles', required: true, defaultValue: '10', options: [{ value: '5', label: '5' }, { value: '10', label: '10' }, { value: '15', label: '15' }] },
      ],
      groups: [{ id: 'blog', title: 'Blog Details', fieldIds: ['topic', 'targetAudience', 'contentType', 'count'] }],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are an SEO content strategist and headline writer. Create compelling, SEO-optimized blog titles that rank and drive clicks.' },
        { id: 'generate', role: 'user', template: `Generate {{count}} blog titles for:\n\nTopic: {{topic}}\nAudience: {{targetAudience}}\nType: {{contentType}}\n\nUse proven formulas: numbers, power words, curiosity gaps, "how-to", year (if relevant). Mix: SEO-focused (exact keyword) + click-bait + emotional + practical. For each: title + estimated search appeal score (1-10). Mark the top 3 recommendations.` },
      ],
      outputFormat: 'text', maxTokens: 800, temperature: 0.7,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'Blog-Titles', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Blog Title Generator — Click-Worthy SEO Headlines | AIFreeTools', descriptionTemplate: 'Generate SEO-optimized blog titles that rank and get clicks. AI-powered, 10 options, free blog headline generator.', primaryKeyword: 'blog title generator', keywords: ['blog title generator', 'blog headline generator', 'seo blog title ideas', 'article title generator', 'content title ideas'], faqCount: 5, generateStatePages: false, articleTopics: ['how to write blog titles', 'seo headline formulas', 'click-through rate optimization for blog posts'], relatedTools: ['product-description-generator', 'tagline-generator', 'press-release-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['semrush', 'ahrefs', 'surfer-seo'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'thank-you-email-generator', slug: 'thank-you-email-generator', name: 'Free Thank You Email Generator', shortName: 'Thank You Email Generator',
    category: 'copywriting-content', description: 'Generate professional thank you emails for job interviews, client meetings, purchases, and networking.', tagline: 'Send thank you emails that leave a lasting impression.', icon: 'heart', sortOrder: 55, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'senderName', type: 'text', label: 'Your Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'recipientName', type: 'text', label: 'Recipient Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'emailType', type: 'select', label: 'Thank You Type', required: true, options: [{ value: 'job_interview', label: 'After Job Interview' }, { value: 'client_meeting', label: 'After Client Meeting' }, { value: 'purchase', label: 'Customer Purchase' }, { value: 'networking', label: 'Networking / Event' }, { value: 'referral', label: 'Referral / Introduction' }, { value: 'speaker', label: 'Guest Speaker' }] },
        { id: 'context', type: 'textarea', label: 'Meeting / Interaction Context', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'followUp', type: 'text', label: 'Next Step / Follow-Up Action', required: false, validation: { maxLength: 200 } },
        { id: 'tone', type: 'radio', label: 'Tone', required: true, defaultValue: 'professional_warm', options: [{ value: 'professional_warm', label: 'Professional & Warm' }, { value: 'brief', label: 'Brief & Direct' }] },
      ],
      groups: [
        { id: 'details', title: 'Email Details', fieldIds: ['senderName', 'recipientName', 'emailType', 'tone'] },
        { id: 'content', title: 'Content', fieldIds: ['context', 'followUp'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a communication expert. Write thoughtful thank you emails that are genuine, professional, and advance the relationship.' },
        { id: 'generate', role: 'user', template: `Write a {{emailType}} thank you email:\n\nFrom: {{senderName}}\nTo: {{recipientName}}\nContext: {{context}}\nNext step: {{followUp}}\nTone: {{tone}}\n\nWrite a {{tone}} thank you email that: opens with specific appreciation (not generic), references something specific from the {{emailType}}, {{#if followUp}}sets up the next step: {{followUp}}{{/if}}, closes warmly. Under 150 words. Genuine, not formulaic.` },
      ],
      outputFormat: 'text', maxTokens: 400, temperature: 0.5,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'Thank-You-Email', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Thank You Email Generator — After Interview & More | AIFreeTools', descriptionTemplate: 'Generate professional thank you emails for job interviews, client meetings, and more. AI-powered, free templates.', primaryKeyword: 'thank you email generator', keywords: ['thank you email generator', 'interview thank you email', 'after interview thank you', 'thank you email template', 'professional thank you email'], faqCount: 6, generateStatePages: false, articleTopics: ['how to write a thank you email after interview', 'thank you email timing tips', 'thank you note vs email'], relatedTools: ['cold-email-generator', 'email-subject-line-generator', 'cover-letter-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['grammarly', 'linkedin'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'bio-generator', slug: 'bio-generator', name: 'Free Bio Generator', shortName: 'Bio Generator',
    category: 'copywriting-content', description: 'Generate a compelling professional bio for your website, social media, speaker profiles, or press kit.', tagline: 'Write a professional bio that makes a great first impression.', icon: 'user-circle', sortOrder: 56, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'name', type: 'text', label: 'Your Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'title', type: 'text', label: 'Current Role/Title', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'company', type: 'text', label: 'Company/Organization', required: false, validation: { maxLength: 200 } },
        { id: 'background', type: 'textarea', label: 'Professional Background', required: true, validation: { minLength: 20, maxLength: 1000 } },
        { id: 'achievements', type: 'textarea', label: 'Notable Achievements', required: true, validation: { minLength: 10, maxLength: 500 } },
        { id: 'personalTouch', type: 'text', label: 'Personal Touch (optional)', required: false, placeholder: 'e.g. lives in NYC, runs marathons, father of 3', validation: { maxLength: 200 } },
        { id: 'bioLength', type: 'radio', label: 'Bio Length', required: true, defaultValue: 'medium', options: [{ value: 'short', label: 'Short (50 words — Twitter/Instagram)' }, { value: 'medium', label: 'Medium (100-150 words — LinkedIn)' }, { value: 'long', label: 'Long (200-300 words — Website/Speaker)' }] },
        { id: 'person', type: 'radio', label: 'Person', required: true, defaultValue: 'third', options: [{ value: 'first', label: 'First Person (I/me)' }, { value: 'third', label: 'Third Person (He/She/They)' }] },
      ],
      groups: [
        { id: 'profile', title: 'Profile', fieldIds: ['name', 'title', 'company'] },
        { id: 'content', title: 'Content', fieldIds: ['background', 'achievements', 'personalTouch'] },
        { id: 'format', title: 'Format', fieldIds: ['bioLength', 'person'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a personal branding expert and professional copywriter. Write compelling bios that tell a story and build credibility.' },
        { id: 'generate', role: 'user', template: `Write a {{bioLength}} professional bio:\n\n{{name}}: {{title}} at {{company}}\nBackground: {{background}}\nAchievements: {{achievements}}\nPersonal: {{personalTouch}}\nPerson: {{person}}\n\nWrite in {{person}} person. Compelling narrative structure: who they are → what they've done → where they're going. Include achievements with specifics. If {{person}} is third person, use {{name}}'s name first, then pronouns. Add personal touch naturally at the end.` },
      ],
      outputFormat: 'text', maxTokens: 500, temperature: 0.6,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'Professional-Bio-{{name}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Bio Generator — Professional Biography Templates | AIFreeTools', descriptionTemplate: 'Generate a compelling professional bio for your website, LinkedIn, or speaker profile. AI-powered, multiple lengths. Free.', primaryKeyword: 'bio generator', keywords: ['bio generator', 'professional bio generator', 'biography generator', 'speaker bio generator', 'about me generator'], faqCount: 5, generateStatePages: false, articleTopics: ['how to write a professional bio', 'third vs first person bio', 'bio examples for different platforms'], relatedTools: ['linkedin-summary-generator', 'resume-summary-generator', 'press-release-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['squarespace', 'wix', 'linkedin'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
  {
    id: 'press-release-generator', slug: 'press-release-generator', name: 'Free Press Release Generator', shortName: 'Press Release Generator',
    category: 'copywriting-content', description: 'Generate professional press releases for product launches, company news, partnerships, or events.', tagline: 'Get media attention with a professionally written press release.', icon: 'newspaper', sortOrder: 57, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'company', type: 'text', label: 'Company Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'newsType', type: 'select', label: 'Type of News', required: true, options: [{ value: 'product_launch', label: 'Product Launch' }, { value: 'funding', label: 'Funding Announcement' }, { value: 'partnership', label: 'Partnership' }, { value: 'award', label: 'Award/Recognition' }, { value: 'expansion', label: 'Expansion/New Location' }, { value: 'executive', label: 'Executive Hire' }, { value: 'event', label: 'Event/Conference' }] },
        { id: 'headline', type: 'text', label: 'Key Announcement Headline', required: true, validation: { minLength: 5, maxLength: 200 } },
        { id: 'details', type: 'textarea', label: 'Announcement Details', required: true, validation: { minLength: 30, maxLength: 1000 } },
        { id: 'quote', type: 'textarea', label: 'Executive Quote', required: false, validation: { maxLength: 300 } },
        { id: 'contactName', type: 'text', label: 'Press Contact Name', required: false, validation: { maxLength: 200 } },
        { id: 'contactEmail', type: 'email', label: 'Press Contact Email', required: false },
      ],
      groups: [
        { id: 'company_info', title: 'Company & News', fieldIds: ['company', 'newsType', 'headline'] },
        { id: 'content', title: 'Content', fieldIds: ['details', 'quote'] },
        { id: 'contact', title: 'Press Contact', fieldIds: ['contactName', 'contactEmail'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a PR professional and communications specialist. Write press releases in standard AP style that journalists will actually want to publish.' },
        { id: 'generate', role: 'user', template: `Write a press release:\n\nCompany: {{company}}\nType: {{newsType}}\nHeadline: {{headline}}\nDetails: {{details}}\nQuote: {{quote}}\nContact: {{contactName}} | {{contactEmail}}\n\nStandard press release format: FOR IMMEDIATE RELEASE header, compelling headline, dateline with city, inverted pyramid (most important first), 2-3 body paragraphs, executive quote (or AI-generated if blank), boilerplate about company, ### ending, contact info. AP style. Newsworthy angle front and center.` },
      ],
      outputFormat: 'text', maxTokens: 1200, temperature: 0.4,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'Press-Release-{{company}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Press Release Generator — Professional PR Template | AIFreeTools', descriptionTemplate: 'Generate a professional press release for product launches, funding, or company news. AI-powered AP style. Free PDF download.', primaryKeyword: 'press release generator', keywords: ['press release generator', 'free press release template', 'press release maker', 'pr release generator', 'news release template'], faqCount: 6, generateStatePages: false, articleTopics: ['how to write a press release', 'press release format guide', 'how to distribute a press release', 'press release vs announcement'], relatedTools: ['bio-generator', 'blog-title-generator', 'business-proposal-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['pr-newswire', 'businesswire', 'einnews'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'tagline-generator', slug: 'tagline-generator', name: 'Free Tagline Generator', shortName: 'Tagline Generator',
    category: 'copywriting-content', description: 'Generate memorable brand taglines and slogans that capture your company\'s essence and stick in people\'s minds.', tagline: 'Find the perfect tagline for your brand.', icon: 'zap', sortOrder: 58, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'company', type: 'text', label: 'Company/Brand Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'industry', type: 'text', label: 'Industry', required: true, validation: { minLength: 2, maxLength: 100 } },
        { id: 'whatYouDo', type: 'text', label: 'What You Do / Offer', required: true, validation: { minLength: 5, maxLength: 300 } },
        { id: 'targetCustomer', type: 'text', label: 'Target Customer', required: true, validation: { minLength: 5, maxLength: 200 } },
        { id: 'brandPersonality', type: 'multiselect', label: 'Brand Personality', required: true, options: [{ value: 'bold', label: 'Bold' }, { value: 'trustworthy', label: 'Trustworthy' }, { value: 'innovative', label: 'Innovative' }, { value: 'playful', label: 'Playful' }, { value: 'premium', label: 'Premium' }, { value: 'approachable', label: 'Approachable' }, { value: 'expert', label: 'Expert/Authority' }] },
        { id: 'uniqueValue', type: 'text', label: 'Your Unique Value', required: true, validation: { minLength: 5, maxLength: 300 } },
        { id: 'count', type: 'select', label: 'Number of Options', required: true, defaultValue: '10', options: [{ value: '5', label: '5' }, { value: '10', label: '10' }, { value: '15', label: '15' }] },
      ],
      groups: [
        { id: 'brand', title: 'Brand', fieldIds: ['company', 'industry', 'whatYouDo', 'targetCustomer'] },
        { id: 'positioning', title: 'Positioning', fieldIds: ['brandPersonality', 'uniqueValue', 'count'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a brand strategist and award-winning copywriter. Generate memorable, distinct taglines that differentiate brands and stick in memory.' },
        { id: 'generate', role: 'user', template: `Generate {{count}} taglines for:\n\nBrand: {{company}} ({{industry}})\nOffer: {{whatYouDo}}\nCustomer: {{targetCustomer}}\nPersonality: {{brandPersonality}}\nUnique value: {{uniqueValue}}\n\nCreate {{count}} tagline options using different approaches:\n- Benefit-focused\n- Emotional\n- Action/imperative\n- Question format\n- Contrast\n- Aspiration\n\nFor each: tagline + brief note on the angle used. Mark top 3 recommendations.` },
      ],
      outputFormat: 'text', maxTokens: 800, temperature: 0.8,
    },
    exportConfig: { pdfTemplate: COPY_TEMPLATE, docxTemplate: COPY_TEMPLATE, fileNameTemplate: 'Taglines-{{company}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Tagline Generator — Brand Slogan Ideas | AIFreeTools', descriptionTemplate: 'Generate memorable brand taglines and slogans with AI. Get 10 options instantly. Free tagline generator for businesses.', primaryKeyword: 'tagline generator', keywords: ['tagline generator', 'slogan generator', 'brand tagline ideas', 'business slogan generator', 'company tagline creator'], faqCount: 5, generateStatePages: false, articleTopics: ['how to create a brand tagline', 'examples of great brand slogans', 'tagline vs slogan vs brand promise'], relatedTools: ['mission-statement-generator', 'product-description-generator', 'bio-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['99designs', 'fiverr', 'squarespace'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'copy' },
  },
];
