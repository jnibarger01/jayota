import { i as newRequestId } from "./utils-DzenR1kc.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { i as newId, r as getSql } from "./id-B0Z1OARz.mjs";
import { i as enforceLimit, n as LIMITS } from "./rate-limit-Bmx5kPmD.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as tradeInSchema, i as testDriveSchema, n as leadSchema, r as serviceSchema } from "./forms-CRxgzuAc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intakes-vAHI89k-.js
var UnconfiguredEmailProvider = class {
	async send() {
		return {
			accepted: false,
			provider: "unconfigured",
			reason: "No transactional email provider is configured. The request was stored; no email was sent."
		};
	}
};
function getEmailProvider() {
	return new UnconfiguredEmailProvider();
}
async function optionalUserId() {
	try {
		const { getSessionUser } = await import("./verify.server-CaeqjzvS.mjs");
		return (await getSessionUser())?.id ?? null;
	} catch {
		return null;
	}
}
function emptyToNull(value) {
	const trimmed = value?.trim() ?? "";
	return trimmed ? trimmed : null;
}
async function audit(requestId, action, entityType, entityId, userId) {
	await (await getSql())`
    insert into audit_events (id, request_id, actor_user_id, action, entity_type, entity_id)
    values (${newId("aud")}, ${requestId}, ${userId}, ${action}, ${entityType}, ${entityId})
  `;
}
var submitLead_createServerFn_handler = createServerRpc({
	id: "f8cffb7c51575256f424ff721e38c97c34004c3356f13492a492c543b79127c8",
	name: "submitLead",
	filename: "src/lib/server/intakes.ts"
}, (opts) => submitLead.__executeServer(opts));
var submitLead = createServerFn({ method: "POST" }).validator((input) => leadSchema.parse(input)).handler(submitLead_createServerFn_handler, async ({ data }) => {
	enforceLimit(`lead:${data.email}`, LIMITS.leadWrite, "Too many requests. Please wait a minute and try again.");
	const sql = await getSql();
	const userId = await optionalUserId();
	const requestId = newRequestId();
	const id = newId("lead");
	if (data.idempotencyKey) {
		const existing = await sql`
        select id from leads where idempotency_key = ${data.idempotencyKey} limit 1
      `;
		if (existing[0]) return {
			id: existing[0].id,
			status: "received",
			duplicate: true,
			emailQueued: false,
			requestId
		};
	}
	await sql`
      insert into leads (id, user_id, kind, name, email, phone, vehicle_slug, message, idempotency_key, request_id)
      values (
        ${id}, ${userId}, ${data.kind}, ${data.name}, ${data.email}, ${emptyToNull(data.phone)},
        ${emptyToNull(data.vehicleSlug)}, ${data.message}, ${data.idempotencyKey ?? null}, ${requestId}
      )
    `;
	await audit(requestId, "lead.submitted", "lead", id, userId);
	return {
		id,
		status: "received",
		duplicate: false,
		emailQueued: (await getEmailProvider().send({
			kind: "lead_confirmation",
			to: data.email,
			subject: "We received your request — Hendrick Toyota Merriam",
			text: "Your request was stored. A dealership advisor will follow up. This message is a record, not a delivery receipt."
		})).accepted,
		requestId
	};
});
var submitTestDrive_createServerFn_handler = createServerRpc({
	id: "106f2f0e7f2a4fe86d20e675a84afeaef52fd262aaec54e874df29001c856af3",
	name: "submitTestDrive",
	filename: "src/lib/server/intakes.ts"
}, (opts) => submitTestDrive.__executeServer(opts));
var submitTestDrive = createServerFn({ method: "POST" }).validator((input) => testDriveSchema.parse(input)).handler(submitTestDrive_createServerFn_handler, async ({ data }) => {
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
	return {
		id,
		status: "received",
		confirmed: false,
		confirmationNote: "Request received. A confirmed test drive requires the dealership to accept this request.",
		emailQueued: (await getEmailProvider().send({
			kind: "test_drive_request",
			to: data.email,
			subject: "Test drive request received — Hendrick Toyota Merriam",
			text: "We stored your test-drive request. This is not a confirmed appointment until the dealership contacts you."
		})).accepted,
		requestId
	};
});
var submitTradeIn_createServerFn_handler = createServerRpc({
	id: "25f6a082eaa6caf33ce20b2ab4c995e5dcbe1983da19b66e2f438c7bd44f0638",
	name: "submitTradeIn",
	filename: "src/lib/server/intakes.ts"
}, (opts) => submitTradeIn.__executeServer(opts));
var submitTradeIn = createServerFn({ method: "POST" }).validator((input) => tradeInSchema.parse(input)).handler(submitTradeIn_createServerFn_handler, async ({ data }) => {
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
		status: "received",
		valuation: null,
		valuationStatus: "unavailable",
		valuationNote: "No third-party valuation provider is configured. We will not invent a trade-in number. The dealership will appraise the vehicle.",
		requestId
	};
});
var submitServiceRequest_createServerFn_handler = createServerRpc({
	id: "31b09b957647a74c79f4e160e47d750e4b0339c4faacbcb23228b5d78525bd3d",
	name: "submitServiceRequest",
	filename: "src/lib/server/intakes.ts"
}, (opts) => submitServiceRequest.__executeServer(opts));
var submitServiceRequest = createServerFn({ method: "POST" }).validator((input) => serviceSchema.parse(input)).handler(submitServiceRequest_createServerFn_handler, async ({ data }) => {
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
		status: "request_received",
		scheduled: false,
		confirmationNote: "This is a service request, not a booked appointment. Hendrick Toyota Merriam must confirm the time before you should plan to drop off the vehicle.",
		requestId
	};
});
//#endregion
export { submitLead_createServerFn_handler, submitServiceRequest_createServerFn_handler, submitTestDrive_createServerFn_handler, submitTradeIn_createServerFn_handler };
