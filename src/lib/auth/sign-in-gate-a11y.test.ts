import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SIGN_IN_A11Y,
  SIGN_IN_ERROR_ID,
  SIGN_IN_FIELD_IDS,
  SIGN_IN_FIELDS,
  SIGN_IN_FORM_ID,
  SIGN_IN_TITLE_ID,
  labeledFieldsForMode,
} from "./sign-in-gate-a11y.ts";

describe("sign-in gate a11y contract", () => {
  it("exposes stable selectors and roles for the gate UI", () => {
    assert.equal(SIGN_IN_A11Y.errorRole, "alert");
    assert.equal(SIGN_IN_A11Y.errorLive, "assertive");
    assert.equal(SIGN_IN_A11Y.formSelector, '[data-sign-in-gate="form"]');
    assert.equal(SIGN_IN_A11Y.errorSelector, '[data-sign-in-gate="error"]');
    assert.equal(SIGN_IN_A11Y.providerGroupSelector, '[data-sign-in-gate="providers"]');
    assert.equal(SIGN_IN_A11Y.regionSelector, '[data-sign-in-gate="region"]');
    assert.equal(SIGN_IN_A11Y.modeToggleSelector, '[data-sign-in-gate="mode-toggle"]');
    assert.ok(SIGN_IN_A11Y.regionLabel.length > 0);
    assert.ok(SIGN_IN_A11Y.providerGroupLabel.length > 0);
    assert.equal(SIGN_IN_FORM_ID, "sign-in-form");
    assert.equal(SIGN_IN_TITLE_ID, "sign-in-title");
    assert.equal(SIGN_IN_ERROR_ID, "sign-in-error");
  });

  it("requires a non-empty label for every sign-in field id", () => {
    for (const field of SIGN_IN_FIELDS) {
      assert.ok(field.id.length > 0, "field id required");
      assert.ok(field.label.length > 0, `${field.id} must have a label`);
      assert.match(field.id, /^sign-in-/);
    }
    assert.equal(SIGN_IN_FIELD_IDS.email, "sign-in-email");
    assert.equal(SIGN_IN_FIELD_IDS.password, "sign-in-password");
    assert.equal(SIGN_IN_FIELD_IDS.name, "sign-in-name");
  });

  it("lists labeled fields for keyboard sign-in and sign-up paths", () => {
    const signin = labeledFieldsForMode("signin");
    assert.deepEqual(
      signin.map((f) => f.id),
      [SIGN_IN_FIELD_IDS.email, SIGN_IN_FIELD_IDS.password],
    );
    for (const field of signin) {
      assert.ok(field.label.length > 0);
      assert.equal(field.selector, `#${field.id}`);
    }

    const signup = labeledFieldsForMode("signup");
    assert.deepEqual(
      signup.map((f) => f.id),
      [
        SIGN_IN_FIELD_IDS.name,
        SIGN_IN_FIELD_IDS.email,
        SIGN_IN_FIELD_IDS.password,
      ],
    );
    assert.ok(signup.every((f) => f.label.length > 0));
  });
});
