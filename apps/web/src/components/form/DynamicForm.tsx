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
      else if (field.type === 'checkbox' || field.type === 'toggle') init[field.id] = false;
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
            {group.fieldIds
              .map((id) => fieldMap[id])
              .filter((f): f is FormField => f !== undefined)
              .filter(isVisible)
              .map((field) => (
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
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </span>
          ) : (
            'Generate'
          )}
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
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

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
            rows={field.rows ?? 4}
            maxLength={field.maxLength}
            className={baseClass}
          />
          {field.maxLength && (
            <p className="text-xs text-gray-400 mt-1 text-right">
              {String(value ?? '').length}/{field.maxLength}
            </p>
          )}
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );

    case 'toggle': {
      const checked = Boolean(value);
      return (
        <div className="flex items-center justify-between py-1">
          <label htmlFor={field.id} className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            {field.label}
          </label>
          <button
            type="button"
            id={field.id}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              checked ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                checked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      );
    }

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={field.id}
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={field.id} className="text-sm text-gray-700 cursor-pointer">
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

    case 'currency':
      return (
        <div>
          {label}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
            <input
              type="number"
              id={field.id}
              value={String(value ?? '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder ?? '0.00'}
              required={field.required}
              min={field.min ?? 0}
              max={field.max}
              step="0.01"
              className={`${baseClass} pl-7`}
            />
          </div>
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );

    case 'percentage':
      return (
        <div>
          {label}
          <div className="relative">
            <input
              type="number"
              id={field.id}
              value={String(value ?? '')}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder ?? '0'}
              required={field.required}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step="0.01"
              className={`${baseClass} pr-8`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">%</span>
          </div>
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );

    case 'email':
      return (
        <div>
          {label}
          <input
            type="email"
            id={field.id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? 'email@example.com'}
            required={field.required}
            maxLength={field.maxLength}
            className={baseClass}
          />
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );

    case 'phone':
      return (
        <div>
          {label}
          <input
            type="tel"
            id={field.id}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder ?? '(555) 000-0000'}
            required={field.required}
            className={baseClass}
          />
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );

    case 'radio': {
      const opts = field.options ?? [];
      return (
        <div>
          {label}
          <div className="flex flex-wrap gap-3 mt-1">
            {opts.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={String(value) === opt.value}
                  onChange={() => onChange(opt.value)}
                  required={field.required}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );
    }

    case 'multiselect': {
      const opts = field.options ?? [];
      const selected = Array.isArray(value) ? (value as string[]) : [];
      const toggle = (v: string) =>
        onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
      return (
        <div>
          {label}
          <div className="flex flex-wrap gap-2 mt-1">
            {opts.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  selected.includes(opt.value)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
        </div>
      );
    }

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
          {field.helpText && <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>}
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
