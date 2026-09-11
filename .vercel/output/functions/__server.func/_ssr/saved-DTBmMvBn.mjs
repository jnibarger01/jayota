import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as newId, r as getSql } from "./id-B0Z1OARz.mjs";
import { t as authMiddleware } from "./middleware-BUnTdmXB.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-DTBmMvBn.js
var slugSchema = object({ slug: string().trim().min(1).max(40) });
var listSavedVehicles_createServerFn_handler = createServerRpc({
	id: "354db75b5f26c27ee767a7eaf3ab676c95d867503c1fc612304e27ab9bf4a5a0",
	name: "listSavedVehicles",
	filename: "src/lib/server/saved.ts"
}, (opts) => listSavedVehicles.__executeServer(opts));
var listSavedVehicles = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSavedVehicles_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select vehicle_slug, created_at from saved_vehicles
      where user_id = ${context.userId}
      order by created_at desc
    `;
});
var toggleSavedVehicle_createServerFn_handler = createServerRpc({
	id: "54d4280ce2fe0c4115e95c945fbc0aaaf0d11c765e4a4c1588b1323a312d4515",
	name: "toggleSavedVehicle",
	filename: "src/lib/server/saved.ts"
}, (opts) => toggleSavedVehicle.__executeServer(opts));
var toggleSavedVehicle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => slugSchema.parse(input)).handler(toggleSavedVehicle_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await sql`
      select id from saved_vehicles where user_id = ${context.userId} and vehicle_slug = ${data.slug} limit 1
    `;
	if (existing[0]) {
		await sql`delete from saved_vehicles where id = ${existing[0].id} and user_id = ${context.userId}`;
		return {
			saved: false,
			slug: data.slug
		};
	}
	await sql`
      insert into saved_vehicles (id, user_id, vehicle_slug)
      values (${newId("fav")}, ${context.userId}, ${data.slug})
    `;
	return {
		saved: true,
		slug: data.slug
	};
});
var listSavedConfigurations_createServerFn_handler = createServerRpc({
	id: "8dec3cfdf57cc1a1c776076ad6b6fef656335e532754709774a64bfa7fb076c9",
	name: "listSavedConfigurations",
	filename: "src/lib/server/saved.ts"
}, (opts) => listSavedConfigurations.__executeServer(opts));
var listSavedConfigurations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSavedConfigurations_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, configuration_id, vehicle_slug, label, created_at
      from saved_configurations
      where user_id = ${context.userId}
      order by created_at desc
    `;
});
var pinConfiguration_createServerFn_handler = createServerRpc({
	id: "8443ca9852e8619f3fa41cb49d6bbf05eee776d3d04d0b20584a40b81223927f",
	name: "pinConfiguration",
	filename: "src/lib/server/saved.ts"
}, (opts) => pinConfiguration.__executeServer(opts));
var pinConfiguration = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	configurationId: string().trim().min(3).max(80),
	vehicleSlug: string().trim().min(1).max(40),
	label: string().trim().max(80).optional()
}).parse(input)).handler(pinConfiguration_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const id = newId("pin");
	await sql`
      insert into saved_configurations (id, user_id, configuration_id, vehicle_slug, label)
      values (${id}, ${context.userId}, ${data.configurationId}, ${data.vehicleSlug}, ${data.label ?? null})
    `;
	return { id };
});
//#endregion
export { listSavedConfigurations_createServerFn_handler, listSavedVehicles_createServerFn_handler, pinConfiguration_createServerFn_handler, toggleSavedVehicle_createServerFn_handler };
