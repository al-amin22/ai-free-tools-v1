export const BUSINESS_PROMPTS = {
  'business-plan-generator': {
    user: `Write a comprehensive business plan for the US market.

**Business Overview:**
- Business Name: {{businessName}}
- Industry: {{industry}}
- Business Model: {{businessModel}}
- Stage: {{businessStage}}
- Location: {{location}}{{#if state}} ({{stateName}}){{/if}}

**Market & Product:**
- Target Market: {{targetMarket}}
- Problem Solved: {{problemSolved}}
- Solution/Product: {{solution}}
- Unique Value Proposition: {{uvp}}

**Financials:**
- Startup Capital Needed: \$\{\{startupCapital}}
- Revenue Model: {{revenueModel}}
- 12-month Revenue Target: \$\{\{revenueTarget}}

**Team:**
{{teamInfo}}

Generate a complete business plan with: executive summary, company description, market analysis, competitive landscape, marketing strategy, operations plan, financial projections (3-year), funding requirements, and milestones/KPIs.`,
  },

  'swot-analysis-generator': {
    user: `Conduct a thorough SWOT analysis.

**Organization/Product Details:**
- Name: {{businessName}}
- Industry: {{industry}}
- Market Position: {{marketPosition}}
- Main Products/Services: {{products}}
- Target Market: {{targetMarket}}

**Context:**
- Main Competitors: {{competitors}}
- Recent Developments: {{recentDevelopments}}

Generate a comprehensive SWOT analysis with 5-7 items per quadrant, strategic implications for each finding, prioritized action recommendations, and a strategic roadmap based on the analysis. Use business frameworks and industry benchmarks.`,
  },

  'marketing-plan-generator': {
    user: `Create a comprehensive digital marketing plan for the US market.

**Business Details:**
- Business Name: {{businessName}}
- Industry: {{industry}}
- Target Market: {{targetMarket}}
- Marketing Budget: \$\{\{marketingBudget}}/month
- Primary Goal: {{primaryGoal}}

**Current Situation:**
- Current Monthly Revenue: \$\{\{currentRevenue}}
- Current Channels: {{currentChannels}}
- Main Competitors: {{competitors}}

**Timeline:** {{timeline}}

Generate a complete marketing plan with: market analysis, buyer persona, channel strategy (SEO, PPC, social, email, content), content calendar framework, budget allocation by channel, KPIs and measurement framework, and 90-day action plan.`,
  },

  'meeting-agenda-generator': {
    user: `Create a structured meeting agenda.

**Meeting Details:**
- Meeting Title: {{meetingTitle}}
- Date & Time: {{meetingDateTime}}
- Duration: {{duration}} minutes
- Location/Platform: {{location}}
- Facilitator: {{facilitator}}
- Attendees: {{attendees}}

**Meeting Purpose:**
{{meetingPurpose}}

**Topics to Cover:**
{{topics}}

**Pre-read Materials:**
{{preReadMaterials}}

Generate a professional meeting agenda with: objectives, timed agenda items, discussion questions for each item, action item tracking section, decision log template, and parking lot section. Include pre-meeting prep checklist.`,
  },
} as const;
