export const COPYWRITING_PROMPTS = {
  'cover-letter-generator': {
    user: `Write a compelling cover letter.

**Applicant Details:**
- Name: {{applicantName}}
- Email: {{applicantEmail}}
- Phone: {{applicantPhone}}
- LinkedIn: {{linkedinUrl}}

**Job Details:**
- Position: {{position}}
- Company: {{companyName}}
- Hiring Manager: {{hiringManager}}
- Job Description Key Points: {{jobDescription}}

**Applicant Background:**
- Current Role: {{currentRole}}
- Years of Experience: {{yearsExperience}}
- Key Achievements: {{keyAchievements}}
- Skills to Highlight: {{skills}}

**Tone:** {{tone}}

Write a powerful, personalized cover letter using the STAR method for examples. Hook with an impactful opening, connect experience directly to job requirements, quantify achievements, and close with a confident call-to-action. 3-4 paragraphs, max 400 words.`,
  },

  'cold-email-generator': {
    user: `Write a high-converting cold email sequence.

**Sender Details:**
- Sender Name: {{senderName}}
- Company: {{senderCompany}}
- Value Proposition: {{valueProposition}}

**Target:**
- Recipient Title/Role: {{recipientRole}}
- Target Industry: {{targetIndustry}}
- Pain Point to Address: {{painPoint}}
- Desired Outcome: {{desiredOutcome}}

**Email Type:** {{emailType}}

Write a cold email using the {{emailFramework}} framework. Include: subject line (A/B test 2 options), personalized opening, clear value proposition, social proof, specific CTA, and PS line. Keep under 150 words for the body. Also provide a 3-email follow-up sequence with timing recommendations.`,
  },

  'ad-copy-generator': {
    user: `Write high-converting ad copy.

**Product/Service:**
- Name: {{productName}}
- Category: {{productCategory}}
- Price/Offer: {{priceOffer}}
- Key Benefit: {{keyBenefit}}

**Target Audience:**
- Demographics: {{demographics}}
- Pain Points: {{painPoints}}
- Desires: {{desires}}

**Ad Platform:** {{adPlatform}}
**Ad Format:** {{adFormat}}
**Tone:** {{tone}}

Generate {{numberOfVariants}} ad copy variants using different hooks (curiosity, fear, benefit, social proof). For each variant provide: headline (under 30 chars for Google, 40 for Facebook), primary text, description, and CTA button text. Include copy for A/B testing recommendations.`,
  },

  'blog-post-generator': {
    user: `Write a comprehensive, SEO-optimized blog post.

**Blog Details:**
- Topic: {{topic}}
- Target Keyword: {{targetKeyword}}
- Secondary Keywords: {{secondaryKeywords}}
- Target Audience: {{targetAudience}}
- Word Count Target: {{wordCount}}
- Tone: {{tone}}
- Industry: {{industry}}

**Content Goals:**
- Primary Goal: {{contentGoal}}
- Call to Action: {{callToAction}}

Write a complete blog post with: SEO-optimized title (include keyword), compelling meta description (155 chars), introduction with hook, {{numberOfSections}} main sections with H2/H3 headers, relevant examples and data points, FAQ section (5 questions), and strong conclusion with CTA. Optimize for featured snippets.`,
  },

  'product-description-generator': {
    user: `Write compelling product descriptions.

**Product Details:**
- Product Name: {{productName}}
- Category: {{productCategory}}
- Price: ${{price}}
- Key Features: {{keyFeatures}}
- Materials/Specs: {{specifications}}
- Use Cases: {{useCases}}

**Target Customer:**
- Demographics: {{targetCustomer}}
- Pain Points: {{painPoints}}
- Decision Triggers: {{decisionTriggers}}

**Platform:** {{platform}}

Write {{numberOfVariants}} product description variants. Each should include: benefit-focused headline, emotional hook, feature-to-benefit bullets (5-7), social proof placeholder, technical specs section, and SEO-rich paragraph. Optimize for conversion using sensory language and urgency.`,
  },
} as const;
