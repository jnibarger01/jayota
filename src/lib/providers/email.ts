/**
 * EmailProvider — transactional messages for lead / appointment confirmations.
 * No SendGrid / SES / Resend credentials are present. We record the intent and return
 * `accepted: false` so the UI never claims a message was delivered.
 */
export type EmailKind =
  | "lead_confirmation"
  | "test_drive_request"
  | "trade_in_request"
  | "service_request";

export interface EmailMessage {
  kind: EmailKind;
  to: string;
  subject: string;
  text: string;
}

export interface EmailSendResult {
  accepted: boolean;
  provider: string;
  reason: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailSendResult>;
}

class UnconfiguredEmailProvider implements EmailProvider {
  async send(): Promise<EmailSendResult> {
    return {
      accepted: false,
      provider: "unconfigured",
      reason:
        "No transactional email provider is configured. The request was stored; no email was sent.",
    };
  }
}

export function getEmailProvider(): EmailProvider {
  return new UnconfiguredEmailProvider();
}
