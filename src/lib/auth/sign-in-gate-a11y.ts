/**
 * Sign-in gate accessibility contract.
 * Keep in sync with `src/routes/login.tsx` and `SignInButtons` in gates.tsx —
 * tests import these ids/roles/selectors so unlabeled inputs or missing
 * error announcements regress in CI.
 */

export const SIGN_IN_FIELD_IDS = {
  name: "sign-in-name",
  email: "sign-in-email",
  password: "sign-in-password",
} as const;

export const SIGN_IN_TITLE_ID = "sign-in-title";
export const SIGN_IN_ERROR_ID = "sign-in-error";
export const SIGN_IN_FORM_ID = "sign-in-form";

export const SIGN_IN_FIELDS = [
  {
    id: SIGN_IN_FIELD_IDS.name,
    label: "Name",
    autoComplete: "name",
    type: "text",
    modes: ["signup"] as const,
  },
  {
    id: SIGN_IN_FIELD_IDS.email,
    label: "Email",
    autoComplete: "email",
    type: "email",
    modes: ["signin", "signup"] as const,
  },
  {
    id: SIGN_IN_FIELD_IDS.password,
    label: "Password",
    autoCompleteSignIn: "current-password",
    autoCompleteSignUp: "new-password",
    type: "password",
    modes: ["signin", "signup"] as const,
  },
] as const;

export const SIGN_IN_A11Y = {
  regionLabel: "Sign in",
  providerGroupLabel: "Sign-in providers",
  errorRole: "alert" as const,
  errorLive: "assertive" as const,
  formSelector: '[data-sign-in-gate="form"]',
  errorSelector: '[data-sign-in-gate="error"]',
  providerGroupSelector: '[data-sign-in-gate="providers"]',
  regionSelector: '[data-sign-in-gate="region"]',
  modeToggleSelector: '[data-sign-in-gate="mode-toggle"]',
} as const;

/** Every visible sign-in input must expose a non-empty accessible label. */
export function labeledFieldsForMode(mode: "signin" | "signup") {
  return SIGN_IN_FIELDS.filter((field) =>
    (field.modes as readonly string[]).includes(mode),
  ).map((field) => ({
    id: field.id,
    label: field.label,
    selector: `#${field.id}`,
  }));
}
