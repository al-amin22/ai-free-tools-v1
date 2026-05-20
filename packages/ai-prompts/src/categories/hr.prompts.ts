export const HR_PROMPTS = {
  'job-description-generator': {
    user: `Write a compelling, inclusive job description for the following position in {{stateName}}{{#if state}} ({{state}}){{/if}}.

**Position Details:**
- Job Title: {{jobTitle}}
- Department: {{department}}
- Employment Type: {{employmentType}}
- Experience Level: {{experienceLevel}}
- Salary Range: {{salaryRange}}
- Remote/Hybrid/Onsite: {{workArrangement}}

**Role Overview:**
{{roleOverview}}

**Key Responsibilities (list provided):**
{{responsibilities}}

**Required Qualifications:**
{{qualifications}}

**Preferred Qualifications:**
{{preferredQualifications}}

Generate a professional, EEO-compliant job description with compelling overview, clear responsibilities, requirements, and benefits section. Use inclusive language and avoid age/gender/disability bias.`,
  },

  'resignation-letter-generator': {
    user: `Write a professional resignation letter.

**Details:**
- Employee Name: {{employeeName}}
- Position: {{position}}
- Manager Name: {{managerName}}
- Company Name: {{companyName}}
- Last Day: {{lastDay}}
- Notice Period: {{noticePeriod}}
- Reason (optional): {{reason}}
- Tone: {{tone}}

Generate a professional, gracious resignation letter that maintains the relationship, offers appropriate transition support, and closes on a positive note.`,
  },

  'performance-review-generator': {
    user: `Write a comprehensive performance review for the following employee.

**Employee Details:**
- Employee Name: {{employeeName}}
- Position: {{position}}
- Review Period: {{reviewPeriod}}
- Department: {{department}}
- Manager: {{managerName}}

**Performance Assessment:**
- Overall Rating: {{overallRating}}/5
- Key Achievements: {{achievements}}
- Areas for Improvement: {{improvements}}
- Goals Met: {{goalsMet}}

**Development:**
- Next Period Goals: {{nextGoals}}
- Development Plan: {{developmentPlan}}

Generate a balanced, specific, and actionable performance review using the STAR method for examples, with clear ratings justification, recognition of strengths, constructive improvement feedback, and SMART goals for the next period.`,
  },

  'job-offer-letter-generator': {
    user: `Draft a professional job offer letter.

**Company Details:**
- Company Name: {{companyName}}
- Hiring Manager: {{hiringManager}}
- HR Contact: {{hrContact}}

**Offer Details:**
- Candidate Name: {{candidateName}}
- Position: {{position}}
- Department: {{department}}
- Start Date: {{startDate}}
- Salary: \$\{\{salary}} {{salaryFrequency}}
- Employment Type: {{employmentType}}
- Work Location: {{workLocation}}

**Benefits:**
{{benefits}}

**Contingencies:**
- Background check required: {{backgroundCheck}}
- Drug test required: {{drugTest}}

Generate a warm, professional offer letter with all compensation details, contingencies, response deadline ({{responseDeadline}} days), and at-will employment statement.`,
  },

  'pip-generator': {
    user: `Draft a Performance Improvement Plan (PIP) for the following situation.

**Employee Details:**
- Employee Name: {{employeeName}}
- Position: {{position}}
- Department: {{department}}
- Manager: {{managerName}}
- HR Representative: {{hrName}}
- PIP Start Date: {{startDate}}
- PIP Duration: {{duration}} days

**Performance Issues:**
{{performanceIssues}}

**Previous Coaching:**
{{previousCoaching}}

**Improvement Goals (SMART):**
{{improvementGoals}}

**Support Provided:**
{{support}}

Generate a fair, specific, legally defensible PIP with measurable goals, clear timelines, defined consequences, support resources, and signature blocks for employee acknowledgment.`,
  },
} as const;
