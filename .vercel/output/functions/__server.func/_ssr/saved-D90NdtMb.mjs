import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { o as createSsrRpc } from "./catalog-0lXXzwn9.mjs";
import { t as authMiddleware } from "./middleware-BUnTdmXB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-D90NdtMb.js
var slugSchema = object({ slug: string().trim().min(1).max(40) });
var listSavedVehicles = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("354db75b5f26c27ee767a7eaf3ab676c95d867503c1fc612304e27ab9bf4a5a0"));
var toggleSavedVehicle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => slugSchema.parse(input)).handler(createSsrRpc("54d4280ce2fe0c4115e95c945fbc0aaaf0d11c765e4a4c1588b1323a312d4515"));
var listSavedConfigurations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8dec3cfdf57cc1a1c776076ad6b6fef656335e532754709774a64bfa7fb076c9"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	configurationId: string().trim().min(3).max(80),
	vehicleSlug: string().trim().min(1).max(40),
	label: string().trim().max(80).optional()
}).parse(input)).handler(createSsrRpc("8443ca9852e8619f3fa41cb49d6bbf05eee776d3d04d0b20584a40b81223927f"));
//#endregion
export { listSavedVehicles as n, toggleSavedVehicle as r, listSavedConfigurations as t };
