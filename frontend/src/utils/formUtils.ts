const required = (value: string) => !!value || "Required.";
const email = (value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid.";
const domain = (value: string) => /^[\p{L}0-9.-]+\.[a-zA-Z]{2,}$/u.test(value) || "Enter a valid domain name.";
const minLength = (value: string) => (value && value.length >= 6) || "Min 6 characters.";

export const rules = {
  required,
  email,
  minLength,
  domain,
} as const;
