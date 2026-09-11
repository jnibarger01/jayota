import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { newId } from "@/showroom/shared/id";
import { newRequestId } from "@/lib/utils";
import {
  leadSchema,
  serviceSchema,
  testDriveSchema,
  tradeInSchema,
  type LeadInput,
  type ServiceInput,
  type TestDriveInput,
  type TradeInInput,
} from "@/lib/validators/forms";
import { getEmailProvider } from "@/lib/providers/email";
import { enforceLimit, LIMITS } from "@/lib/http/rate-limit";

async function optionalUserId(): Promise<string | null> {
  try {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

async function audit(requestId: string, action: string, entityType: string, entityId: string, userId: string | null) {
  const sql = await getSql();
  await sql`
    insert into audit_events (id, request_id, actor_user_id, action, entity_type, entity_id)
    values (${newId("aud")}, ${requestId}, ${userId}, ${action}, ${entityType}, ${entityId})
  `;
}

export const submitLead = createServerFn({ method: "POST" })
  .validator((input: LeadInput) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    enforceLimit(`lead:${data.email}`, LIMITS.leadWrite, "Too many requests. Please wait a minute and try again.");
    const sql = await getSql();
    const userId = await optionalUserId();
    const requestId = newRequestId();
    const id = newId("lead");
    if (data.idempotencyKey) {
      const existing = await sql<{ id: string }>`
        select id from leads where idempotency_key = ${data.idempotencyKey} limit 1
      `;
      if (existing[0]) {
        return {
          id: existing[0].id,
          status: "received" as const,
          duplicate: true,
          emailQueued: false,
          requestId,
        };
      }
    }
    await sql`
      insert into leads (id, user_id, kind, name, email, phone, vehicle_slug, message, idempotency_key, request_id)
      values (
        ${id}, ${userId}, ${data.kind}, ${data.name}, ${data.email}, ${emptyToNull(data.phone)},
        ${emptyToNull(data.vehicleSlug)}, ${data.message}, ${data.idempotencyKey ?? null}, ${requestId}
      )
    `;
    await audit(requestId, "lead.submitted", "lead", id, userId);
    const email = await getEmailProvider().send({
      kind: "lead_confirmation",
      to: data.email,
      subject: "We received your request — Hendrick Toyota Merriam",
      text: "Your request was stored. A dealership advisor will follow up. This message is a record, not a delivery receipt.",
    });
    return { id, status: "received" as const, duplicate: false, emailQueued: email.accepted, requestId };
  });

export const submitTestDrive = createServerFn({ method: "POST" })
  .validator((input: TestDriveInput) => testDriveSchema.parse(input))
  .handler(async ({ data }) => {
    enforceLimit(`td:${data.email}`, LIMITS.leadWrite, "Too many requests. Please wait a minute and try again.");
    const sql = await getSql();
    const userId = await optionalUserId();
    const requestId = newRequestId();
    const id = newId("td");
    await sql`
      insert into test_drive_requests (
        id, user_id, name, email, phone, vehicle_slug, preferred_date, preferred_window, notes, idempotency_key, request_id
      ) values (
        ${id}, ${userId}, ${data.name}, ${data.email}, ${emptyToNull(data.phone)}, ${data.vehicleSlug},
        ${data.preferredDate}, ${data.preferredWindow}, ${emptyToNull(data.notes)}, ${data.idempotencyKey ?? null}, ${requestId}
      )
    `;
    await audit(requestId, "test_drive.submitted", "test_drive", id, userId);
    const email = await getEmailProvider().send({
      kind: "test_drive_request",
      to: data.email,
      subject: "Test drive request received — Hendrick Toyota Merriam",
      text: "We stored your test-drive request. This is not a confirmed appointment until the dealership contacts you.",
    });
    return {
      id,
      status: "received" as const,
      confirmed: false,
      confirmationNote:
        "Request received. A confirmed test drive requires the dealership to accept this request.",
      emailQueued: email.accepted,
      requestId,
    };
  });

export const submitTradeIn = createServerFn({ method: "POST" })
  .validator((input: TradeInInput) => tradeInSchema.parse(input))
  .handler(async ({ data }) => {
    enforceLimit(`tr:${data.email}`, LIMITS.leadWrite, "Too many requests. Please wait a minute and try again.");
    const sql = await getSql();
    const userId = await optionalUserId();
    const requestId = newRequestId();
    const id = newId("tr");
    await sql`
      insert into trade_in_requests (
        id, user_id, name, email, phone, vin, year, make, model, mileage, condition, notes,
        valuation_status, idempotency_key, request_id
      ) values (
        ${id}, ${userId}, ${data.name}, ${data.email}, ${emptyToNull(data.phone)}, ${emptyToNull(data.vin)},
        ${emptyToNull(data.year)}, ${emptyToNull(data.make)}, ${emptyToNull(data.model)},
        ${emptyToNull(data.mileage)}, ${data.condition}, ${emptyToNull(data.notes)},
        ${"unavailable"}, ${data.idempotencyKey ?? null}, ${requestId}
      )
    `;
    await audit(requestId, "trade_in.submitted", "trade_in", id, userId);
    return {
      id,
      status: "received" as const,
      valuation: null as number | null,
      valuationStatus: "unavailable" as const,
      valuationNote:
        "No third-party valuation provider is configured. We will not invent a trade-in number. The dealership will appraise the vehicle.",
      requestId,
    };
  });

export const submitServiceRequest = createServerFn({ method: "POST" })
  .validator((input: ServiceInput) => serviceSchema.parse(input))
  .handler(async ({ data }) => {
    enforceLimit(`svc:${data.email}`, LIMITS.leadWrite, "Too many requests. Please wait a minute and try again.");
    const sql = await getSql();
    const userId = await optionalUserId();
    const requestId = newRequestId();
    const id = newId("svc");
    await sql`
      insert into service_appointments (
        id, user_id, name, email, phone, vin, year, model, mileage, service_type, concern,
        preferred_date, preferred_window, transportation, notes, status, confirmation_source,
        idempotency_key, request_id
      ) values (
        ${id}, ${userId}, ${data.name}, ${data.email}, ${emptyToNull(data.phone)}, ${emptyToNull(data.vin)},
        ${emptyToNull(data.year)}, ${emptyToNull(data.model)}, ${emptyToNull(data.mileage)},
        ${data.serviceType}, ${data.concern}, ${data.preferredDate}, ${data.preferredWindow},
        ${data.transportation}, ${emptyToNull(data.notes)}, ${"request_received"}, ${"intake_only"},
        ${data.idempotencyKey ?? null}, ${requestId}
      )
    `;
    await audit(requestId, "service.submitted", "service_appointment", id, userId);
    return {
      id,
      status: "request_received" as const,
      scheduled: false,
      confirmationNote:
        "This is a service request, not a booked appointment. Hendrick Toyota Merriam must confirm the time before you should plan to drop off the vehicle.",
      requestId,
    };
  });
