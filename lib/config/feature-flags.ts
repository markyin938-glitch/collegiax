function readBooleanFlag(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function isEmailVerificationEnabled() {
  return readBooleanFlag(
    process.env.EMAIL_VERIFICATION_ENABLED ?? process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED,
    true
  );
}

export function isDemoLoginEnabled() {
  return readBooleanFlag(
    process.env.DEMO_LOGIN_ENABLED ?? process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED,
    process.env.NODE_ENV !== "production"
  );
}
