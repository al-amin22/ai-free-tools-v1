import Handlebars from 'handlebars';

Handlebars.registerHelper('ifEquals', function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
  return a === b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('join', function (arr: string[], sep: string) {
  return Array.isArray(arr) ? arr.join(sep ?? ', ') : arr;
});

Handlebars.registerHelper('uppercase', (str: string) => (str ?? '').toUpperCase());
Handlebars.registerHelper('lowercase', (str: string) => (str ?? '').toLowerCase());
Handlebars.registerHelper('capitalize', (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
);

export interface PromptVariables {
  state?: string;
  stateName?: string;
  [key: string]: unknown;
}

export function buildPrompt(template: string, variables: PromptVariables): string {
  const compiled = Handlebars.compile(template, { noEscape: true });
  return compiled(variables).trim();
}

export function buildMultiStepPrompt(
  steps: Array<{ role: 'system' | 'user' | 'assistant'; template: string }>,
  variables: PromptVariables
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  return steps.map((step) => ({
    role: step.role,
    content: buildPrompt(step.template, variables),
  }));
}

export function interpolateTemplate(template: string, variables: PromptVariables): string {
  return buildPrompt(template, variables);
}
