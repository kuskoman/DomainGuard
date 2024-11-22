const required = (value: string) => !!value || "Required.";
const email = (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid.";
const minLength = (value: string) => (value && value.length >= 6) || "Min 6 characters.";

export const rules = {
  required,
  email,
  minLength,
} as const;
