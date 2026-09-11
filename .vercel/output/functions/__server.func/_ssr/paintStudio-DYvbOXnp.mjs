//#region node_modules/.nitro/vite/services/ssr/assets/paintStudio-DYvbOXnp.js
/**
* Customization schema (v1) — the contract that binds a UI control to a 3D mutation and to a
* persisted record. Every layer (React control, Three.js scene, REST API, database) refers to an
* option by its stable `id`; display labels, hex values, GLB paths, and node names are never sent
* from the browser as instructions.
*/
var CUSTOMIZATION_SCHEMA_VERSION = "1.0.0";
/**
* Deterministic application order. Later categories may depend on nodes introduced by earlier
* ones (a decal targets a panel; paint must repaint whatever hood is currently mounted), so
* restoration always walks this list rather than object key order, which is insertion-dependent.
* `interior` sits beside `paint` — both are colour/material choices with no dependency on, or
* from, any other category.
*/
var CATEGORY_APPLY_ORDER = [
	"trim",
	"panel",
	"hood",
	"wheels",
	"paint",
	"interior",
	"decal",
	"accessory"
];
/**
* Categories where exactly one option is active at a time (a vehicle has one paint colour) versus
* categories that accumulate (a vehicle may carry several accessories). Drives both the store's
* selection semantics and server-side validation.
*/
var MULTI_SELECT_CATEGORIES = ["accessory", "decal"];
function isMultiSelect(category) {
	return MULTI_SELECT_CATEGORIES.includes(category);
}
/** The unit that single-select cardinality applies to. Defaults to the category. */
function selectionGroupOf(option) {
	return option.selectionGroup ?? option.category;
}
/**
* Applies one option to a selection map without mutating the input, honouring single- versus
* multi-select semantics. Shared by the client store and the server so both compute identical
* results from the same inputs.
*
* A single-select choice evicts only the other members of its own `selectionGroup`, so picking a
* grille does not silently drop an unrelated tyre-lettering selection filed under the same category.
* Resolving the group needs the rest of the catalog, which is why the whole option list is passed.
*/
function withOptionSelected(selections, option, catalog = []) {
	const current = selections[option.category] ?? [];
	if (current.includes(option.id)) return isMultiSelect(option.category) ? selections : {
		...selections,
		[option.category]: [option.id]
	};
	if (isMultiSelect(option.category)) return {
		...selections,
		[option.category]: [...current, option.id]
	};
	const group = selectionGroupOf(option);
	const byId = new Map(catalog.map((entry) => [entry.id, entry]));
	const kept = current.filter((id) => {
		const existing = byId.get(id);
		return existing ? selectionGroupOf(existing) !== group : false;
	});
	return {
		...selections,
		[option.category]: [...kept, option.id]
	};
}
function withOptionDeselected(selections, option) {
	const current = selections[option.category] ?? [];
	return {
		...selections,
		[option.category]: current.filter((id) => id !== option.id)
	};
}
function isSelected(selections, option) {
	return (selections[option.category] ?? []).includes(option.id);
}
/** True when the option is backed by procedural stand-in geometry, not shipped GLB nodes. */
function isProceduralPreview(option) {
	return option.geometrySource === "procedural-preview";
}
/**
* Real-time paint studio catalog.
*
* Targets (`BODY` / `body.carmain`) live only here and in the option catalog — never in persisted
* configuration payloads, deep links, or client-authored patches. Custom mode stores schema-safe
* material numbers + an HDRI preset id; the scene layer resolves those onto the trusted paint slot.
*/
/** Exact mesh / material names the studio writes — mirrored from `lib/data/options/4runner.ts`. */
var PAINT_STUDIO_TARGET_NODES = ["BODY"];
var PAINT_STUDIO_TARGET_MATERIALS = ["body.carmain"];
/** Sentinel catalog option selected while custom mode is active (OEM paints keep their own ids). */
var PAINT_CUSTOM_OPTION_ID = "paint-custom";
var HDRI_PRESETS = [
	{
		id: "hdri-studio",
		label: "Studio Soft",
		lightingKey: "studio"
	},
	{
		id: "hdri-showroom",
		label: "Showroom Cool",
		lightingKey: "showroom"
	},
	{
		id: "hdri-overcast",
		label: "Overcast",
		lightingKey: "overcast"
	},
	{
		id: "hdri-sunset",
		label: "Golden Hour",
		lightingKey: "sunset",
		priceDelta: 175,
		hdrUrl: "/renders/rav4-2024/cold_photography_studio_1k.hdr"
	}
];
var DEFAULT_HDRI_PRESET_ID = "hdri-studio";
var DEFAULT_CUSTOM_MATERIAL = {
	color: "#1558d6",
	metalness: .65,
	roughness: .28,
	clearcoat: 1,
	clearcoatRoughness: .06
};
function getHdriPreset(id) {
	if (!id) return void 0;
	return HDRI_PRESETS.find((preset) => preset.id === id);
}
function isHdriPresetId(id) {
	return HDRI_PRESETS.some((preset) => preset.id === id);
}
/** Price contribution from paint-studio state (custom fee + HDRI preset deltas). */
function paintStudioPriceDelta(paintStudio) {
	if (!paintStudio) return 0;
	let total = 0;
	if (paintStudio.mode === "custom") total += 595;
	const hdri = getHdriPreset(paintStudio.hdriPresetId);
	if (hdri?.priceDelta) total += hdri.priceDelta;
	return total;
}
/** Maps schema-safe custom params onto a MaterialConfig (no GLB names). */
function materialConfigFromPaintStudio(material) {
	return {
		color: material.color,
		metalness: material.metalness,
		roughness: material.roughness,
		clearcoat: material.clearcoat,
		clearcoatRoughness: material.clearcoatRoughness
	};
}
function defaultPaintStudioOem(hdriPresetId = DEFAULT_HDRI_PRESET_ID) {
	return {
		mode: "oem",
		hdriPresetId
	};
}
function defaultPaintStudioCustom(material = DEFAULT_CUSTOM_MATERIAL, hdriPresetId = DEFAULT_HDRI_PRESET_ID) {
	return {
		mode: "custom",
		hdriPresetId,
		material: { ...material }
	};
}
//#endregion
export { paintStudioPriceDelta as _, HDRI_PRESETS as a, withOptionSelected as b, PAINT_STUDIO_TARGET_NODES as c, getHdriPreset as d, isHdriPresetId as f, materialConfigFromPaintStudio as g, isSelected as h, DEFAULT_HDRI_PRESET_ID as i, defaultPaintStudioCustom as l, isProceduralPreview as m, CUSTOMIZATION_SCHEMA_VERSION as n, PAINT_CUSTOM_OPTION_ID as o, isMultiSelect as p, DEFAULT_CUSTOM_MATERIAL as r, PAINT_STUDIO_TARGET_MATERIALS as s, CATEGORY_APPLY_ORDER as t, defaultPaintStudioOem as u, selectionGroupOf as v, withOptionDeselected as y };
