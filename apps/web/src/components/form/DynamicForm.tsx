'use client';

import { useState, useCallback } from 'react';
import type { FormSchema, FormField } from '@aifreetools/shared-types';
import { US_STATES } from '@aifreetools/tool-configs';

interface Props {
  schema: FormSchema;
  defaultState?: string;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
  onReset?: () => void;
}

export function DynamicForm({ schema, defaultState, onSubmit, isSubmitting, onReset }: Props) {
  const fieldMap = Object.fromEntries(schema.fields.map((f) => [f.id, f]));

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    for (const field of schema.fields) {
      if (field.defaultValue !== undefined) init[field.id] = field.defaultValue;
      else if (field.type === 'checkbox') init[field.id] = false;
      else init[field.id] = '';
    }
    if (defaultState) init['state'] = defaultState;
    return init;
  });

  const setValue = useCallback((id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const isVisible = useCallback(
    (field: FormField): boolean => {
      if (!field.conditional) return true;
      const { dependsOn, showWhen } = field.conditional;
      const depValue = values[dependsOn];
      if (Array.isArray(showWhen)) return showWhen.includes(String(depValue));
      return String(depValue) === String(showWhen);
    },
    [values]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(values);
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {schema.groups.map((group) => (
        <fieldset key={group.id} className="border border-gray-200 rounded-lg p-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">{group.title}</legend>
          <div className="space-y-4 mt-2">
            {group.fields.filter(isVisible).map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={values[field.id]}
                onChange={(v) => setValue(field.id, v)}
                defaultState={defaultState}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Generating...' : 'Generate'}
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}

interface FieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (v: unknown) => void;
  defaultState?: string;
}

function FieldRenderer({ field, value, onChange, defaultState }: FieldRendererProps) {
  const baseClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  const label = (
    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
      {field.label}
      {field.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  switch (field.type) {
    case 'select': {
      const options =
        field.id === 'state'
          ? US_STATES.map((s) => ({ value: s.value, label: s.label }))
          : field.options ?? [];
      return (
        <div>
          {label}
          <select
            id={field.id}
            value={String(value ?? (defaultState && field.id === 'state' ? defaultState : ''))}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseClass}
          >
            <option value="">Select {field.label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );
    }

    case 'textarea':
      return (
        <div>
          {label}
          <textarea
            id={field.id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows ?? 3}
            maxLength={field.maxLength}
            className={baseClass}
          />
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={field.id}
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor={field.id} className="text-sm text-gray-700">
            {field.label}
          </label>
        </div>
      );

    case 'number':
      return (
        <div>
          {label}
          <input
            type="number"
            id={field.id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            className={baseClass}
          />
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );

    case 'date':
      return (
        <div>
          {label}
          <input
            type="date"
            id={field.id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={baseClass}
          />
        </div>
      );

    default:
      return (
        <div>
          {label}
          <input
            type="text"
            id={field.id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            className={baseClass}
          />
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );
  }
}
