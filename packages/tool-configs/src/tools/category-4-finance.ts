import type { ToolConfig } from '@aifreetools/shared-types';
import { US_STATES, FINANCE_TEMPLATE, LEGAL_TEMPLATE } from '../constants';

export const CATEGORY_4_TOOLS: ToolConfig[] = [
  {
    id: 'invoice-generator', slug: 'invoice-generator', name: 'Free Invoice Generator', shortName: 'Invoice Generator',
    category: 'finance-tax', description: 'Generate professional invoices with automatic tax calculation, payment reminders, and recurring invoice support.', tagline: 'Create professional invoices and get paid faster.', icon: 'file-text', sortOrder: 29, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Your Business Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'businessEmail', type: 'email', label: 'Your Email', required: true },
        { id: 'clientName', type: 'text', label: 'Client Name/Company', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'clientEmail', type: 'email', label: 'Client Email', required: false },
        { id: 'invoiceNumber', type: 'text', label: 'Invoice Number', required: false, defaultValue: 'INV-001' },
        { id: 'invoiceDate', type: 'date', label: 'Invoice Date', required: false },
        { id: 'dueDate', type: 'date', label: 'Due Date', required: false },
        { id: 'items', type: 'textarea', label: 'Services/Items (one per line: Description | Qty | Unit Price)', required: true, validation: { minLength: 5, maxLength: 2000 }, placeholder: 'Web Design Services | 1 | 2500\nMonthly Retainer | 1 | 1000' },
        { id: 'taxRate', type: 'percentage', label: 'Tax Rate (%)', required: false, defaultValue: '0', validation: { min: 0, max: 30 } },
        { id: 'currency', type: 'select', label: 'Currency', required: true, defaultValue: 'USD', options: [{ value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'GBP', label: 'GBP (£)' }, { value: 'CAD', label: 'CAD ($)' }] },
        { id: 'paymentTerms', type: 'select', label: 'Payment Terms', required: false, defaultValue: 'net_30', options: [{ value: 'due_on_receipt', label: 'Due on Receipt' }, { value: 'net_15', label: 'Net 15' }, { value: 'net_30', label: 'Net 30' }, { value: 'net_60', label: 'Net 60' }] },
        { id: 'notes', type: 'textarea', label: 'Notes / Payment Instructions', required: false, validation: { maxLength: 500 } },
      ],
      groups: [
        { id: 'from', title: 'From', fieldIds: ['businessName', 'businessEmail'] },
        { id: 'to', title: 'Bill To', fieldIds: ['clientName', 'clientEmail'] },
        { id: 'invoice', title: 'Invoice Details', fieldIds: ['invoiceNumber', 'invoiceDate', 'dueDate', 'paymentTerms'] },
        { id: 'items_section', title: 'Items & Services', fieldIds: ['items', 'taxRate', 'currency'] },
        { id: 'notes_section', title: 'Notes', fieldIds: ['notes'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a professional invoicing specialist. Generate clear, professional invoices with proper formatting and accurate calculations.' },
        { id: 'generate', role: 'user', template: `Generate a professional invoice:\n\nFrom: {{businessName}} ({{businessEmail}})\nBill To: {{clientName}} ({{clientEmail}})\nInvoice #: {{invoiceNumber}}\nDate: {{invoiceDate}}\nDue: {{dueDate}}\nTerms: {{paymentTerms}}\nItems:\n{{items}}\nTax: {{taxRate}}%\nCurrency: {{currency}}\nNotes: {{notes}}\n\nFormat as a professional invoice with itemized breakdown, subtotal, tax, total, and payment instructions. Calculate all amounts correctly.` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.1,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'Invoice-{{invoiceNumber}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Invoice Generator — Professional Invoices in Seconds | AIFreeTools', descriptionTemplate: 'Generate professional invoices with automatic tax calculation. Free AI-powered invoice maker. Download as PDF.', primaryKeyword: 'free invoice generator', keywords: ['free invoice generator', 'invoice maker', 'online invoice creator', 'invoice template free', 'professional invoice generator'], faqCount: 7, generateStatePages: false, articleTopics: ['how to create an invoice', 'invoice payment terms explained', 'freelance invoicing best practices'], relatedTools: ['freelance-tax-estimator', 'freelance-contract-generator', 'budget-planner'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['freshbooks', 'quickbooks', 'wave', 'stripe'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'freelancer-tax-estimator', slug: 'freelancer-tax-estimator', name: 'Free Freelancer Tax Estimator', shortName: 'Tax Estimator',
    category: 'finance-tax', description: 'Estimate your freelancer taxes including self-employment tax, quarterly payments, and top deductions to maximize savings.', tagline: 'Know exactly what you owe before tax season hits.', icon: 'percent', sortOrder: 30, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'annualIncome', type: 'currency', label: 'Expected Annual Freelance Income ($)', required: true, validation: { min: 1 } },
        { id: 'otherIncome', type: 'currency', label: 'Other Income (W2, etc.) ($)', required: false, validation: { min: 0 } },
        { id: 'businessExpenses', type: 'currency', label: 'Estimated Business Expenses ($)', required: false, validation: { min: 0 } },
        { id: 'filingStatus', type: 'select', label: 'Filing Status', required: true, options: [{ value: 'single', label: 'Single' }, { value: 'married_jointly', label: 'Married Filing Jointly' }, { value: 'married_separately', label: 'Married Filing Separately' }, { value: 'hoh', label: 'Head of Household' }] },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
        { id: 'hasHomeOffice', type: 'toggle', label: 'Home Office Deduction?', defaultValue: false },
        { id: 'hasRetirementPlan', type: 'toggle', label: 'Solo 401k or SEP-IRA?', defaultValue: false },
        { id: 'healthInsurance', type: 'currency', label: 'Self-Employed Health Insurance Premiums ($)', required: false, validation: { min: 0 } },
      ],
      groups: [
        { id: 'income', title: 'Income', fieldIds: ['annualIncome', 'otherIncome', 'businessExpenses'] },
        { id: 'personal', title: 'Personal Info', fieldIds: ['filingStatus', 'state'] },
        { id: 'deductions', title: 'Deductions', fieldIds: ['hasHomeOffice', 'hasRetirementPlan', 'healthInsurance'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a CPA specializing in freelancer and self-employment taxes. Provide accurate tax estimates with practical deduction advice. Always note this is an estimate and recommend consulting a tax professional.' },
        { id: 'generate', role: 'user', template: `Estimate taxes for freelancer:\n\nFreelance Income: ${{annualIncome}}\nOther Income: ${{otherIncome}}\nBusiness Expenses: ${{businessExpenses}}\nFiling: {{filingStatus}}\nState: {{state}}\nHome Office: {{hasHomeOffice}}\nRetirement Plan: {{hasRetirementPlan}}\nHealth Insurance: ${{healthInsurance}}\n\nProvide:\n1. Gross income, deductions, taxable income\n2. Federal income tax estimate\n3. Self-employment tax (15.3%)\n4. State tax estimate for {{state}}\n5. Total estimated tax\n6. Quarterly payment amounts (Q1-Q4)\n7. Effective tax rate\n8. Top 5 deductions they should maximize\n9. Retirement contribution recommendation\n10. Important deadlines\n\nShow all calculations clearly.` },
      ],
      outputFormat: 'text', maxTokens: 2000, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'Freelancer-Tax-Estimate', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Freelancer Tax Estimator — Know Your 1099 Taxes | AIFreeTools', descriptionTemplate: 'Estimate your freelancer taxes including self-employment tax and quarterly payments. Get top deduction tips. Free AI tax calculator.', primaryKeyword: 'freelancer tax estimator', keywords: ['freelancer tax calculator', 'self-employment tax calculator', '1099 tax estimator', 'freelance tax estimator', 'quarterly tax calculator'], faqCount: 8, generateStatePages: true, articleTopics: ['freelancer tax guide', 'quarterly tax payments explained', 'top freelancer tax deductions', 'self-employment tax explained'], relatedTools: ['self-employment-tax-calculator', 'w4-withholding-calculator', '1099-vs-w2-calculator'], searchIntent: 'informational' },
    monetizationConfig: { affiliatePartners: ['turbotax', 'h-and-r-block', 'quickbooks-self-employed', 'freshbooks'], adPlacements: ['header', 'post-result', 'sidebar', 'in-content'], upsellTrigger: 'export', leadGenCTA: 'File your taxes confidently. Try TurboTax Self-Employed.' },
  },
  {
    id: 'budget-planner', slug: 'budget-planner', name: 'Free Budget Planner', shortName: 'Budget Planner',
    category: 'finance-tax', description: 'Create a personalized monthly budget plan with AI-powered spending analysis and savings recommendations.', tagline: 'Take control of your finances with an AI-powered budget.', icon: 'pie-chart', sortOrder: 31, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'monthlyIncome', type: 'currency', label: 'Monthly Take-Home Income ($)', required: true, validation: { min: 1 } },
        { id: 'additionalIncome', type: 'currency', label: 'Additional Monthly Income ($)', required: false, validation: { min: 0 } },
        { id: 'housing', type: 'currency', label: 'Housing (rent/mortgage) ($)', required: true, validation: { min: 0 } },
        { id: 'transportation', type: 'currency', label: 'Transportation ($)', required: false, validation: { min: 0 } },
        { id: 'food', type: 'currency', label: 'Food & Groceries ($)', required: false, validation: { min: 0 } },
        { id: 'utilities', type: 'currency', label: 'Utilities ($)', required: false, validation: { min: 0 } },
        { id: 'insurance', type: 'currency', label: 'Insurance ($)', required: false, validation: { min: 0 } },
        { id: 'subscriptions', type: 'currency', label: 'Subscriptions/Entertainment ($)', required: false, validation: { min: 0 } },
        { id: 'debtPayments', type: 'currency', label: 'Debt Payments ($)', required: false, validation: { min: 0 } },
        { id: 'savingsGoal', type: 'currency', label: 'Monthly Savings Goal ($)', required: false, validation: { min: 0 } },
        { id: 'financialGoal', type: 'select', label: 'Primary Financial Goal', required: true, options: [{ value: 'save_emergency', label: 'Build Emergency Fund' }, { value: 'pay_debt', label: 'Pay Off Debt' }, { value: 'save_home', label: 'Save for Home' }, { value: 'invest', label: 'Invest More' }, { value: 'general_savings', label: 'General Savings' }] },
      ],
      groups: [
        { id: 'income', title: 'Income', fieldIds: ['monthlyIncome', 'additionalIncome'] },
        { id: 'expenses', title: 'Monthly Expenses', fieldIds: ['housing', 'transportation', 'food', 'utilities', 'insurance', 'subscriptions', 'debtPayments'] },
        { id: 'goals', title: 'Goals', fieldIds: ['savingsGoal', 'financialGoal'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a certified financial planner. Create practical, personalized budget plans that help people achieve their financial goals.' },
        { id: 'generate', role: 'user', template: `Create a monthly budget plan:\n\nIncome: ${{monthlyIncome}} + ${{additionalIncome}}\nHousing: ${{housing}}\nTransportation: ${{transportation}}\nFood: ${{food}}\nUtilities: ${{utilities}}\nInsurance: ${{insurance}}\nSubscriptions: ${{subscriptions}}\nDebt Payments: ${{debtPayments}}\nSavings Goal: ${{savingsGoal}}\nGoal: {{financialGoal}}\n\nProvide:\n1. Complete budget breakdown (income, all expenses, surplus/deficit)\n2. Budget ratios (housing %, savings %, etc.) vs. 50/30/20 rule\n3. Surplus or deficit analysis\n4. Top 3 areas to reduce spending\n5. Actionable plan to achieve {{financialGoal}}\n6. Monthly and yearly projections toward goal\n7. Emergency fund status and recommendation\n8. Priority action list` },
      ],
      outputFormat: 'text', maxTokens: 2000, temperature: 0.3,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'Monthly-Budget-Plan', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Budget Planner — AI-Powered Monthly Budget Calculator | AIFreeTools', descriptionTemplate: 'Create a personalized monthly budget with AI spending analysis and savings recommendations. Free budget planning tool.', primaryKeyword: 'free budget planner', keywords: ['budget planner', 'monthly budget calculator', 'personal budget planner', 'budget spreadsheet free', 'budget planning tool'], faqCount: 7, generateStatePages: false, articleTopics: ['50/30/20 budget rule', 'how to create a monthly budget', 'budgeting for beginners', 'best budgeting strategies'], relatedTools: ['debt-payoff-calculator', 'freelancer-tax-estimator', 'rent-vs-buy-calculator'], searchIntent: 'informational' },
    monetizationConfig: { affiliatePartners: ['ynab', 'mint', 'personal-capital', 'rocket-money'], adPlacements: ['header', 'post-result', 'sidebar', 'in-content'], upsellTrigger: 'export' },
  },
  {
    id: 'debt-payoff-calculator', slug: 'debt-payoff-calculator', name: 'Free Debt Payoff Calculator', shortName: 'Debt Payoff Calculator',
    category: 'finance-tax', description: 'Calculate your debt payoff timeline using snowball or avalanche method with AI-powered strategy recommendations.', tagline: 'Find the fastest path to becoming debt-free.', icon: 'trending-down', sortOrder: 32, isFeatured: true,
    formSchema: {
      fields: [
        { id: 'debts', type: 'textarea', label: 'Debts (Name | Balance | Interest Rate | Min Payment)', required: true, validation: { minLength: 10, maxLength: 2000 }, placeholder: 'Credit Card 1 | 5000 | 22.9% | 150\nStudent Loan | 25000 | 6.8% | 300\nCar Loan | 12000 | 4.9% | 250' },
        { id: 'extraPayment', type: 'currency', label: 'Extra Monthly Payment Available ($)', required: false, validation: { min: 0 } },
        { id: 'strategy', type: 'radio', label: 'Payoff Strategy', required: true, defaultValue: 'avalanche', options: [{ value: 'avalanche', label: 'Avalanche (Highest Interest First — saves most money)' }, { value: 'snowball', label: 'Snowball (Smallest Balance First — fastest wins)' }] },
      ],
      groups: [{ id: 'debts_group', title: 'Your Debts', fieldIds: ['debts', 'extraPayment', 'strategy'] }],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a debt counselor and financial planner. Calculate debt payoff scenarios with precision and provide motivating, practical advice.' },
        { id: 'generate', role: 'user', template: `Calculate debt payoff plan:\n\nDebts:\n{{debts}}\nExtra Payment: ${{extraPayment}}/month\nStrategy: {{strategy}}\n\nProvide:\n1. Current debt summary (total, total monthly minimums, total interest if minimums only)\n2. {{strategy}} payoff order with reasoning\n3. Month-by-month payoff sequence\n4. Payoff timeline with extra payment\n5. Total interest saved vs. minimums-only\n6. Debt-free date\n7. Comparison of both strategies\n8. Practical tips to find extra money to accelerate payoff\n9. Motivation: what you can do with that money when debt-free` },
      ],
      outputFormat: 'text', maxTokens: 2000, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'Debt-Payoff-Plan', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Debt Payoff Calculator — Snowball vs Avalanche | AIFreeTools', descriptionTemplate: 'Calculate your debt-free date using snowball or avalanche method. See exactly how much you\'ll save. Free AI debt payoff calculator.', primaryKeyword: 'debt payoff calculator', keywords: ['debt payoff calculator', 'debt snowball calculator', 'debt avalanche calculator', 'get out of debt calculator', 'credit card payoff calculator'], faqCount: 7, generateStatePages: false, articleTopics: ['debt snowball vs avalanche', 'how to pay off debt fast', 'debt payoff strategies compared', 'getting out of credit card debt'], relatedTools: ['budget-planner', 'freelancer-tax-estimator', 'financial-hardship-letter-generator'], searchIntent: 'informational' },
    monetizationConfig: { affiliatePartners: ['national-debt-relief', 'creditkarma', 'nerdwallet', 'sofi'], adPlacements: ['header', 'post-result', 'sidebar', 'in-content'], upsellTrigger: 'export', leadGenCTA: 'Could debt consolidation save you money? Compare rates for free.' },
  },
  {
    id: '1099-vs-w2-calculator', slug: '1099-vs-w2-calculator', name: '1099 vs W2 Calculator', shortName: '1099 vs W2 Calculator',
    category: 'finance-tax', description: 'Compare 1099 contractor income vs W2 employment income to make an informed work arrangement decision.', tagline: 'Is that 1099 offer actually better than your W2 job?', icon: 'scale', sortOrder: 33, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'w2Salary', type: 'currency', label: 'W2 Annual Salary ($)', required: false, validation: { min: 0 } },
        { id: 'w2Benefits', type: 'currency', label: 'W2 Benefits Value (Health, 401k, etc.) ($)', required: false, validation: { min: 0 }, placeholder: 'Estimated value of employer-provided benefits' },
        { id: 'contractorRate', type: 'currency', label: '1099 Annual Income ($)', required: false, validation: { min: 0 } },
        { id: 'contractorExpenses', type: 'currency', label: '1099 Business Expenses ($)', required: false, validation: { min: 0 } },
        { id: 'filingStatus', type: 'select', label: 'Filing Status', required: true, options: [{ value: 'single', label: 'Single' }, { value: 'married_jointly', label: 'Married Filing Jointly' }] },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
      ],
      groups: [
        { id: 'w2', title: 'W2 Employment', fieldIds: ['w2Salary', 'w2Benefits'] },
        { id: 'contractor', title: '1099 Contractor', fieldIds: ['contractorRate', 'contractorExpenses'] },
        { id: 'personal', title: 'Personal', fieldIds: ['filingStatus', 'state'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a tax professional and compensation analyst. Compare W2 vs 1099 income scenarios with full tax implications and real total compensation.' },
        { id: 'generate', role: 'user', template: `Compare W2 vs 1099:\n\nW2 Salary: ${{w2Salary}}\nW2 Benefits: ${{w2Benefits}}\n1099 Income: ${{contractorRate}}\n1099 Expenses: ${{contractorExpenses}}\nFiling: {{filingStatus}}\nState: {{state}}\n\nCompare:\n1. W2 total comp (salary + benefits)\n2. 1099 true income after expenses\n3. W2 tax burden (FICA, federal, state)\n4. 1099 tax burden (SE tax, federal, state)\n5. W2 net take-home vs 1099 net take-home\n6. Break-even rate (what 1099 rate equals W2 comp)\n7. Recommendation with reasoning\n8. Non-financial factors to consider (stability, flexibility, etc.)` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: '1099-vs-W2-Comparison', pageSize: 'letter' },
    seoConfig: { titleTemplate: '1099 vs W2 Calculator — Which is Better for You? | AIFreeTools', descriptionTemplate: 'Compare 1099 contractor vs W2 employee income with full tax analysis. Find your true take-home pay. Free AI calculator.', primaryKeyword: '1099 vs w2 calculator', keywords: ['1099 vs w2 calculator', 'contractor vs employee calculator', '1099 tax comparison', 'should i take 1099 or w2', 'contractor rate calculator'], faqCount: 6, generateStatePages: true, articleTopics: ['1099 vs w2 explained', 'tax differences contractor vs employee', 'benefits of being a contractor'], relatedTools: ['freelancer-tax-estimator', 'self-employment-tax-calculator', 'independent-contractor-agreement-generator'], searchIntent: 'informational' },
    monetizationConfig: { affiliatePartners: ['turbotax', 'h-and-r-block', 'deel'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'profit-loss-generator', slug: 'profit-loss-generator', name: 'Free Profit & Loss Statement Generator', shortName: 'P&L Generator',
    category: 'finance-tax', description: 'Generate a professional Profit & Loss statement for your business with AI-powered financial insights and trend analysis.', tagline: 'Create a professional P&L statement in minutes.', icon: 'bar-chart-2', sortOrder: 34, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'period', type: 'text', label: 'Reporting Period', required: true, placeholder: 'e.g. January 2026 or Q1 2026' },
        { id: 'revenue', type: 'textarea', label: 'Revenue Sources (Name | Amount)', required: true, validation: { minLength: 5, maxLength: 1000 }, placeholder: 'Product Sales | 50000\nService Revenue | 25000' },
        { id: 'cogs', type: 'currency', label: 'Cost of Goods Sold (COGS) ($)', required: false, validation: { min: 0 } },
        { id: 'expenses', type: 'textarea', label: 'Operating Expenses (Name | Amount)', required: true, validation: { minLength: 5, maxLength: 1000 }, placeholder: 'Salaries | 20000\nRent | 3000\nMarketing | 2000' },
        { id: 'taxes', type: 'currency', label: 'Tax Expense ($)', required: false, validation: { min: 0 } },
      ],
      groups: [
        { id: 'basics', title: 'Business Info', fieldIds: ['businessName', 'period'] },
        { id: 'financials', title: 'Financials', fieldIds: ['revenue', 'cogs', 'expenses', 'taxes'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a CPA and financial analyst. Generate professional P&L statements with accurate calculations and insightful financial analysis.' },
        { id: 'generate', role: 'user', template: `Generate a P&L Statement:\n\nBusiness: {{businessName}}\nPeriod: {{period}}\nRevenue:\n{{revenue}}\nCOGS: ${{cogs}}\nExpenses:\n{{expenses}}\nTaxes: ${{taxes}}\n\nCreate a complete P&L with: Revenue section, COGS, Gross Profit, Operating Expenses breakdown, EBITDA, Net Income/Loss. Include: gross margin %, operating margin %, net margin %. Add 3-5 key financial insights and recommendations.` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'PL-Statement-{{businessName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Profit & Loss Statement Generator — AI P&L | AIFreeTools', descriptionTemplate: 'Generate a professional P&L statement for your business with AI financial insights. Free PDF download.', primaryKeyword: 'profit and loss statement generator', keywords: ['profit and loss generator', 'p&l statement template', 'income statement generator', 'small business p&l', 'p&l statement maker'], faqCount: 6, generateStatePages: false, articleTopics: ['what is a p&l statement', 'how to read a p&l', 'p&l vs balance sheet'], relatedTools: ['invoice-generator', 'budget-planner', 'business-expense-tracker'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['quickbooks', 'freshbooks', 'xero', 'wave'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'business-expense-tracker', slug: 'business-expense-tracker', name: 'Free Business Expense Tracker', shortName: 'Expense Tracker',
    category: 'finance-tax', description: 'Track and categorize business expenses with AI-powered spending analysis and tax deduction identification.', tagline: 'Track expenses and maximize your tax deductions.', icon: 'credit-card', sortOrder: 35, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'businessName', type: 'text', label: 'Business Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'period', type: 'text', label: 'Reporting Period', required: true, placeholder: 'e.g. Q1 2026 or January 2026' },
        { id: 'businessType', type: 'select', label: 'Business Type', required: true, options: [{ value: 'freelancer', label: 'Freelancer/Sole Proprietor' }, { value: 'llc', label: 'LLC' }, { value: 'corporation', label: 'Corporation' }, { value: 'partnership', label: 'Partnership' }] },
        { id: 'expenses', type: 'textarea', label: 'Expenses (Date | Category | Description | Amount)', required: true, validation: { minLength: 10, maxLength: 3000 }, placeholder: '01/05 | Software | Adobe CC | 54.99\n01/10 | Travel | Client Meeting Uber | 23.50\n01/15 | Office | Desk Chair | 299.00' },
      ],
      groups: [{ id: 'expenses_group', title: 'Expense Data', fieldIds: ['businessName', 'period', 'businessType', 'expenses'] }],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a business accountant specializing in expense categorization and tax deductions. Analyze expenses and identify tax deduction opportunities.' },
        { id: 'generate', role: 'user', template: `Analyze business expenses:\n\nBusiness: {{businessName}} ({{businessType}})\nPeriod: {{period}}\nExpenses:\n{{expenses}}\n\nProvide:\n1. Categorized expense summary with totals\n2. Fully deductible vs. partially deductible breakdown\n3. IRS category classification (Schedule C categories)\n4. Top spending categories\n5. Tax deduction opportunities you may be missing\n6. Red flags or non-deductible items\n7. Recommendations for next period` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'Expense-Report-{{businessName}}', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Business Expense Tracker — AI Tax Deduction Finder | AIFreeTools', descriptionTemplate: 'Track and categorize business expenses with AI. Find hidden tax deductions. Free business expense tracking tool.', primaryKeyword: 'business expense tracker', keywords: ['business expense tracker', 'expense tracking tool', 'small business expense tracker', 'tax deduction tracker', 'freelance expense tracker'], faqCount: 6, generateStatePages: false, articleTopics: ['business expense deductions guide', 'what can i deduct as a freelancer', 'schedule c expense categories'], relatedTools: ['freelancer-tax-estimator', 'invoice-generator', 'profit-loss-generator'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['expensify', 'quickbooks', 'freshbooks', 'wave'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'financial-hardship-letter-generator', slug: 'financial-hardship-letter-generator', name: 'Free Financial Hardship Letter Generator', shortName: 'Hardship Letter Generator',
    category: 'finance-tax', description: 'Generate an empathetic, persuasive financial hardship letter for loan modifications, debt settlements, or payment plans.', tagline: 'Write a compelling hardship letter to negotiate better terms.', icon: 'heart', sortOrder: 36, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'borrowerName', type: 'text', label: 'Your Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'lenderName', type: 'text', label: 'Lender/Creditor Name', required: true, validation: { minLength: 2, maxLength: 200 } },
        { id: 'hardshipType', type: 'select', label: 'Purpose of Letter', required: true, options: [{ value: 'loan_modification', label: 'Mortgage Loan Modification' }, { value: 'forbearance', label: 'Forbearance Request' }, { value: 'debt_settlement', label: 'Debt Settlement' }, { value: 'payment_plan', label: 'Payment Plan Request' }, { value: 'student_loan', label: 'Student Loan Deferment' }] },
        { id: 'hardshipReason', type: 'select', label: 'Reason for Hardship', required: true, options: [{ value: 'job_loss', label: 'Job Loss/Layoff' }, { value: 'medical', label: 'Medical Emergency/Illness' }, { value: 'divorce', label: 'Divorce/Separation' }, { value: 'death', label: 'Death of Spouse/Co-borrower' }, { value: 'income_reduction', label: 'Income Reduction' }, { value: 'disaster', label: 'Natural Disaster' }] },
        { id: 'description', type: 'textarea', label: 'Describe Your Situation', required: true, validation: { minLength: 30, maxLength: 1000 } },
        { id: 'request', type: 'textarea', label: 'Specific Request', required: true, validation: { minLength: 10, maxLength: 500 }, placeholder: 'Describe exactly what you are requesting...' },
      ],
      groups: [
        { id: 'parties', title: 'Parties', fieldIds: ['borrowerName', 'lenderName', 'hardshipType'] },
        { id: 'hardship', title: 'Hardship Details', fieldIds: ['hardshipReason', 'description', 'request'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a financial counselor and debt negotiation specialist. Write empathetic but professional hardship letters that present a compelling case for accommodation.' },
        { id: 'generate', role: 'user', template: `Generate a financial hardship letter:\n\nFrom: {{borrowerName}}\nTo: {{lenderName}}\nPurpose: {{hardshipType}}\nReason: {{hardshipReason}}\nSituation: {{description}}\nRequest: {{request}}\n\nWrite an empathetic, professional letter that: explains the hardship clearly and honestly, demonstrates good faith, makes a specific, reasonable request, shows a path forward. Sincere and persuasive tone. Under 400 words.` },
      ],
      outputFormat: 'text', maxTokens: 800, temperature: 0.4,
    },
    exportConfig: { pdfTemplate: LEGAL_TEMPLATE, docxTemplate: LEGAL_TEMPLATE, fileNameTemplate: 'Financial-Hardship-Letter', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Financial Hardship Letter Generator — Negotiate Relief | AIFreeTools', descriptionTemplate: 'Generate a compelling financial hardship letter for loan modifications, debt settlements, or payment plans. Free AI-powered, PDF download.', primaryKeyword: 'financial hardship letter generator', keywords: ['financial hardship letter generator', 'hardship letter template', 'loan modification letter', 'debt settlement letter', 'forbearance request letter'], faqCount: 6, generateStatePages: false, articleTopics: ['how to write a hardship letter', 'mortgage modification process', 'negotiating debt with creditors'], relatedTools: ['debt-payoff-calculator', 'demand-letter-generator', 'budget-planner'], searchIntent: 'transactional' },
    monetizationConfig: { affiliatePartners: ['national-debt-relief', 'creditkarma', 'hud-housing-counselor'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'self-employment-tax-calculator', slug: 'self-employment-tax-calculator', name: 'Free Self Employment Tax Calculator', shortName: 'SE Tax Calculator',
    category: 'finance-tax', description: 'Calculate your self-employment tax and get AI-powered quarterly tax payment schedule and deduction recommendations.', tagline: 'Calculate your self-employment tax accurately.', icon: 'calculator', sortOrder: 37, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'netIncome', type: 'currency', label: 'Net Self-Employment Income ($)', required: true, validation: { min: 1 } },
        { id: 'filingStatus', type: 'select', label: 'Filing Status', required: true, options: [{ value: 'single', label: 'Single' }, { value: 'married_jointly', label: 'Married Filing Jointly' }] },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
        { id: 'otherIncome', type: 'currency', label: 'Other Income ($)', required: false, validation: { min: 0 } },
        { id: 'hasRetirement', type: 'toggle', label: 'Contributing to retirement (Solo 401k/SEP)?', defaultValue: false },
        { id: 'retirementContribution', type: 'currency', label: 'Retirement Contribution ($)', required: false, validation: { min: 0 }, showWhen: { field: 'hasRetirement', operator: 'equals', value: true } },
      ],
      groups: [
        { id: 'income', title: 'Income', fieldIds: ['netIncome', 'otherIncome'] },
        { id: 'details', title: 'Tax Details', fieldIds: ['filingStatus', 'state', 'hasRetirement', 'retirementContribution'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a CPA specializing in self-employment taxation. Provide accurate tax calculations with practical guidance.' },
        { id: 'generate', role: 'user', template: `Calculate self-employment taxes:\n\nNet SE Income: ${{netIncome}}\nOther Income: ${{otherIncome}}\nFiling: {{filingStatus}}\nState: {{state}}\nRetirement: ${{retirementContribution}}\n\nCalculate:\n1. Self-employment tax (15.3% up to SS wage base, 2.9% above)\n2. SE tax deduction (50% deduction)\n3. Federal income tax estimate\n4. State tax for {{state}}\n5. Total tax liability\n6. Quarterly payment schedule (dates + amounts)\n7. Effective tax rate\n8. Strategies to reduce SE tax burden` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'SE-Tax-Calculation', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free Self Employment Tax Calculator — Quarterly Taxes | AIFreeTools', descriptionTemplate: 'Calculate your self-employment tax with quarterly payment schedule. Free AI-powered SE tax calculator with deduction tips.', primaryKeyword: 'self employment tax calculator', keywords: ['self employment tax calculator', 'se tax calculator', 'self employed tax', 'quarterly tax payment calculator', 'fica self employed'], faqCount: 7, generateStatePages: true, articleTopics: ['self-employment tax explained', 'how to pay quarterly taxes', 'reducing self-employment tax'], relatedTools: ['freelancer-tax-estimator', 'w4-withholding-calculator', '1099-vs-w2-calculator'], searchIntent: 'informational' },
    monetizationConfig: { affiliatePartners: ['turbotax', 'h-and-r-block', 'quickbooks-self-employed'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
  {
    id: 'w4-withholding-calculator', slug: 'w4-withholding-calculator', name: 'Free W4 Withholding Calculator', shortName: 'W4 Calculator',
    category: 'finance-tax', description: 'Calculate the correct W4 withholding amounts to avoid underpayment penalties or getting a large refund.', tagline: 'Set your W4 correctly and optimize your take-home pay.', icon: 'sliders', sortOrder: 38, isFeatured: false,
    formSchema: {
      fields: [
        { id: 'annualSalary', type: 'currency', label: 'Annual Salary ($)', required: true, validation: { min: 1 } },
        { id: 'filingStatus', type: 'select', label: 'Filing Status', required: true, options: [{ value: 'single', label: 'Single / MFS' }, { value: 'married_jointly', label: 'Married Filing Jointly' }, { value: 'hoh', label: 'Head of Household' }] },
        { id: 'spouseIncome', type: 'currency', label: 'Spouse Annual Income ($)', required: false, validation: { min: 0 } },
        { id: 'dependents', type: 'number', label: 'Number of Dependents', required: false, defaultValue: 0, validation: { min: 0, max: 20 } },
        { id: 'otherIncome', type: 'currency', label: 'Other Income (investments, freelance) ($)', required: false, validation: { min: 0 } },
        { id: 'deductions', type: 'select', label: 'Expected Deductions', required: true, defaultValue: 'standard', options: [{ value: 'standard', label: 'Standard Deduction' }, { value: 'itemized', label: 'Itemize Deductions' }] },
        { id: 'itemizedAmount', type: 'currency', label: 'Itemized Deductions Total ($)', required: false, validation: { min: 0 }, showWhen: { field: 'deductions', operator: 'equals', value: 'itemized' } },
        { id: 'state', type: 'select', label: 'State', required: true, options: US_STATES },
        { id: 'goal', type: 'radio', label: 'Withholding Goal', required: true, defaultValue: 'break_even', options: [{ value: 'break_even', label: 'Break Even (owe/refund ~$0)' }, { value: 'refund', label: 'Get a Refund' }, { value: 'maximize_paycheck', label: 'Maximize Each Paycheck' }] },
      ],
      groups: [
        { id: 'income', title: 'Income', fieldIds: ['annualSalary', 'spouseIncome', 'otherIncome'] },
        { id: 'personal', title: 'Personal', fieldIds: ['filingStatus', 'dependents', 'deductions', 'itemizedAmount', 'state'] },
        { id: 'goal_section', title: 'Goal', fieldIds: ['goal'] },
      ],
    },
    promptConfig: {
      version: '1.0.0',
      steps: [
        { id: 'system', role: 'system', template: 'You are a payroll tax specialist and CPA. Provide accurate W4 withholding recommendations that help employees optimize their paychecks.' },
        { id: 'generate', role: 'user', template: `Calculate W4 withholding:\n\nSalary: ${{annualSalary}} + spouse: ${{spouseIncome}}\nOther income: ${{otherIncome}}\nFiling: {{filingStatus}}\nDependents: {{dependents}}\nDeductions: {{deductions}} {{#if itemizedAmount}}(${{itemizedAmount}}){{/if}}\nState: {{state}}\nGoal: {{goal}}\n\nProvide:\n1. Estimated annual federal tax liability\n2. Current withholding based on salary\n3. Recommended W4 settings (Step 3 child credits, Step 4 additional withholding/deductions)\n4. Estimated refund or amount owed\n5. How to fill in each W4 section\n6. State withholding recommendation for {{state}}\n7. Tips to achieve {{goal}} goal` },
      ],
      outputFormat: 'text', maxTokens: 1500, temperature: 0.2,
    },
    exportConfig: { pdfTemplate: FINANCE_TEMPLATE, docxTemplate: FINANCE_TEMPLATE, fileNameTemplate: 'W4-Withholding-Recommendation', pageSize: 'letter' },
    seoConfig: { titleTemplate: 'Free W4 Withholding Calculator — Optimize Your Paycheck | AIFreeTools', descriptionTemplate: 'Calculate the correct W4 withholding to maximize your paycheck or get a refund. Free AI-powered W4 calculator with step-by-step instructions.', primaryKeyword: 'w4 withholding calculator', keywords: ['w4 withholding calculator', 'how to fill out w4', 'w4 allowances calculator', 'paycheck withholding calculator', 'tax withholding estimator'], faqCount: 7, generateStatePages: true, articleTopics: ['how to fill out the w4 form', 'w4 vs w2 explained', 'adjusting withholding mid-year', 'maximize paycheck withholding'], relatedTools: ['freelancer-tax-estimator', 'self-employment-tax-calculator', '1099-vs-w2-calculator'], searchIntent: 'informational' },
    monetizationConfig: { affiliatePartners: ['turbotax', 'h-and-r-block', 'adp'], adPlacements: ['header', 'post-result', 'sidebar'], upsellTrigger: 'export' },
  },
];
