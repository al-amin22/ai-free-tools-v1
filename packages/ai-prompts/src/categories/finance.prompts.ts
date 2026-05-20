export const FINANCE_PROMPTS = {
  'invoice-generator': {
    user: `Generate a professional invoice.

**Invoice Details:**
- Invoice Number: {{invoiceNumber}}
- Invoice Date: {{invoiceDate}}
- Due Date: {{dueDate}}
- Payment Terms: {{paymentTerms}}

**From:**
- Business Name: {{businessName}}
- Address: {{businessAddress}}
- Email: {{businessEmail}}
- Phone: {{businessPhone}}

**Bill To:**
- Client Name: {{clientName}}
- Client Address: {{clientAddress}}

**Line Items:**
{{lineItems}}

**Tax Rate:** {{taxRate}}%

Generate a professional invoice in markdown table format with line items, subtotal, tax calculation, and total. Include payment instructions and late fee policy if applicable.`,
  },

  'business-budget-planner': {
    user: `Create a comprehensive business budget plan.

**Business Details:**
- Business Name: {{businessName}}
- Industry: {{industry}}
- Business Stage: {{businessStage}}
- Planning Period: {{planningPeriod}}

**Revenue Sources:**
{{revenueSources}}

**Fixed Expenses:**
{{fixedExpenses}}

**Variable Expenses:**
{{variableExpenses}}

**Financial Goals:**
{{financialGoals}}

Generate a detailed budget plan with monthly projections, expense categories, break-even analysis, cash flow summary, and variance tracking columns. Include key financial ratios and recommendations.`,
  },

  'break-even-calculator': {
    user: `Perform a comprehensive break-even analysis.

**Business Information:**
- Business/Product Name: {{businessName}}
- Industry: {{industry}}

**Cost Structure:**
- Fixed Monthly Costs: \$\{\{fixedCosts}}
- Variable Cost per Unit: \$\{\{variableCostPerUnit}}
- Selling Price per Unit: \$\{\{sellingPrice}}

**Additional Context:**
{{additionalContext}}

Generate a complete break-even analysis with: break-even point in units and dollars, contribution margin, margin of safety, payback period estimate, sensitivity analysis table (±20% price/cost scenarios), and actionable recommendations.`,
  },

  'financial-projections': {
    user: `Create detailed 3-year financial projections.

**Business Details:**
- Business Name: {{businessName}}
- Industry: {{industry}}
- Business Stage: {{businessStage}}
- Business Model: {{businessModel}}

**Current Financials:**
- Current Monthly Revenue: \$\{\{currentRevenue}}
- Current Monthly Expenses: \$\{\{currentExpenses}}

**Growth Assumptions:**
- Revenue Growth Rate: {{revenueGrowth}}% annually
- Key Revenue Drivers: {{revenueDrivers}}

**Investment Plans:**
{{investmentPlans}}

Generate 36-month financial projections with: income statement, cash flow statement, balance sheet summary, key metrics dashboard (MRR, ARR, burn rate, runway), and scenario analysis (conservative/base/optimistic).`,
  },
} as const;
