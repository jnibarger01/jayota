import { o as __toESM } from "../_runtime.mjs";
import { c as PAINT_STUDIO_TARGET_NODES, d as getHdriPreset, g as materialConfigFromPaintStudio, p as isMultiSelect, s as PAINT_STUDIO_TARGET_MATERIALS, t as CATEGORY_APPLY_ORDER } from "./paintStudio-DYvbOXnp.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as gsapWithCSS } from "../_libs/gsap.mjs";
import { A as MeshBasicMaterial, B as Raycaster, D as MathUtils, F as PlaneGeometry, G as SphereGeometry, H as Scene, I as PointLight, J as TextureLoader, K as Spherical, L as Points, M as MeshStandardMaterial, N as PerspectiveCamera, Q as Vector3, R as PointsMaterial, S as IcosahedronGeometry, U as Shape, V as SRGBColorSpace, Y as TorusGeometry, Z as Vector2, _ as ExtrudeGeometry, a as GLTFLoader, b as Group, c as WebGLRenderer, d as BufferAttribute, f as BufferGeometry, g as DirectionalLight, h as CylinderGeometry, i as DRACOLoader, j as MeshPhysicalMaterial, k as Mesh, m as Color, n as RGBELoader, o as clone, p as CanvasTexture, q as Texture, r as OrbitControls, s as PMREMGenerator, t as WebGPURenderer, u as Box3, v as Fog, x as HemisphereLight, y as GridHelper } from "../_libs/three.mjs";
import { n as computeBoundsTree, r as disposeBoundsTree, t as acceleratedRaycast } from "../_libs/three-mesh-bvh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VehicleCanvas-CN1xBFTN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function resolveNodes(root, names) {
	const found = [];
	const missing = [];
	for (const name of names) {
		const object = root.getObjectByName(name);
		if (object) found.push(object);
		else missing.push(name);
	}
	return {
		found,
		missing
	};
}
/** Meshes only — resolves the named nodes and keeps those that can actually carry a material. */
function resolveMeshes(root, names) {
	const meshes = [];
	for (const name of names) {
		const object = root.getObjectByName(name);
		if (object instanceof Mesh) {
			meshes.push(object);
			continue;
		}
		if (object) object.traverse((child) => {
			if (child instanceof Mesh) meshes.push(child);
		});
	}
	return meshes;
}
function materialsOf(mesh) {
	return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}
/** Every distinct node name an option needs to be applicable. */
function requiredNodeNames(option) {
	return [
		...option.targetNodes ?? [],
		...option.hidesNodes ?? [],
		...option.mountNodes ?? []
	];
}
/**
* Load-time gate. Checks every option's node and material names against the GLB that was actually
* loaded, so a missing name surfaces once, at startup, with the option's id attached — instead of
* as a silent no-op the first time a user clicks the control.
*
* Options reported as unsatisfied are removed from the catalog the UI renders, which is what keeps
* "every customization button updates the intended 3D component" true even while the asset
* pipeline is mid-migration.
*/
function verifyNodeContract(root, options) {
	const report = {
		satisfied: [],
		unsatisfied: []
	};
	for (const option of options) {
		const { missing } = resolveNodes(root, requiredNodeNames(option));
		const missingMaterials = missingMaterialNames(root, option);
		if (missing.length === 0 && missingMaterials.length === 0) report.satisfied.push(option);
		else report.unsatisfied.push({
			option,
			missingNodes: missing,
			missingMaterials
		});
	}
	return report;
}
function missingMaterialNames(root, option) {
	if (!option.targetMaterials?.length || !option.targetNodes?.length) return [];
	const present = /* @__PURE__ */ new Set();
	for (const mesh of resolveMeshes(root, option.targetNodes)) for (const material of materialsOf(mesh)) if (material?.name) present.add(material.name);
	return option.targetMaterials.filter((name) => !present.has(name));
}
function slotKey(mesh, slotIndex) {
	return `${mesh.uuid}:${slotIndex}`;
}
var MaterialWriter = class {
	slots = /* @__PURE__ */ new Map();
	textures = /* @__PURE__ */ new Map();
	loader = new TextureLoader();
	/**
	* Returns the writable material for a mesh slot, cloning on first use.
	*
	* `shared: true` opts out of cloning for the deliberate case where an update *should* affect
	* every user of the material (all four tyres change sidewall together), avoiding four redundant
	* clones of the same geometry-independent material.
	*/
	writable(mesh, slotIndex, shared) {
		const current = materialsOf(mesh)[slotIndex];
		if (!current) return null;
		if (shared) return current;
		const key = slotKey(mesh, slotIndex);
		const existing = this.slots.get(key);
		if (existing) return existing.clone;
		const clone = current.clone();
		clone.name = current.name;
		this.slots.set(key, {
			mesh,
			slotIndex,
			original: current,
			clone
		});
		if (Array.isArray(mesh.material)) {
			const next = [...mesh.material];
			next[slotIndex] = clone;
			mesh.material = next;
		} else mesh.material = clone;
		return clone;
	}
	/**
	* Applies `update` to the named material slots of the given meshes.
	*
	* When `materialNames` is empty every slot on the mesh is written; when it is provided only
	* matching slots are touched, which is what keeps a paint change confined to `body.carmain`
	* while the `BODY` mesh's nine other slots (glass, chrome, emissive lamps) are left alone.
	*/
	updateMaterials(meshes, materialNames, update, options = {}) {
		let written = 0;
		const wanted = materialNames?.length ? new Set(materialNames) : null;
		for (const mesh of meshes) {
			const materials = materialsOf(mesh);
			for (let slotIndex = 0; slotIndex < materials.length; slotIndex++) {
				const material = materials[slotIndex];
				if (!material) continue;
				if (wanted && !wanted.has(material.name)) continue;
				const target = this.writable(mesh, slotIndex, options.shared ?? false);
				if (!target) continue;
				update(target);
				target.needsUpdate = true;
				written++;
			}
		}
		return written;
	}
	/** Applies a declarative `MaterialConfig`, ignoring properties the material does not support. */
	applyMaterialConfig(meshes, materialNames, config, options = {}) {
		return this.updateMaterials(meshes, materialNames, (material) => {
			const standard = material;
			const physical = material;
			if (config.color !== void 0 && standard.color) standard.color.set(config.color);
			if (config.metalness !== void 0 && "metalness" in standard) standard.metalness = config.metalness;
			if (config.roughness !== void 0 && "roughness" in standard) standard.roughness = config.roughness;
			if (config.clearcoat !== void 0 && "clearcoat" in physical) physical.clearcoat = config.clearcoat;
			if (config.clearcoatRoughness !== void 0 && "clearcoatRoughness" in physical) physical.clearcoatRoughness = config.clearcoatRoughness;
		}, options);
	}
	/**
	* Loads a texture once per URL and assigns it as the base colour map. The previous map is
	* disposed only when this writer created it — GLB-supplied maps are left alone because they may
	* still be referenced by other meshes sharing the source material.
	*/
	async applyTexture(meshes, materialNames, textureUrl) {
		const texture = await this.loadTexture(textureUrl);
		return this.updateMaterials(meshes, materialNames, (material) => {
			const standard = material;
			if (!("map" in standard)) return;
			const previous = standard.map;
			standard.map = texture;
			if (previous && this.ownsTexture(previous) && previous !== texture) previous.dispose();
		});
	}
	ownedTextures = /* @__PURE__ */ new Set();
	ownsTexture(texture) {
		return this.ownedTextures.has(texture);
	}
	loadTexture(url) {
		const cached = this.textures.get(url);
		if (cached) return cached;
		const pending = this.loader.loadAsync(url).then((texture) => {
			texture.colorSpace = SRGBColorSpace;
			texture.flipY = false;
			this.ownedTextures.add(texture);
			return texture;
		});
		pending.catch(() => this.textures.delete(url));
		this.textures.set(url, pending);
		return pending;
	}
	/** Restores every mesh slot to the material the GLB supplied, disposing the clones. */
	restoreOriginals() {
		for (const slot of this.slots.values()) {
			if (Array.isArray(slot.mesh.material)) {
				const next = [...slot.mesh.material];
				next[slot.slotIndex] = slot.original;
				slot.mesh.material = next;
			} else slot.mesh.material = slot.original;
			slot.clone.dispose();
		}
		this.slots.clear();
	}
	dispose() {
		this.restoreOriginals();
		for (const texture of this.ownedTextures) texture.dispose();
		this.ownedTextures.clear();
		this.textures.clear();
	}
	/** Test/diagnostic hook: how many clones this writer is holding. */
	get clonedSlotCount() {
		return this.slots.size;
	}
};
/**
* Optional-asset loading and mesh replacement.
*
* The base vehicle GLB is ~1.2 MiB (Draco-compressed and pruned, docs/INTEGRATION_GUIDE.md §15), so
* it is loaded exactly once per session and never reloaded for an option change. VehicleCanvas
* paints a procedural placeholder first (docs/PERF_BUDGETS.md / §18) while this load runs.
* Replacement parts are fetched on demand, cached by URL, and cloned per mount point, so selecting
* the same wheel style twice costs no network and no extra GPU upload.
*/
var sharedLoader = null;
var sharedDraco = null;
/**
* Vendored locally at `public/draco/` (draco_decoder.js, draco_decoder.wasm,
* draco_wasm_wrapper.js — the exact three files `DRACOLoader` fetches), not Google's CDN. Two
* independent reasons, either one sufficient on its own: this app's CSP (`app/layout.tsx`, §13)
* intentionally does not allow `connect-src` to reach third-party hosts, so a CDN path would be
* silently blocked there; and a CDN dependency is one more thing that can be down, rate-limited,
* or blocked by a restrictive network for a feature (the optional wheel/tyre glTF replacements)
* that has nothing to do with needing the public internet. `import.meta.env.BASE_URL` matches
* every other asset URL this app emits (`lib/api/client.ts`'s `withBasePath`) — required once
* GitHub Pages serves the whole site under `/toyota-showroom/`.
*/
var DRACO_DECODER_PATH = `/draco/`;
function getGltfLoader() {
	if (sharedLoader) return sharedLoader;
	sharedDraco = new DRACOLoader();
	sharedDraco.setDecoderPath(DRACO_DECODER_PATH);
	sharedDraco.setDecoderConfig({ type: "wasm" });
	sharedLoader = new GLTFLoader();
	sharedLoader.setDRACOLoader(sharedDraco);
	return sharedLoader;
}
/**
* URL-keyed cache of loaded scenes. Stores the promise rather than the result so two concurrent
* requests for the same asset share one network round trip instead of racing.
*/
var assetCache = /* @__PURE__ */ new Map();
/**
* Geometry, materials, and textures owned by cached source scenes.
*
* `SkeletonUtils.clone` shares these with every clone it produces, so disposing a detached clone
* naively would tear down resources the cache — and every future clone — still depends on.
* `disposeSubtree` consults this set and skips anything in it.
*/
var cacheOwnedResources = /* @__PURE__ */ new Set();
function registerCacheOwned(root) {
	root.traverse((object) => {
		if (!(object instanceof Mesh)) return;
		if (object.geometry) cacheOwnedResources.add(object.geometry);
		for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
			if (!material) continue;
			cacheOwnedResources.add(material);
			for (const value of Object.values(material)) if (value instanceof Texture) cacheOwnedResources.add(value);
		}
	});
}
function loadAsset(url) {
	const cached = assetCache.get(url);
	if (cached) return cached;
	const pending = getGltfLoader().loadAsync(url).then((gltf) => {
		registerCacheOwned(gltf.scene);
		return gltf.scene;
	});
	pending.catch(() => assetCache.delete(url));
	assetCache.set(url, pending);
	return pending;
}
/**
* Clones a cached scene for attachment. `SkeletonUtils`' clone is used rather than `Object3D.clone`
* so skinned parts keep working; geometry and materials stay shared with the cached original by
* design — a per-instance material change goes through `MaterialWriter`, which clones the single
* slot it writes rather than duplicating the whole asset.
*/
function instantiateAsset(source) {
	return clone(source);
}
/** Marks nodes this integration attached, so teardown can tell them from GLB-supplied geometry. */
var ATTACHED_BY_OPTION = "__attachedByOptionId";
function markAttached(object, optionId) {
	object.userData[ATTACHED_BY_OPTION] = optionId;
}
function attachedOptionId(object) {
	return object.userData[ATTACHED_BY_OPTION];
}
/**
* Attaches `asset` under `mount`, replacing anything this integration previously attached there.
*
* Placement comes from the mount node's own transform, which is why the option record names a
* mount rather than carrying coordinates: re-authoring the vehicle in Blender moves the part
* without a code or data change. Removing the previous attachment before adding the new one is
* what prevents duplicate meshes accumulating across repeated selections.
*/
function attachToMount(mount, asset, optionId) {
	detachFromMount(mount);
	markAttached(asset, optionId);
	asset.position.set(0, 0, 0);
	asset.quaternion.identity();
	asset.scale.set(1, 1, 1);
	mount.add(asset);
}
function detachFromMount(mount) {
	for (const child of [...mount.children]) {
		if (attachedOptionId(child) === void 0) continue;
		mount.remove(child);
		disposeSubtree(child);
	}
}
/**
* Releases geometry, materials, and textures for a detached subtree.
*
* Resources belonging to a cached source scene are skipped: clones share them, so disposing one
* clone would blank every other instance and every future one. That makes this safe to call on
* any detached node, whether it was cloned from the cache or built procedurally.
*/
function disposeSubtree(root) {
	const materials = /* @__PURE__ */ new Set();
	root.traverse((object) => {
		if (!(object instanceof Mesh)) return;
		if (object.geometry && !cacheOwnedResources.has(object.geometry)) object.geometry.dispose();
		for (const material of Array.isArray(object.material) ? object.material : [object.material]) if (material) materials.add(material);
	});
	for (const material of materials) {
		if (cacheOwnedResources.has(material)) continue;
		for (const value of Object.values(material)) if (value instanceof Texture && !cacheOwnedResources.has(value)) value.dispose();
		material.dispose();
	}
}
var SceneRegistry = class {
	entries = /* @__PURE__ */ new Map();
	/** Reverse index: an object's uuid to every entry registered against it — a single mesh (e.g.
	* the 4Runner's `BODY`) can carry several material-region entries at once. */
	byObjectUuid = /* @__PURE__ */ new Map();
	register(id, object, metadata) {
		this.unregister(id);
		const entry = {
			id,
			object,
			...metadata
		};
		this.entries.set(id, entry);
		const bucket = this.byObjectUuid.get(object.uuid);
		if (bucket) bucket.push(entry);
		else this.byObjectUuid.set(object.uuid, [entry]);
	}
	unregister(id) {
		const existing = this.entries.get(id);
		if (!existing) return;
		this.entries.delete(id);
		const bucket = this.byObjectUuid.get(existing.object.uuid);
		if (!bucket) return;
		const next = bucket.filter((entry) => entry.id !== id);
		if (next.length > 0) this.byObjectUuid.set(existing.object.uuid, next);
		else this.byObjectUuid.delete(existing.object.uuid);
	}
	get(id) {
		return this.entries.get(id);
	}
	has(id) {
		return this.entries.has(id);
	}
	findByType(type) {
		return [...this.entries.values()].filter((entry) => entry.type === type);
	}
	findByCapability(capability) {
		return [...this.entries.values()].filter((entry) => entry.capabilities.includes(capability));
	}
	/** Every registered entry, semantic-ID order not guaranteed — for part lists / agent inspection. */
	list() {
		return [...this.entries.values()];
	}
	/**
	* Reverse lookup from a raycast hit to its semantic ID — the join point between picking
	* (`lib/three/picking.ts`) and this registry.
	*
	* A material-region entry is registered (`buildSceneRegistry`) against its own dedicated mesh —
	* the one real, `GLTFLoader`-produced child whose single material carries the named slot — so
	* the common case is an unambiguous one-entry bucket, returned directly regardless of whether
	* that entry happens to carry `materialNames` metadata (kept for highlighting, not for
	* disambiguation here). `materialName` only matters when a bucket genuinely holds more than one
	* entry for the same object — a hand-built or non-`GLTFLoader` scene where several regions
	* legitimately share one multi-material mesh; no asset in this repo produces that shape, but the
	* registry itself does not assume otherwise. Falls back up the ancestor chain so a child mesh of
	* a registered group — an accessory's individual boxes, none of which are registered themselves
	* — resolves to the group's own semantic ID.
	*/
	resolve(object, materialName) {
		let current = object;
		while (current) {
			const bucket = this.byObjectUuid.get(current.uuid);
			if (bucket) {
				if (bucket.length === 1) return bucket[0];
				if (materialName) {
					const region = bucket.find((entry) => entry.materialNames?.includes(materialName));
					if (region) return region;
				}
				const whole = bucket.find((entry) => !entry.materialNames);
				if (whole) return whole;
			}
			current = current.parent;
		}
	}
	clear() {
		this.entries.clear();
		this.byObjectUuid.clear();
	}
};
/**
* Populates a `SceneRegistry` from a declared `SceneMapEntry[]` against the actual loaded root,
* validating every entry the same way `verifyNodeContract` validates customization options: an
* entry whose node or material slot is not present on this asset is reported unsatisfied and left
* unregistered, rather than registered against nothing or thrown as a load-time error. That is
* what makes a partially-modeled vehicle (or the procedural fallback) a normal, typed outcome for
* every caller instead of a special case each one has to guard against separately.
*/
function buildSceneRegistry(root, entries) {
	const registry = new SceneRegistry();
	const report = {
		satisfied: [],
		unsatisfied: []
	};
	for (const entry of entries) {
		const object = root.getObjectByName(entry.match.objectName);
		if (!object) {
			report.unsatisfied.push({
				entry,
				reason: `missing node "${entry.match.objectName}"`
			});
			continue;
		}
		if (entry.match.kind === "material-region") {
			const present = materialNamesOn(object);
			const missing = entry.match.materialNames.filter((name) => !present.has(name));
			if (missing.length > 0) {
				report.unsatisfied.push({
					entry,
					reason: `missing material slot(s) on "${entry.match.objectName}": ${missing.join(", ")}`
				});
				continue;
			}
			const dedicated = findDedicatedMeshForMaterials(object, entry.match.materialNames);
			if (dedicated.length !== 1) {
				report.unsatisfied.push({
					entry,
					reason: dedicated.length === 0 ? `material(s) ${entry.match.materialNames.join(", ")} reported present under "${entry.match.objectName}" but no single mesh carries them all` : `material(s) ${entry.match.materialNames.join(", ")} appear on ${dedicated.length} separate meshes under "${entry.match.objectName}" — ambiguous, not registered`
				});
				continue;
			}
			registry.register(entry.id, dedicated[0], {
				type: entry.type,
				label: entry.label,
				capabilities: entry.capabilities,
				materialNames: entry.match.materialNames
			});
		} else registry.register(entry.id, object, {
			type: entry.type,
			label: entry.label,
			capabilities: entry.capabilities
		});
		report.satisfied.push(entry);
	}
	return {
		registry,
		report
	};
}
function materialNamesOn(object) {
	const names = /* @__PURE__ */ new Set();
	object.traverse((child) => {
		if (!(child instanceof Mesh)) return;
		for (const material of Array.isArray(child.material) ? child.material : [child.material]) if (material?.name) names.add(material.name);
	});
	return names;
}
/**
* Finds the mesh(es) under `node` whose material — single or array-slot — matches every name in
* `materialNames`, for registering a material-region entry against the *exact* object picking
* needs to resolve directly, rather than against `node` itself.
*
* This exists because of a real gap between two things that look similar but are not: a glTF
* "mesh" with several primitives (the 4Runner's and RAV4's `BODY`, ten primitives, one glTF
* material each) is not loaded by `GLTFLoader` as one `THREE.Mesh` with a ten-slot material array.
* `GLTFLoader.loadMesh` (`three/examples/jsm/loaders/GLTFLoader.js`) creates one `THREE.Mesh` per
* primitive and, whenever a glTF mesh has more than one, wraps them in a plain `THREE.Group` — so
* `root.getObjectByName("BODY")` on the real, running app returns a `Group` of ten single-material
* child meshes, never a single multi-material `Mesh`. A material-region entry registered against
* that `Group` with a `materialNames` filter (this file's previous behavior) could never be found
* by a raycast hit, because the hit object is always one specific child mesh with one plain
* `.material`, and nothing pointed a semantic ID at that child directly — every paint/glass/chrome/
* light part on both real vehicles was unselectable despite `buildSceneRegistry` reporting them
* "satisfied". Finding and registering the dedicated child mesh here is the actual fix; the
* multi-material-array case is kept as a fallback below only because a hand-built fixture or a
* different loader could still produce one, not because real assets in this repo ever do.
*/
function findDedicatedMeshForMaterials(node, materialNames) {
	const wanted = new Set(materialNames);
	const matches = [];
	node.traverse((child) => {
		if (!(child instanceof Mesh)) return;
		const materials = Array.isArray(child.material) ? child.material : [child.material];
		const names = new Set(materials.map((m) => m?.name).filter((name) => Boolean(name)));
		if (materialNames.length > 0 && materialNames.every((name) => names.has(name)) && names.size >= wanted.size) matches.push(child);
	});
	return matches;
}
var HIGHLIGHT_COLOR = {
	hover: "#3d7dff",
	selected: "#ffb000"
};
var HIGHLIGHT_EMISSIVE_INTENSITY = {
	hover: .35,
	selected: .6
};
var PartHighlighter = class {
	restoreById = /* @__PURE__ */ new Map();
	/** Whether `id` currently carries a highlight (either state). */
	has(id) {
		return this.restoreById.has(id);
	}
	/** Applies `state`'s tint to every mesh under `entry.object`, restoring any highlight already on `entry.id` first. */
	apply(entry, state) {
		this.clear(entry.id);
		const restores = [];
		for (const mesh of collectMeshes(entry.object)) {
			const original = mesh.material;
			restores.push({
				mesh,
				original
			});
			mesh.material = tintMaterial(original, entry.materialNames, state);
		}
		this.restoreById.set(entry.id, restores);
	}
	/** Restores `id`'s meshes to whatever material was assigned when `apply` ran, disposing the tint clones. */
	clear(id) {
		const restores = this.restoreById.get(id);
		if (!restores) return;
		for (const { mesh, original } of restores) {
			disposeMaterial(mesh.material, original);
			mesh.material = original;
		}
		this.restoreById.delete(id);
	}
	clearAll() {
		for (const id of [...this.restoreById.keys()]) this.clear(id);
	}
};
function collectMeshes(object) {
	if (object instanceof Mesh) return [object];
	const meshes = [];
	object.traverse((child) => {
		if (child instanceof Mesh) meshes.push(child);
	});
	return meshes;
}
/**
* Clones and tints `material`. For a multi-material mesh belonging to a material-region entry
* (`materialNames` set), only the named slot(s) are cloned — the rest of the array keeps its
* existing references, untouched and undisposed, exactly like `MaterialWriter.applyMaterialConfig`.
*/
function tintMaterial(material, materialNames, state) {
	if (!Array.isArray(material)) return tintOne(material, state);
	return material.map((slot) => !materialNames || materialNames.includes(slot.name) ? tintOne(slot, state) : slot);
}
function tintOne(material, state) {
	const clone = material.clone();
	clone.name = material.name;
	if (isEmissiveCapable(clone)) {
		clone.emissive = new Color(HIGHLIGHT_COLOR[state]);
		clone.emissiveIntensity = HIGHLIGHT_EMISSIVE_INTENSITY[state];
	}
	clone.needsUpdate = true;
	return clone;
}
function isEmissiveCapable(material) {
	return "emissive" in material && "emissiveIntensity" in material;
}
/** Disposes the tint clone(s) in `current`, skipping any slot that was left as the original (unlensed) reference. */
function disposeMaterial(current, original) {
	const originals = new Set(Array.isArray(original) ? original : [original]);
	for (const material of Array.isArray(current) ? current : [current]) if (!originals.has(material)) material.dispose();
}
/**
* Accelerated pointer picking for direct vehicle-part interaction.
*
* `three-mesh-bvh` replaces three's default per-triangle linear raycast with a bounding-volume
* hierarchy, which is the difference between "scan every triangle of a ~35k-tri wheel on every
* pointer move" and "descend a tree". The vehicle body alone (`BODY`, one mesh, ten material
* slots) is large enough that a hover-driven raycast without this would be a real per-frame cost,
* not a rounding error — see `docs/PERF_BUDGETS.md`.
*
* The monkey-patch below (`computeBoundsTree`/`disposeBoundsTree` on `BufferGeometry.prototype`,
* `acceleratedRaycast` on `Mesh.prototype.raycast`) is the library's documented integration point,
* applied once at module load. It is safe for meshes that never call `computeBoundsTree()` — the
* floor, grid, starfield, contact shadow, trail rocks — because `acceleratedRaycast` falls back to
* three's original per-triangle path whenever `geometry.boundsTree` is absent; nothing here changes
* behaviour for a mesh that was never opted in.
*/
var patched = false;
function installAcceleratedRaycasting() {
	if (patched) return;
	patched = true;
	BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
	BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
	Mesh.prototype.raycast = acceleratedRaycast;
}
/**
* Builds (and later disposes) bounds trees for every mesh under `root`, then resolves raycast
* intersections to `SceneRegistry` semantic IDs.
*
* One instance per loaded vehicle scene, mirroring `VehicleSceneController`'s lifecycle — bounds
* trees are per-geometry state, and geometry belongs to a specific loaded root, so this is
* `prepare`/`dispose` rather than a singleton.
*/
var VehiclePicker = class {
	registry;
	/**
	* Deliberately *not* a running list of every mesh a bounds tree was ever built for: a
	* mesh-replacement option (a wheel/tire style swap) detaches and disposes the previous mesh
	* mid-session, well before this picker's own `dispose()` runs at controller teardown. A
	* remembered array would keep referencing — and so keep alive — every such retired mesh's
	* geometry (bounds tree included) for the rest of the session, one leaked mesh per swap. Instead
	* `dispose()` below re-traverses whatever is actually under `root` *at teardown time*, which only
	* ever touches geometry that is still live.
	*/
	root = null;
	raycaster = new Raycaster();
	constructor(registry) {
		this.registry = registry;
		installAcceleratedRaycasting();
		this.raycaster.firstHitOnly = true;
	}
	/**
	* Computes a bounds tree for every mesh with geometry under `root`. Call once after the vehicle
	* root (and its registry) settle; safe to call again after mounting new geometry (e.g. an
	* accessory attach) since it only (re)builds meshes that do not already carry a tree.
	*/
	prepare(root) {
		this.root = root;
		root.traverse((object) => {
			if (!(object instanceof Mesh)) return;
			const geometry = object.geometry;
			if (!geometry || geometry.attributes.position === void 0) return;
			if (geometry.boundsTree) return;
			geometry.computeBoundsTree();
		});
	}
	/**
	* Raycasts from a normalized device coordinate (`pointer`, each axis in [-1, 1]) against
	* `root`, and resolves the nearest hit to a semantic ID via the registry. Returns `null` for a
	* miss, or a hit that resolves to no registered part (unselectable geometry — the floor, grid,
	* set dressing, or a vehicle whose scene map does not cover the hit node).
	*/
	pick(pointer, camera, root) {
		this.raycaster.setFromCamera(pointer, camera);
		const hit = this.raycaster.intersectObject(root, true)[0];
		if (!hit) return null;
		const materialName = materialNameAtHit(hit);
		const entry = this.registry.resolve(hit.object, materialName);
		if (!entry) return null;
		return {
			entry,
			point: hit.point,
			distance: hit.distance,
			object: hit.object
		};
	}
	/**
	* Releases the bounds tree of every mesh still under `root` at call time. Call from the same
	* teardown that disposes the root — after this, `root`'s geometries no longer carry a bounds
	* tree for `acceleratedRaycast` to fall back from, matching their disposed state.
	*/
	dispose() {
		this.root?.traverse((object) => {
			if (object instanceof Mesh && object.geometry?.boundsTree) object.geometry.disposeBoundsTree();
		});
		this.root = null;
	}
};
/**
* The material name at a raycast hit, for a mesh with per-face materials (three's multi-material
* convention: `geometry.groups[i].materialIndex` selects `material[materialIndex]` for the faces
* in that group, and `intersection.face.materialIndex` reports which group a hit face belongs to).
* `undefined` for a single-material mesh, which is exactly what `SceneRegistry.resolve` expects for
* an object-level (non-region) entry.
*/
function materialNameAtHit(hit) {
	const object = hit.object;
	if (!(object instanceof Mesh) || !Array.isArray(object.material)) return void 0;
	const index = hit.face?.materialIndex ?? 0;
	return object.material[index]?.name;
}
/** Normalized device coordinates from a client-space pointer event, for `VehiclePicker.pick`. */
function pointerToNdc(clientX, clientY, bounds) {
	return new Vector2((clientX - bounds.left) / bounds.width * 2 - 1, -((clientY - bounds.top) / bounds.height) * 2 + 1);
}
/**
* Owns every mutation applied to a loaded vehicle scene.
*
* One controller per loaded model. It holds the `MaterialWriter` (and therefore every cloned
* material), tracks attachments it made, and is the only thing in the codebase that writes to the
* scene graph — so teardown is a single `dispose()` rather than a scatter of cleanup callbacks.
*/
var VehicleSceneController = class {
	root;
	writer = new MaterialWriter();
	catalog;
	highlighter = new PartHighlighter();
	registry;
	picker;
	sceneMapReport;
	hoveredId;
	selectedId;
	/**
	* `sceneMap` is optional and defaults to empty so every existing call site (which predates
	* semantic scene identity) keeps compiling and behaving exactly as before — a controller built
	* with no scene map simply has no addressable parts, the same graceful-empty behavior
	* `buildSceneRegistry` gives any vehicle without one (`lib/data/sceneMap/index.ts`).
	*/
	constructor(root, catalog, sceneMap = []) {
		this.root = root;
		this.catalog = new Map(catalog.map((option) => [option.id, option]));
		const built = buildSceneRegistry(root, sceneMap);
		this.registry = built.registry;
		this.sceneMapReport = built.report;
		this.picker = new VehiclePicker(this.registry);
		this.picker.prepare(root);
	}
	/**
	* Accelerated raycast pick, resolved to a semantic part — the one entry point consumers need for
	* "what did the user click", so nothing outside this controller has to hold its own
	* `THREE.Raycaster` or reach into `root` directly. `pointer` is normalized device coordinates
	* (each axis in [-1, 1]; `pointerToNdc` in `lib/three/picking.ts` converts a client-space event).
	*/
	pickAt(pointer, camera) {
		return this.picker.pick(pointer, camera, this.root);
	}
	getOption(optionId) {
		return this.catalog.get(optionId);
	}
	getPart(id) {
		return this.registry.get(id);
	}
	hasPart(id) {
		return this.registry.has(id);
	}
	listParts() {
		return this.registry.list();
	}
	findPartsByType(type) {
		return this.registry.findByType(type);
	}
	findPartsByCapability(capability) {
		return this.registry.findByCapability(capability);
	}
	/** Resolves a raycast hit's object (and, for a multi-material mesh, the hit material name) to a semantic ID. Used by `VehiclePicker`. */
	resolvePart(object, materialName) {
		return this.registry.resolve(object, materialName);
	}
	get hoveredPartId() {
		return this.hoveredId;
	}
	get selectedPartId() {
		return this.selectedId;
	}
	paintHighlight(id, state) {
		const entry = this.registry.get(id);
		if (!entry || !entry.capabilities.includes("highlightable")) return false;
		this.highlighter.apply(entry, state);
		return true;
	}
	repaintHighlights() {
		if (this.selectedId) this.paintHighlight(this.selectedId, "selected");
		if (this.hoveredId && this.hoveredId !== this.selectedId) this.paintHighlight(this.hoveredId, "hover");
	}
	hoverPart(id) {
		if (this.hoveredId === id) return;
		if (this.hoveredId && this.hoveredId !== this.selectedId) this.highlighter.clear(this.hoveredId);
		this.hoveredId = id;
		this.repaintHighlights();
	}
	selectPart(id) {
		if (this.selectedId === id) return;
		const previouslySelected = this.selectedId;
		this.selectedId = id;
		if (previouslySelected) {
			this.highlighter.clear(previouslySelected);
			if (previouslySelected === this.hoveredId) this.paintHighlight(previouslySelected, "hover");
		}
		this.repaintHighlights();
	}
	clearSelection() {
		this.selectPart(void 0);
	}
	/**
	* Applies a single option. Returns `false` when the option's nodes are not present, which the
	* caller surfaces as an error rather than treating as success — a silent no-op here is exactly
	* the failure mode this integration exists to remove.
	*/
	async applyOption(option) {
		switch (option.operation) {
			case "material-update": return this.applyMaterialUpdate(option);
			case "texture-update": return this.applyTextureUpdate(option);
			case "mesh-visibility": return this.setVisibility(option, true);
			case "mesh-replacement": return this.applyMeshReplacement(option);
		}
	}
	/** Reverses an option. Only meaningful for the accumulating categories (accessory, decal). */
	async removeOption(option) {
		if (option.operation === "mesh-replacement") {
			const { found } = resolveNodes(this.root, option.mountNodes ?? []);
			for (const mount of found) detachFromMount(mount);
			this.restoreDisplaced(option);
			return found.length > 0;
		}
		return this.setVisibility(option, false);
	}
	/** Re-shows the nodes an option hid, used when that option is reversed. */
	restoreDisplaced(option) {
		const { found } = resolveNodes(this.root, option.hidesNodes ?? []);
		for (const node of found) node.visible = true;
	}
	/**
	* Applies custom paint-studio material params to the catalog paint slot.
	* Targets are resolved from the trusted catalog constants — never from the persisted payload.
	*/
	applyPaintStudio(paintStudio) {
		if (!paintStudio || paintStudio.mode !== "custom" || !paintStudio.material) return false;
		const meshes = resolveMeshes(this.root, [...PAINT_STUDIO_TARGET_NODES]);
		if (meshes.length === 0) return false;
		const config = materialConfigFromPaintStudio(paintStudio.material);
		return this.writer.applyMaterialConfig(meshes, [...PAINT_STUDIO_TARGET_MATERIALS], config) > 0;
	}
	applyMaterialUpdate(option) {
		if (!option.materialConfig) return false;
		const meshes = resolveMeshes(this.root, option.targetNodes ?? []);
		if (meshes.length === 0) return false;
		return this.writer.applyMaterialConfig(meshes, option.targetMaterials, option.materialConfig) > 0;
	}
	async applyTextureUpdate(option) {
		const textureUrl = option.materialConfig?.textureUrl;
		if (!textureUrl) return false;
		const meshes = resolveMeshes(this.root, option.targetNodes ?? []);
		if (meshes.length === 0) return false;
		if (await this.writer.applyTexture(meshes, option.targetMaterials, textureUrl) === 0) return false;
		if (option.materialConfig) this.writer.applyMaterialConfig(meshes, option.targetMaterials, {
			...option.materialConfig,
			textureUrl: void 0
		});
		const { found } = resolveNodes(this.root, option.targetNodes ?? []);
		for (const node of found) node.visible = true;
		const { found: displaced } = resolveNodes(this.root, option.hidesNodes ?? []);
		for (const node of displaced) node.visible = false;
		return true;
	}
	/**
	* Visibility toggle for variants baked into the base GLB. `hidesNodes` makes the mutual
	* exclusion between variants explicit in data, so adding a third hood is a catalog edit.
	*/
	setVisibility(option, visible) {
		const { found } = resolveNodes(this.root, option.targetNodes ?? []);
		if (found.length === 0) return false;
		for (const node of found) node.visible = visible;
		if (visible) {
			const { found: hidden } = resolveNodes(this.root, option.hidesNodes ?? []);
			for (const node of hidden) node.visible = false;
		}
		return true;
	}
	async applyMeshReplacement(option) {
		if (!option.assetUrl) return false;
		const { found: mounts } = resolveNodes(this.root, option.mountNodes ?? []);
		if (mounts.length === 0) return false;
		const source = await loadAsset(option.assetUrl);
		const { found: replaced } = resolveNodes(this.root, option.hidesNodes ?? []);
		for (const node of replaced) node.visible = false;
		for (const mount of mounts) attachToMount(mount, instantiateAsset(source), option.id);
		this.picker.prepare(this.root);
		return true;
	}
	/**
	* Applies a whole selection map in `CATEGORY_APPLY_ORDER`.
	*
	* Accumulating categories are reset to "off" across the entire catalog first, so restoring a
	* saved configuration produces the same scene regardless of what was on screen beforehand. That
	* idempotence is what makes a browser refresh reproduce the saved build exactly.
	*/
	async applyConfiguration(selections, paintStudio) {
		const applied = [];
		const failed = [];
		this.highlighter.clearAll();
		this.hoveredId = void 0;
		this.selectedId = void 0;
		this.writer.restoreOriginals();
		for (const option of this.catalog.values()) if (isMultiSelect(option.category)) await this.removeOption(option);
		for (const category of CATEGORY_APPLY_ORDER) for (const optionId of selections[category] ?? []) {
			const option = this.catalog.get(optionId);
			if (!option) {
				failed.push(optionId);
				continue;
			}
			(await this.applyOption(option) ? applied : failed).push(optionId);
		}
		if (paintStudio?.mode === "custom") this.applyPaintStudio(paintStudio);
		return {
			applied,
			failed
		};
	}
	/** Number of material clones currently held — asserted by the leak test. */
	get clonedMaterialCount() {
		return this.writer.clonedSlotCount;
	}
	dispose() {
		this.highlighter.clearAll();
		this.hoveredId = void 0;
		this.selectedId = void 0;
		this.picker.dispose();
		for (const option of this.catalog.values()) for (const mount of resolveNodes(this.root, option.mountNodes ?? []).found) detachFromMount(mount);
		this.writer.dispose();
		disposeSubtree(this.root);
		this.registry.clear();
	}
};
var SCENE_MAPS = {
	"4runner": [
		{
			id: "vehicle.root",
			type: "vehicle",
			label: "Vehicle",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "VEHICLE_ROOT"
			}
		},
		{
			id: "body.exterior",
			type: "body",
			label: "Exterior paint",
			capabilities: [
				"selectable",
				"paintable",
				"highlightable"
			],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["body.carmain"]
			}
		},
		{
			id: "body.trim.chrome",
			type: "trim",
			label: "Chrome trim",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["metal.chrome.004"]
			}
		},
		{
			id: "body.grille",
			type: "trim",
			label: "Grille",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "object",
				objectName: "Tun_GRILLE"
			}
		},
		{
			id: "glass.windshield",
			type: "glass",
			label: "Windshield",
			capabilities: ["selectable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.windows.windshield"]
			}
		},
		{
			id: "glass.rear-windshield",
			type: "glass",
			label: "Rear windshield",
			capabilities: ["selectable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.windows.rear.windshield"]
			}
		},
		{
			id: "glass.windows",
			type: "glass",
			label: "Side windows",
			capabilities: ["selectable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.windows"]
			}
		},
		{
			id: "headlight.assembly",
			type: "light",
			label: "Headlights",
			capabilities: [
				"selectable",
				"highlightable",
				"light"
			],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.light.002"]
			}
		},
		{
			id: "light.foglight",
			type: "light",
			label: "Fog lights",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["emissive.foglight"]
			}
		},
		{
			id: "light.brakelight",
			type: "light",
			label: "Brake lights",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["emissive.brakelights.001"]
			}
		},
		{
			id: "light.turnsignal",
			type: "light",
			label: "Turn signals",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["emissive.turnsignal.002"]
			}
		},
		{
			id: "wheel.front-left",
			type: "wheel",
			label: "Front-left wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "PLACED_WEISU_front_left"
			}
		},
		{
			id: "wheel.front-right",
			type: "wheel",
			label: "Front-right wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "PLACED_WEISU_front_right"
			}
		},
		{
			id: "wheel.rear-left",
			type: "wheel",
			label: "Rear-left wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "PLACED_WEISU_rear_left"
			}
		},
		{
			id: "wheel.rear-right",
			type: "wheel",
			label: "Rear-right wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "PLACED_WEISU_rear_right"
			}
		},
		{
			id: "tire.front-left",
			type: "tire",
			label: "Front-left tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "PLACED_KO3_front_left"
			}
		},
		{
			id: "tire.front-right",
			type: "tire",
			label: "Front-right tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "PLACED_KO3_front_right"
			}
		},
		{
			id: "tire.rear-left",
			type: "tire",
			label: "Rear-left tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "PLACED_KO3_rear_left"
			}
		},
		{
			id: "tire.rear-right",
			type: "tire",
			label: "Rear-right tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "PLACED_KO3_rear_right"
			}
		},
		{
			id: "accessory.roof-rack",
			type: "accessory",
			label: "Roof rack",
			capabilities: [
				"selectable",
				"highlightable",
				"accessory"
			],
			match: {
				kind: "object",
				objectName: "ACCESSORY_ROOF_RACK"
			}
		},
		{
			id: "accessory.light-bar",
			type: "accessory",
			label: "Light bar",
			capabilities: [
				"selectable",
				"highlightable",
				"accessory"
			],
			match: {
				kind: "object",
				objectName: "ACCESSORY_LIGHT_BAR"
			}
		},
		{
			id: "accessory.rock-sliders",
			type: "accessory",
			label: "Rock sliders",
			capabilities: [
				"selectable",
				"highlightable",
				"accessory"
			],
			match: {
				kind: "object",
				objectName: "ACCESSORY_ROCK_SLIDERS"
			}
		},
		{
			id: "accessory.underglow",
			type: "accessory",
			label: "Underglow",
			capabilities: ["selectable", "accessory"],
			match: {
				kind: "object",
				objectName: "ACCESSORY_UNDERGLOW"
			}
		},
		{
			id: "accessory.fog-lights",
			type: "accessory",
			label: "Fog lights (accessory)",
			capabilities: ["selectable", "accessory"],
			match: {
				kind: "object",
				objectName: "ACCESSORY_FOG_LIGHTS"
			}
		},
		{
			id: "badge.front",
			type: "badge",
			label: "Front badge",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "LOGO",
				materialNames: ["metal.chrome.002"]
			}
		},
		{
			id: "badge.backing",
			type: "badge",
			label: "Badge backing plate",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "LOGO",
				materialNames: ["plastik.all.001"]
			}
		},
		{
			id: "headlight.lens",
			type: "light",
			label: "Headlight lens",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_HEADLIGHTS",
				materialNames: ["glass.light"]
			}
		},
		{
			id: "headlight.bezel",
			type: "trim",
			label: "Headlight bezel",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_HEADLIGHTS",
				materialNames: ["metal.chrome.001"]
			}
		},
		{
			id: "headlight.housing",
			type: "trim",
			label: "Headlight housing",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_HEADLIGHTS",
				materialNames: ["plastik.all"]
			}
		},
		{
			id: "headlight.sidelight",
			type: "light",
			label: "Headlight sidelight",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_HEADLIGHTS",
				materialNames: ["emissive.sidelights"]
			}
		},
		{
			id: "headlight.turnsignal",
			type: "light",
			label: "Front turn signal",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_HEADLIGHTS",
				materialNames: ["emissive.turnsignal"]
			}
		},
		{
			id: "headlight.beam",
			type: "light",
			label: "Headlight beam",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_HEADLIGHTS",
				materialNames: ["emissive.headlight"]
			}
		},
		{
			id: "taillight.lens",
			type: "light",
			label: "Taillight lens",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_TAILLIGHTS",
				materialNames: ["glass.light.001"]
			}
		},
		{
			id: "taillight.bezel",
			type: "trim",
			label: "Taillight bezel",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_TAILLIGHTS",
				materialNames: ["metal.chrome.003"]
			}
		},
		{
			id: "taillight.housing",
			type: "trim",
			label: "Taillight housing",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_TAILLIGHTS",
				materialNames: ["plastik.all.002"]
			}
		},
		{
			id: "taillight.brakelight",
			type: "light",
			label: "Rear brake light",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_TAILLIGHTS",
				materialNames: ["emissive.brakelights"]
			}
		},
		{
			id: "taillight.turnsignal",
			type: "light",
			label: "Rear turn signal",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_TAILLIGHTS",
				materialNames: ["emissive.turnsignal.001"]
			}
		},
		{
			id: "taillight.beam",
			type: "light",
			label: "Taillight beam",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "DEFAULT_TAILLIGHTS",
				materialNames: ["emissive.taillight"]
			}
		},
		{
			id: "trim.exhaust-tip",
			type: "trim",
			label: "Exhaust tip",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "object",
				objectName: "EXHAUST"
			}
		},
		{
			id: "trim.tow-hook",
			type: "trim",
			label: "Tow hook",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "object",
				objectName: "Tow Hooks Compatible"
			}
		},
		{
			id: "caliper.front-left",
			type: "trim",
			label: "Front-left brake caliper",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "PLACED_AOOA_caliper_front_left",
				materialNames: ["paint_brake_caliper"]
			}
		},
		{
			id: "caliper.front-right",
			type: "trim",
			label: "Front-right brake caliper",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "PLACED_AOOA_caliper_front_right",
				materialNames: ["paint_brake_caliper"]
			}
		},
		{
			id: "caliper.rear-left",
			type: "trim",
			label: "Rear-left brake caliper",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "PLACED_AOOA_caliper_rear_left",
				materialNames: ["paint_brake_caliper"]
			}
		},
		{
			id: "caliper.rear-right",
			type: "trim",
			label: "Rear-right brake caliper",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "PLACED_AOOA_caliper_rear_right",
				materialNames: ["paint_brake_caliper"]
			}
		},
		{
			id: "door.front-left",
			type: "door",
			label: "Front-left door",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "DOOR_FRONT_LEFT"
			}
		},
		{
			id: "door.front-right",
			type: "door",
			label: "Front-right door",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "DOOR_FRONT_RIGHT"
			}
		},
		{
			id: "mirror.left",
			type: "mirror",
			label: "Left mirror",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "MIRROR_LEFT"
			}
		},
		{
			id: "mirror.right",
			type: "mirror",
			label: "Right mirror",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "MIRROR_RIGHT"
			}
		},
		{
			id: "interior",
			type: "interior",
			label: "Interior",
			capabilities: ["selectable", "paintable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["interior.seat"]
			}
		},
		{
			id: "roof",
			type: "roof",
			label: "Roof",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "ROOF"
			}
		}
	],
	ae86: [
		{
			id: "vehicle.root",
			type: "vehicle",
			label: "Vehicle",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "RootNode"
			}
		},
		{
			id: "body.exterior",
			type: "body",
			label: "Exterior paint",
			capabilities: [
				"selectable",
				"paintable",
				"highlightable"
			],
			match: {
				kind: "material-region",
				objectName: "Car",
				materialNames: ["Body"]
			}
		},
		{
			id: "wheel.1",
			type: "wheel",
			label: "Wheel 1",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "Wheel1"
			}
		},
		{
			id: "wheel.2",
			type: "wheel",
			label: "Wheel 2",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "Wheel2"
			}
		},
		{
			id: "wheel.3",
			type: "wheel",
			label: "Wheel 3",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "Wheel3"
			}
		},
		{
			id: "wheel.4",
			type: "wheel",
			label: "Wheel 4",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "Wheel4"
			}
		}
	],
	rav4: [
		{
			id: "vehicle.root",
			type: "vehicle",
			label: "Vehicle",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "VEHICLE_ROOT"
			}
		},
		{
			id: "body.exterior",
			type: "body",
			label: "Exterior paint",
			capabilities: [
				"selectable",
				"paintable",
				"highlightable"
			],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["body.carmain"]
			}
		},
		{
			id: "body.trim.chrome",
			type: "trim",
			label: "Chrome trim",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["metal.chrome"]
			}
		},
		{
			id: "body.trim.plastic",
			type: "trim",
			label: "Black plastic trim",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["plastik.all"]
			}
		},
		{
			id: "glass.windshield",
			type: "glass",
			label: "Windshield",
			capabilities: ["selectable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.windows.windshield"]
			}
		},
		{
			id: "glass.rear-windshield",
			type: "glass",
			label: "Rear windshield",
			capabilities: ["selectable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.windows.rear.windshield"]
			}
		},
		{
			id: "glass.windows",
			type: "glass",
			label: "Side windows",
			capabilities: ["selectable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.windows"]
			}
		},
		{
			id: "headlight.assembly",
			type: "light",
			label: "Headlights",
			capabilities: [
				"selectable",
				"highlightable",
				"light"
			],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["glass.light"]
			}
		},
		{
			id: "light.foglight",
			type: "light",
			label: "Fog lights",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["emissive.foglight"]
			}
		},
		{
			id: "light.brakelight",
			type: "light",
			label: "Brake lights",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["emissive.brakelights"]
			}
		},
		{
			id: "light.turnsignal",
			type: "light",
			label: "Turn signals",
			capabilities: ["selectable", "light"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["emissive.turnsignal"]
			}
		},
		{
			id: "wheel.front-left",
			type: "wheel",
			label: "Front-left wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "WHEEL_MESH_FRONT_LEFT"
			}
		},
		{
			id: "wheel.front-right",
			type: "wheel",
			label: "Front-right wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "WHEEL_MESH_FRONT_RIGHT"
			}
		},
		{
			id: "wheel.rear-left",
			type: "wheel",
			label: "Rear-left wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "WHEEL_MESH_REAR_LEFT"
			}
		},
		{
			id: "wheel.rear-right",
			type: "wheel",
			label: "Rear-right wheel",
			capabilities: [
				"selectable",
				"highlightable",
				"wheel"
			],
			match: {
				kind: "object",
				objectName: "WHEEL_MESH_REAR_RIGHT"
			}
		},
		{
			id: "tire.front-left",
			type: "tire",
			label: "Front-left tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "TIRE_MESH_FRONT_LEFT"
			}
		},
		{
			id: "tire.front-right",
			type: "tire",
			label: "Front-right tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "TIRE_MESH_FRONT_RIGHT"
			}
		},
		{
			id: "tire.rear-left",
			type: "tire",
			label: "Rear-left tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "TIRE_MESH_REAR_LEFT"
			}
		},
		{
			id: "tire.rear-right",
			type: "tire",
			label: "Rear-right tire",
			capabilities: ["selectable", "tire"],
			match: {
				kind: "object",
				objectName: "TIRE_MESH_REAR_RIGHT"
			}
		},
		{
			id: "door.front-left",
			type: "door",
			label: "Front-left door",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "DOOR_FRONT_LEFT"
			}
		},
		{
			id: "door.front-right",
			type: "door",
			label: "Front-right door",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "DOOR_FRONT_RIGHT"
			}
		},
		{
			id: "mirror.left",
			type: "mirror",
			label: "Left mirror",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "MIRROR_LEFT"
			}
		},
		{
			id: "mirror.right",
			type: "mirror",
			label: "Right mirror",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "MIRROR_RIGHT"
			}
		},
		{
			id: "badge.front",
			type: "badge",
			label: "Front badge",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "BADGE_FRONT"
			}
		},
		{
			id: "grille",
			type: "trim",
			label: "Grille",
			capabilities: ["selectable", "highlightable"],
			match: {
				kind: "object",
				objectName: "GRILLE"
			}
		},
		{
			id: "interior",
			type: "interior",
			label: "Interior",
			capabilities: ["selectable", "paintable"],
			match: {
				kind: "material-region",
				objectName: "BODY",
				materialNames: ["interior.seat"]
			}
		},
		{
			id: "roof",
			type: "roof",
			label: "Roof",
			capabilities: ["selectable"],
			match: {
				kind: "object",
				objectName: "ROOF"
			}
		}
	]
};
/**
* Camry and Tacoma have no detailed GLB today (`hasModel: false` in `lib/data/vehicles/*.ts`) and
* so no scene map: `buildSceneRegistry` against an empty map registers nothing, and every
* `SceneRegistry` query on it returns "not found" rather than throwing — the same graceful
* degradation a vehicle with a partial map gets, just total instead of partial.
*/
function getSceneMapForVehicle(slug) {
	return SCENE_MAPS[slug] ?? [];
}
/**
* Procedurally-built accessories and the low-detail fallback vehicle.
*
* These parts exist in code rather than in a GLB, but they join the scene under the same node-name
* contract as authored geometry (`ACCESSORY_*`), so the customization catalog addresses them
* exactly like GLB nodes. Catalog entries that target them set `geometrySource: "procedural-preview"`
* so the UI can label them Preview. Replacing them with authored assets later means clearing that
* flag (and usually switching to `mesh-replacement` + `assetUrl`) — the option ids, and therefore
* every saved configuration, are unaffected.
*/
var ACCESSORY_NODE_NAMES = {
	roofRack: "ACCESSORY_ROOF_RACK",
	lightBar: "ACCESSORY_LIGHT_BAR",
	rockSliders: "ACCESSORY_ROCK_SLIDERS",
	underglow: "ACCESSORY_UNDERGLOW",
	fogLights: "ACCESSORY_FOG_LIGHTS"
};
/**
* Attaches the accessory groups to a loaded vehicle root, hidden.
*
* Hidden is the correct initial state: a restored configuration turns on exactly what it recorded,
* so anything not in the saved selections must start off. Building them eagerly (rather than on
* first selection) keeps toggling allocation-free.
*/
function buildProceduralAccessories(root) {
	const black = new MeshPhysicalMaterial({
		color: "#080a0c",
		roughness: .34,
		metalness: .55
	});
	const amber = new MeshStandardMaterial({
		color: "#ffb000",
		emissive: "#ff8a00",
		emissiveIntensity: 5
	});
	const roofRack = new Group();
	roofRack.name = ACCESSORY_NODE_NAMES.roofRack;
	roofRack.position.set(0, 1.88, -.2);
	for (const x of [-.76, .76]) roofRack.add(positionedBox(.08, .09, 2.42, .025, black, x, 0, 0));
	for (const z of [-1.16, 1.16]) roofRack.add(positionedBox(1.6, .09, .08, .025, black, 0, 0, z));
	for (const z of [
		-.78,
		-.39,
		0,
		.39,
		.78
	]) roofRack.add(positionedBox(1.48, .055, .055, .018, black, 0, 0, z));
	for (const x of [-.68, .68]) for (const z of [-.88, .88]) roofRack.add(positionedBox(.1, .15, .13, .02, black, x, -.1, z));
	const lightBar = new Group();
	lightBar.name = ACCESSORY_NODE_NAMES.lightBar;
	lightBar.position.set(0, .72, 2.38);
	lightBar.add(roundedBox(1.46, .1, .12, .025, black));
	for (let i = -7; i <= 7; i++) {
		const lamp = new Mesh(new SphereGeometry(.038, 10, 8), amber);
		lamp.position.set(i * .092, 0, .07);
		lightBar.add(lamp);
	}
	const sliders = new Group();
	sliders.name = ACCESSORY_NODE_NAMES.rockSliders;
	for (const x of [-1.01, 1.01]) {
		sliders.add(positionedBox(.12, .1, 2.55, .03, black, x, .54, -.04));
		for (const z of [-.72, .72]) sliders.add(positionedBox(.1, .2, .08, .02, black, x * .91, .63, z));
	}
	const underglowMaterial = new MeshBasicMaterial({
		color: "#5ad1ff",
		toneMapped: false
	});
	const underglow = new Group();
	underglow.name = ACCESSORY_NODE_NAMES.underglow;
	for (const x of [-1.06, 1.06]) underglow.add(positionedBox(.05, .04, 3.7, .015, underglowMaterial, x, .1, 0));
	for (const z of [-2.28, 2.28]) underglow.add(positionedBox(1.9, .04, .05, .015, underglowMaterial, 0, .1, z));
	const fogLights = new Group();
	fogLights.name = ACCESSORY_NODE_NAMES.fogLights;
	for (const x of [-.62, .62]) {
		const lens = new Mesh(new CylinderGeometry(.09, .09, .05, 16), amber);
		lens.rotation.x = Math.PI / 2;
		lens.position.set(x, .36, 2.26);
		fogLights.add(lens);
		const lamp = new PointLight("#ffdca8", 3, 5, 2);
		lamp.position.set(x, .36, 2.3);
		lamp.castShadow = false;
		fogLights.add(lamp);
	}
	for (const group of [
		roofRack,
		lightBar,
		sliders,
		underglow,
		fogLights
	]) {
		group.visible = false;
		group.traverse((object) => {
			if (object instanceof Mesh) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		});
		root.add(group);
	}
}
/** Low-detail stand-in used when the detailed GLB cannot be fetched or decoded. */
function createProceduralVehicle() {
	const root = new Group();
	const paint = new MeshPhysicalMaterial({
		color: "#1558d6",
		metalness: .72,
		roughness: .24,
		clearcoat: 1,
		clearcoatRoughness: .08
	});
	paint.name = "body.carmain";
	const body = roundedBox(2.2, 1.1, 4.9, .18, paint);
	body.name = "BODY";
	body.position.y = 1.05;
	root.add(body);
	const rubber = new MeshStandardMaterial({
		color: "#111214",
		roughness: .92
	});
	rubber.name = "tire.sidewall";
	const alloy = new MeshStandardMaterial({
		color: "#656b74",
		metalness: .82,
		roughness: .24
	});
	alloy.name = "wheel.metal";
	for (const [tireSuffix, wheelSuffix, x, z] of [
		[
			"front_left",
			"front_left",
			.83,
			1.53
		],
		[
			"front_right",
			"front_right",
			-.83,
			1.53
		],
		[
			"rear_left",
			"rear_left",
			.83,
			-1.28
		],
		[
			"rear_right",
			"rear_right",
			-.83,
			-1.28
		]
	]) {
		const tire = new Mesh(new TorusGeometry(.43, .15, 16, 32), rubber);
		tire.name = `PLACED_KO3_${tireSuffix}`;
		tire.rotation.y = Math.PI / 2;
		tire.position.set(x, .43, z);
		root.add(tire);
		const rim = new Mesh(new CylinderGeometry(.27, .27, .16, 20), alloy);
		rim.name = `PLACED_WEISU_${wheelSuffix}`;
		rim.rotation.z = Math.PI / 2;
		rim.position.set(x, .43, z);
		root.add(rim);
	}
	return root;
}
function roundedBox(width, height, depth, radius, material) {
	const shape = new Shape();
	const x = -width / 2;
	const y = -height / 2;
	shape.moveTo(x + radius, y);
	shape.lineTo(x + width - radius, y);
	shape.quadraticCurveTo(x + width, y, x + width, y + radius);
	shape.lineTo(x + width, y + height - radius);
	shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	shape.lineTo(x + radius, y + height);
	shape.quadraticCurveTo(x, y + height, x, y + height - radius);
	shape.lineTo(x, y + radius);
	shape.quadraticCurveTo(x, y, x + radius, y);
	const geometry = new ExtrudeGeometry(shape, {
		depth,
		bevelEnabled: true,
		bevelSegments: 3,
		steps: 1,
		bevelSize: radius * .55,
		bevelThickness: radius * .55
	});
	geometry.center();
	return new Mesh(geometry, material);
}
function positionedBox(width, height, depth, radius, material, x, y, z) {
	const mesh = roundedBox(width, height, depth, radius, material);
	mesh.position.set(x, y, z);
	return mesh;
}
function initialProgressiveState() {
	return {
		phase: "idle",
		usedPlaceholder: false,
		hasDetailedModel: false
	};
}
/**
* Pure transition. Invalid events for the current phase are ignored (state returned unchanged)
* so the canvas can fire hooks defensively during teardown.
*/
function reduceProgressiveLoad(state, event) {
	switch (event.type) {
		case "no-model": return {
			phase: "ready",
			usedPlaceholder: false,
			hasDetailedModel: false
		};
		case "start-placeholder":
			if (state.phase !== "idle") return state;
			return {
				phase: "placeholder",
				usedPlaceholder: true,
				hasDetailedModel: false
			};
		case "start-loading":
			if (state.phase !== "placeholder" && state.phase !== "idle") return state;
			return {
				phase: "loading-glb",
				usedPlaceholder: state.usedPlaceholder || state.phase === "placeholder",
				hasDetailedModel: false
			};
		case "glb-decoded":
			if (state.phase !== "loading-glb" && state.phase !== "placeholder") return state;
			return {
				...state,
				phase: "settling",
				hasDetailedModel: true
			};
		case "settled":
			if (state.phase === "settling") return {
				...state,
				phase: "ready"
			};
			return state;
		case "load-failed": return {
			phase: "fallback",
			usedPlaceholder: state.usedPlaceholder,
			hasDetailedModel: false
		};
		default: return state;
	}
}
/**
* Respects `prefers-reduced-motion` across the showroom's animated surfaces.
*
* The 3D stage animates in five places — ride-height changes, camera preset moves, the
* cinematic tour timeline, the placeholder-to-vehicle cross-fade, and OrbitControls' inertial damping — and none of them
* consulted the user's motion preference. For someone with a vestibular disorder, a camera that
* swings across the scene over 0.85 s is not a flourish; it is the specific thing the OS-level
* setting exists to turn off.
*
* ## Why this is queried per animation rather than read once
*
* The preference can change mid-session: a user toggles it in system settings precisely *because*
* a page is making them ill, and a value captured at mount would ignore that until reload. Reading
* the media query at each call site costs a `matchMedia` lookup on an interaction boundary — never
* in the render loop — which is far below the noise floor here.
*
* ## What "reduced" means in this codebase
*
* Reduced, not removed. Every one of these animations communicates a state change — the vehicle
* settled at a new ride height, the camera arrived somewhere else, the real model replaced its
* placeholder. Cutting them to zero duration preserves that information as an instant transition,
* which is what the spec asks for: the end state still happens, the journey to it does not.
*/
/**
* Whether the user has asked for reduced motion.
*
* Returns `false` when `matchMedia` is unavailable (server render, older test environments)
* rather than throwing. That default is the honest one: a browser that cannot express the
* preference has not expressed it, and every call site here is inside a client-only effect where
* the real value is available by the time it matters.
*/
function prefersReducedMotion() {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/**
* Collapses an animation duration to zero when reduced motion is requested.
*
* Zero rather than a small non-zero value: GSAP treats a zero duration as an immediate set, so the
* tween's `onComplete` still fires and the end state is still reached through the same code path.
* Call sites therefore need no branch of their own, which is what keeps this from being a rule
* that quietly stops being applied to whichever animation someone adds next.
*/
function motionDuration(seconds) {
	return prefersReducedMotion() ? 0 : seconds;
}
/**
* Preferred cinematic path: hero establishing shot → wheels close-up → interior/cabin framing.
* Catalogs that author these `presetId`s get that path; otherwise the tour walks every preset
* in catalog order so a vehicle without the named shots still has a playable sequence.
*/
var TOUR_PRESET_IDS = [
	"hero",
	"wheels",
	"interior"
];
/** Seconds per camera move and per rest between shots (collapsed to 0 under reduced motion). */
var STEP_DURATION_SECONDS = 1.6;
var HOLD_DURATION_SECONDS = .55;
/**
* Picks the hero → wheels → interior path when at least two of those ids exist; otherwise the
* full catalog list. A single matching id is not enough — a one-stop "tour" is just a preset
* click, and falling back keeps Play useful on thin catalogs.
*/
function resolveTourPresets(presets) {
	const byId = new Map(presets.map((preset) => [preset.id, preset]));
	const preferred = TOUR_PRESET_IDS.map((id) => byId.get(id)).filter((preset) => preset !== void 0);
	if (preferred.length >= 2) return preferred;
	return presets.slice();
}
/**
* GSAP timeline over camera position + orbit target, sequenced from catalog presets.
*
* ## Orbit hand-off
*
* While playing or paused, OrbitControls is disabled so damping/drag cannot write the same
* vectors GSAP is tweening. Pointer-down or wheel on the canvas cancels the tour, re-enables
* controls, and leaves the camera where it stopped — so a cancelled tour never "fights" the user.
* Pause keeps controls seized so Resume continues the same timeline; Cancel (or an interrupt)
* is the explicit hand-back.
*/
function createCinematicTour(targets, initialPresets, callbacks = {}) {
	let presets = resolveTourPresets(initialPresets);
	let status = "idle";
	let timeline = null;
	const setStatus = (next) => {
		status = next;
		callbacks.onStatusChange?.(next);
	};
	const killCameraTweens = () => {
		gsapWithCSS.killTweensOf(targets.cameraPosition);
		gsapWithCSS.killTweensOf(targets.cameraTarget);
	};
	const releaseControls = () => {
		targets.setControlsEnabled(true);
	};
	const seizeControls = () => {
		targets.setControlsEnabled(false);
	};
	const buildTimeline = () => {
		killCameraTweens();
		if (timeline) {
			timeline.kill();
			timeline = null;
		}
		const tl = gsapWithCSS.timeline({
			paused: true,
			onComplete: () => {
				timeline = null;
				releaseControls();
				setStatus("idle");
				callbacks.onComplete?.();
			}
		});
		presets.forEach((preset, index) => {
			const duration = motionDuration(STEP_DURATION_SECONDS);
			const hold = motionDuration(HOLD_DURATION_SECONDS);
			tl.call(() => {
				callbacks.onStep?.(preset, index);
			});
			tl.to(targets.cameraPosition, {
				x: preset.position[0],
				y: preset.position[1],
				z: preset.position[2],
				duration,
				ease: "power3.inOut"
			});
			tl.to(targets.cameraTarget, {
				x: preset.target[0],
				y: preset.target[1],
				z: preset.target[2],
				duration,
				ease: "power3.inOut"
			}, "<");
			if (hold > 0) tl.to({}, { duration: hold });
		});
		timeline = tl;
		return tl;
	};
	const onUserInterrupt = () => {
		if (status === "playing" || status === "paused") cancel();
	};
	const dom = targets.domElement ?? null;
	if (dom) {
		dom.addEventListener("pointerdown", onUserInterrupt);
		dom.addEventListener("wheel", onUserInterrupt, { passive: true });
	}
	function play() {
		if (presets.length === 0) return;
		if (status === "paused" && timeline) {
			seizeControls();
			timeline.play();
			setStatus("playing");
			return;
		}
		seizeControls();
		const tl = buildTimeline();
		setStatus("playing");
		tl.play();
	}
	function pause() {
		if (status !== "playing" || !timeline) return;
		timeline.pause();
		setStatus("paused");
	}
	function cancel() {
		if (status === "idle" && !timeline) return;
		const wasActive = status !== "idle";
		if (timeline) {
			timeline.kill();
			timeline = null;
		}
		killCameraTweens();
		releaseControls();
		setStatus("idle");
		if (wasActive) callbacks.onCancel?.();
	}
	function dispose() {
		cancel();
		if (dom) {
			dom.removeEventListener("pointerdown", onUserInterrupt);
			dom.removeEventListener("wheel", onUserInterrupt);
		}
	}
	return {
		play,
		pause,
		cancel,
		dispose,
		get status() {
			return status;
		},
		setPresets(next) {
			presets = resolveTourPresets(next);
		}
	};
}
/** The exact defaults `VehicleCanvas.tsx` hardcoded before this extraction — unchanged. */
var DEFAULT_CAMERA_LIMITS = {
	minDistance: 4,
	maxDistance: 15,
	maxPolarAngle: Math.PI * .49
};
/** Seconds for a manual preset-button transition (collapsed under reduced motion). */
var PRESET_TRANSITION_SECONDS = .85;
/** Seconds for a `focusPoint` move — same feel as a preset transition, not a separate constant. */
var FOCUS_TRANSITION_SECONDS = PRESET_TRANSITION_SECONDS;
/** Multiplies the bounding-sphere radius when choosing a framing distance in `focusPoint` — enough
* headroom that the part doesn't touch the viewport edges, not so much it reads as "zoomed out". */
var DEFAULT_FOCUS_PADDING = 1.6;
/** Radians per keyboard orbit step — `KEYBOARD_ORBIT_STEP_RADIANS` in the pre-extraction component. */
var KEYBOARD_ORBIT_STEP_RADIANS = .12;
/** Metres per keyboard dolly step — `KEYBOARD_ZOOM_STEP` in the pre-extraction component. */
var KEYBOARD_ZOOM_STEP = .6;
var CameraController = class {
	camera;
	controls;
	tour;
	limits;
	disposed = false;
	/** Full preset list as given, independent of the tour's own `resolveTourPresets`-filtered copy —
	* `getPresets()` and a by-id lookup (`VehicleSceneAgentApi.mutate.camera.setPreset`, Priority 4)
	* need the real catalog list, not the hero/wheels/interior shot order the tour walks. */
	presets;
	activePresetId;
	constructor(options) {
		this.limits = {
			...DEFAULT_CAMERA_LIMITS,
			...options.limits
		};
		this.presets = options.presets;
		this.activePresetId = options.initialPreset.id;
		this.camera = new PerspectiveCamera(options.fov ?? 38, 1, options.near ?? .05, options.far ?? 100);
		this.camera.position.set(...options.initialPreset.position);
		this.controls = new OrbitControls(this.camera, options.domElement);
		this.controls.enableDamping = !prefersReducedMotion();
		this.controls.minDistance = this.limits.minDistance;
		this.controls.maxDistance = this.limits.maxDistance;
		this.controls.maxPolarAngle = this.limits.maxPolarAngle;
		this.controls.target.set(...options.initialPreset.target);
		this.tour = createCinematicTour({
			cameraPosition: this.camera.position,
			cameraTarget: this.controls.target,
			setControlsEnabled: (enabled) => {
				this.controls.enabled = enabled;
			},
			domElement: options.domElement
		}, options.presets, {
			onStatusChange: options.onTourStatusChange,
			onStep: options.onTourStep
		});
	}
	/** True while the cinematic tour owns the camera — callers should suppress their own preset-change reactions. */
	get isTourActive() {
		return this.tour.status !== "idle";
	}
	get tourStatus() {
		return this.tour.status;
	}
	playTour() {
		this.tour.play();
	}
	pauseTour() {
		this.tour.pause();
	}
	/** Cancels the tour and hands control back to `OrbitControls`, leaving the camera where it stopped. */
	cancelTour() {
		this.tour.cancel();
	}
	/** Re-resolves the tour's shot order — call when the vehicle's catalog presets change. */
	setPresets(presets) {
		this.presets = presets;
		this.tour.setPresets(presets);
	}
	/** The full preset list as given to the constructor/`setPresets` — plain data, safe for any
	* caller (`VehicleSceneAgentApi.read.getCameraPresets`, Priority 4) to hand further outward. */
	getPresets() {
		return this.presets;
	}
	/** Current pose, active preset, and tour status as plain data — no live camera/controls reference. */
	getState() {
		return {
			position: this.camera.position.toArray(),
			target: this.controls.target.toArray(),
			presetId: this.activePresetId,
			tourStatus: this.tour.status
		};
	}
	/** Per-frame tick: advances `OrbitControls` damping. Call once before each render. */
	update() {
		this.controls.update();
	}
	/** Keeps the projection matrix in sync with the canvas's CSS size. */
	setAspect(width, height) {
		this.camera.aspect = width / Math.max(height, 1);
		this.camera.updateProjectionMatrix();
	}
	/**
	* Smoothly moves to `preset` (a manual preset-button pick). Reduced motion collapses this to an
	* instant set via the same GSAP call site (`motionDuration` returns 0, and GSAP treats a
	* zero-duration tween as an immediate set) rather than a separate branch.
	*/
	transitionToPreset(preset) {
		this.activePresetId = preset.id;
		const duration = motionDuration(PRESET_TRANSITION_SECONDS);
		gsapWithCSS.to(this.camera.position, {
			x: preset.position[0],
			y: preset.position[1],
			z: preset.position[2],
			duration,
			ease: "power3.inOut"
		});
		gsapWithCSS.to(this.controls.target, {
			x: preset.target[0],
			y: preset.target[1],
			z: preset.target[2],
			duration,
			ease: "power3.inOut"
		});
	}
	/**
	* Instantly snaps to `preset` with no tween — the Home-key "back to the active preset" escape
	* hatch from a lost orbit. Cancels any in-flight tour first, the same hand-off keyboard orbit
	* already performs, so GSAP and this direct write never fight over `camera.position`/
	* `controls.target` for a frame.
	*/
	resetToPreset(preset) {
		if (this.isTourActive) this.tour.cancel();
		this.activePresetId = preset.id;
		this.camera.position.set(...preset.position);
		this.controls.target.set(...preset.target);
		this.controls.update();
	}
	/**
	* Orbits by a spherical delta about the current target, clamped to the same polar/distance
	* limits pointer input is constrained by. Cancels an in-flight tour first — the same keyboard
	* orbit vs. GSAP hand-off `resetToPreset` performs.
	*/
	orbitBy(deltaTheta, deltaPhi) {
		if (this.isTourActive) this.tour.cancel();
		const offset = this.camera.position.clone().sub(this.controls.target);
		const spherical = new Spherical().setFromVector3(offset);
		spherical.theta += deltaTheta;
		spherical.phi += deltaPhi;
		spherical.phi = Math.min(Math.max(spherical.phi, .05), this.controls.maxPolarAngle);
		spherical.radius = Math.min(Math.max(spherical.radius, this.controls.minDistance), this.controls.maxDistance);
		this.camera.position.copy(offset.setFromSpherical(spherical).add(this.controls.target));
		this.controls.update();
	}
	/** Dollies by `deltaMeters` (positive moves away from the target), clamped to the distance limits. */
	dollyBy(deltaMeters) {
		if (this.isTourActive) this.tour.cancel();
		const offset = this.camera.position.clone().sub(this.controls.target);
		const spherical = new Spherical().setFromVector3(offset);
		spherical.radius = Math.min(Math.max(spherical.radius + deltaMeters, this.controls.minDistance), this.controls.maxDistance);
		this.camera.position.copy(offset.setFromSpherical(spherical).add(this.controls.target));
		this.controls.update();
	}
	/**
	* Frames a world-space bounding sphere — `center`/`radius` from `VehicleSceneAgentApi.read.
	* focusPart` (`lib/agent/sceneApi.ts`, backed by `THREE.Box3.setFromObject` on the part's real
	* geometry). Keeps the camera's current viewing angle (spherical theta/phi about the target) and
	* only changes distance and target, so this reframes on the part rather than reorienting the
	* whole shot — a `resetToPreset`-style angle jump would be jarring for "show me this part" versus
	* "show me this angle".
	*
	* Distance is chosen so the sphere fits the vertical FOV with `padding` headroom, clamped to the
	* same distance limits every other move respects, and moved to via the same GSAP tween
	* `transitionToPreset` uses (reduced-motion aware). Does not change `activePresetId` — focusing a
	* part is not "picking a different preset", the same way `orbitBy`/`dollyBy` leave it alone.
	*/
	focusPoint(center, radius, padding = DEFAULT_FOCUS_PADDING) {
		if (this.isTourActive) this.tour.cancel();
		const target = new Vector3(...center);
		const verticalFovRadians = MathUtils.degToRad(this.camera.fov);
		const distance = MathUtils.clamp(Math.max(radius, .01) * padding / Math.sin(verticalFovRadians / 2), this.controls.minDistance, this.controls.maxDistance);
		const currentOffset = this.camera.position.clone().sub(this.controls.target);
		const spherical = new Spherical().setFromVector3(currentOffset);
		spherical.radius = distance;
		const newPosition = target.clone().add(new Vector3().setFromSpherical(spherical));
		const duration = motionDuration(FOCUS_TRANSITION_SECONDS);
		gsapWithCSS.to(this.camera.position, {
			x: newPosition.x,
			y: newPosition.y,
			z: newPosition.z,
			duration,
			ease: "power3.inOut"
		});
		gsapWithCSS.to(this.controls.target, {
			x: target.x,
			y: target.y,
			z: target.z,
			duration,
			ease: "power3.inOut"
		});
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.tour.dispose();
		this.controls.dispose();
	}
};
var LIGHTING = {
	studio: {
		bg: "#0b0f14",
		keyColor: "#ffffff",
		rimColor: "#4169ff",
		fillColor: "#dce8ff",
		hemiSky: "#edf5ff",
		hemiGround: "#18100b",
		key: 4.2,
		rim: 1.6,
		fill: 1.1,
		hemi: 1.8,
		envIntensity: .55
	},
	showroom: {
		bg: "#0a1018",
		keyColor: "#e8f0ff",
		rimColor: "#6aa8ff",
		fillColor: "#c5d7ff",
		hemiSky: "#dce9ff",
		hemiGround: "#12161c",
		key: 3.6,
		rim: 2,
		fill: 1.3,
		hemi: 1.5,
		envIntensity: .7
	},
	overcast: {
		bg: "#12151a",
		keyColor: "#d0d5db",
		rimColor: "#8a939e",
		fillColor: "#b8c0c9",
		hemiSky: "#c5ccd4",
		hemiGround: "#1a1d22",
		key: 2.4,
		rim: 1.1,
		fill: 1.4,
		hemi: 2.2,
		envIntensity: .45
	},
	sunset: {
		bg: "#21140f",
		keyColor: "#ffb36b",
		rimColor: "#ff5a36",
		fillColor: "#ffdcb0",
		hemiSky: "#ffd3a1",
		hemiGround: "#5e3023",
		key: 2.6,
		rim: 1.4,
		fill: .9,
		hemi: 1.6,
		envIntensity: .85
	}
};
var loader = new RGBELoader();
var textureCache = /* @__PURE__ */ new Map();
function loadHdr(url) {
	const cached = textureCache.get(url);
	if (cached) return cached;
	const pending = loader.loadAsync(url).then((texture) => {
		texture.mapping = 303;
		return texture;
	});
	pending.catch(() => textureCache.delete(url));
	textureCache.set(url, pending);
	return pending;
}
/**
* Applies lighting + optional env map for a catalog HDRI preset id.
* Returns a dispose handle for any PMREM target created for this application.
*/
async function applyHdriPreset(refs, renderer, hdriPresetId, previous) {
	previous?.dispose();
	const preset = getHdriPreset(hdriPresetId);
	if (!preset) {
		refs.scene.environment = null;
		return null;
	}
	const palette = LIGHTING[preset.lightingKey];
	refs.scene.background = new Color(palette.bg);
	refs.hemi.color.set(palette.hemiSky);
	refs.hemi.groundColor.set(palette.hemiGround);
	refs.hemi.intensity = palette.hemi;
	refs.key.color.set(palette.keyColor);
	refs.key.intensity = palette.key;
	refs.rim.color.set(palette.rimColor);
	refs.rim.intensity = palette.rim;
	refs.fill.color.set(palette.fillColor);
	refs.fill.intensity = palette.fill;
	if (!preset.hdrUrl) {
		refs.scene.environment = null;
		return null;
	}
	if (!(renderer instanceof WebGLRenderer)) {
		refs.scene.environment = null;
		return null;
	}
	try {
		const hdr = await loadHdr(preset.hdrUrl);
		const pmrem = new PMREMGenerator(renderer);
		const envMap = pmrem.fromEquirectangular(hdr).texture;
		refs.scene.environment = envMap;
		refs.scene.environmentIntensity = palette.envIntensity;
		pmrem.dispose();
		return { dispose: () => {
			if (refs.scene.environment === envMap) refs.scene.environment = null;
			envMap.dispose();
		} };
	} catch {
		refs.scene.environment = null;
		return null;
	}
}
var EnvironmentController = class {
	scene;
	floor;
	grid;
	hemi;
	key;
	rim;
	fill;
	stars;
	rocks;
	terrain;
	preset;
	hdriHandle = null;
	/** Bumped on every `applyHdri` call so a slower, superseded request's late-arriving result is
	* discarded instead of clobbering a newer one that already committed — see that method's own
	* doc comment for the race this guards. */
	hdriGeneration = 0;
	disposed = false;
	constructor(options) {
		this.scene = options.scene;
		this.terrain = options.initialTerrain;
		this.preset = options.initialPreset;
		this.hemi = new HemisphereLight("#edf5ff", "#18100b", 1.8);
		this.scene.add(this.hemi);
		this.key = new DirectionalLight("#ffffff", 4.2);
		this.key.position.set(6, 9, 7);
		this.key.castShadow = options.quality.shadowsEnabled;
		this.key.shadow.mapSize.set(options.quality.shadowMapSize, options.quality.shadowMapSize);
		this.key.shadow.bias = -18e-5;
		this.key.shadow.normalBias = .025;
		this.key.shadow.camera.near = 1;
		this.key.shadow.camera.far = 30;
		this.key.shadow.camera.left = -11;
		this.key.shadow.camera.right = 11;
		this.key.shadow.camera.top = 11;
		this.key.shadow.camera.bottom = -11;
		this.key.shadow.camera.updateProjectionMatrix();
		this.scene.add(this.key);
		this.rim = new DirectionalLight("#4169ff", 1.6 * options.quality.secondaryLightScale);
		this.rim.position.set(-6, 7.5, -6);
		this.scene.add(this.rim);
		this.fill = new DirectionalLight("#dce8ff", 1.1 * options.quality.secondaryLightScale);
		this.fill.position.set(-2, 3, 9);
		this.scene.add(this.fill);
		this.floor = new Mesh(new PlaneGeometry(50, 50), new MeshPhysicalMaterial({
			color: "#0a0c10",
			roughness: .6,
			metalness: .05,
			clearcoat: .12,
			clearcoatRoughness: .4
		}));
		this.floor.rotation.x = -Math.PI / 2;
		this.floor.receiveShadow = options.quality.shadowsEnabled;
		this.scene.add(this.floor);
		this.grid = new GridHelper(36, 36, "#26303a", "#151a20");
		this.grid.position.y = .002;
		this.scene.add(this.grid);
		this.stars = createStarfield(options.starfieldCount);
		this.stars.visible = false;
		this.scene.add(this.stars);
		this.rocks = createTrailRocks();
		this.rocks.visible = false;
		this.scene.add(this.rocks);
		this.applyPalette();
	}
	get currentTerrain() {
		return this.terrain;
	}
	get currentPreset() {
		return this.preset;
	}
	setTerrain(terrain) {
		this.terrain = terrain;
		this.applyPalette();
	}
	setPreset(preset) {
		this.preset = preset;
		this.applyPalette();
	}
	/** Re-applies both in one pass — the shape `VehicleCanvas.tsx`'s combined terrain+preset effect
	* needs, so a vehicle switch or deep-link restore doesn't run the palette math twice. */
	setTerrainAndPreset(terrain, preset) {
		this.terrain = terrain;
		this.preset = preset;
		this.applyPalette();
	}
	applyPalette() {
		const palette = this.preset === "Night" ? {
			bg: "#050813",
			floor: "#0b0d15",
			sky: "#33436c",
			ground: "#080a12",
			keyColor: "#b8c9ff",
			rimColor: "#4169ff",
			fillColor: "#26314f",
			key: 1,
			rim: 1.7,
			fill: .5,
			hemi: 1.1
		} : this.preset === "Sunset" ? {
			bg: "#21140f",
			floor: "#1c130f",
			sky: "#ffd3a1",
			ground: "#5e3023",
			keyColor: "#ffb36b",
			rimColor: "#ff5a36",
			fillColor: "#ffdcb0",
			key: 2.6,
			rim: 1.4,
			fill: .9,
			hemi: 1.6
		} : {
			bg: this.terrain === "Trail" ? "#152017" : "#0b0f14",
			floor: this.terrain === "Trail" ? "#191712" : "#0a0c10",
			sky: "#edf5ff",
			ground: "#18100b",
			keyColor: "#ffffff",
			rimColor: "#4169ff",
			fillColor: "#dce8ff",
			key: 4.2,
			rim: 1.6,
			fill: 1.1,
			hemi: 1.8
		};
		this.scene.background = new Color(palette.bg);
		this.scene.fog = new Fog(palette.bg, this.terrain === "Trail" ? 10 : 16, this.terrain === "Trail" ? 25 : 32);
		this.floor.material.color.set(palette.floor);
		this.hemi.color.set(palette.sky);
		this.hemi.groundColor.set(palette.ground);
		this.hemi.intensity = palette.hemi;
		this.key.color.set(palette.keyColor);
		this.key.intensity = palette.key;
		this.rim.color.set(palette.rimColor);
		this.rim.intensity = palette.rim;
		this.fill.color.set(palette.fillColor);
		this.fill.intensity = palette.fill;
		this.grid.visible = this.terrain === "Studio";
		this.stars.visible = this.preset === "Night";
		this.rocks.visible = this.terrain === "Trail";
	}
	/** Re-applies quality-governed shadow/light settings — the environment-owned half of
	* `VehicleCanvas.tsx`'s `applyTier`, called on every `QualityGovernor` tier change. */
	applyQuality(quality) {
		this.key.castShadow = quality.shadowsEnabled;
		if (quality.shadowsEnabled) {
			this.key.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
			this.key.shadow.map?.dispose();
			this.key.shadow.map = null;
		}
		this.floor.receiveShadow = quality.shadowsEnabled;
		this.rim.intensity = 1.6 * quality.secondaryLightScale;
		this.fill.intensity = 1.1 * quality.secondaryLightScale;
	}
	/**
	* Applies a catalog HDRI preset id (or clears it when `undefined`) — thin wrapper over
	* `applyHdriPreset`, owning the dispose-handle lifecycle across calls (Mission Priority 1's
	* `hdriEnvironment.ts` already does the load/PMREM/dispose work standalone; this is not a
	* reimplementation) plus supersession: calling this again before a prior call's texture load has
	* resolved discards the earlier call's result instead of letting whichever `fetch` happens to
	* finish last win — a real race the pre-Priority-5 `VehicleCanvas.tsx` effect guarded with its
	* own `cancelled` flag, which every caller of a shared controller needs, not only a React effect.
	*/
	async applyHdri(renderer, hdriPresetId) {
		const generation = this.hdriGeneration += 1;
		const handle = await applyHdriPreset({
			scene: this.scene,
			hemi: this.hemi,
			key: this.key,
			rim: this.rim,
			fill: this.fill
		}, renderer, hdriPresetId, this.hdriHandle);
		if (generation !== this.hdriGeneration || this.disposed) {
			handle?.dispose();
			return;
		}
		this.hdriHandle = handle;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.hdriHandle?.dispose();
		this.hdriHandle = null;
		this.floor.geometry.dispose();
		this.floor.material.dispose();
		this.grid.dispose();
		disposeStarfield(this.stars);
		disposeTrailRocks(this.rocks);
	}
};
/** A fixed field of distant points, shown only for the Night preset — cheap set dressing that
* sells the "outdoor at night" read the flat dark background alone doesn't. */
function createStarfield(count = 400) {
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i += 1) {
		const radius = 32 + Math.random() * 14;
		const theta = Math.random() * Math.PI * 2;
		const y = radius * (.1 + Math.random() * .9);
		const ring = Math.sqrt(Math.max(radius * radius - y * y, 0));
		positions[i * 3] = Math.cos(theta) * ring;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = Math.sin(theta) * ring;
	}
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new BufferAttribute(positions, 3));
	const material = new PointsMaterial({
		color: "#e7edff",
		size: .12,
		sizeAttenuation: true,
		transparent: true,
		opacity: .85,
		toneMapped: false,
		depthWrite: false
	});
	const points = new Points(geometry, material);
	points.name = "STARFIELD";
	return points;
}
function disposeStarfield(points) {
	points.geometry.dispose();
	points.material.dispose();
}
/** Low-poly rocks scattered around the vehicle, shown only for the Trail terrain preview — the
* flat studio floor otherwise looks the same regardless of which terrain is "selected". Positions
* are hand-placed (not randomised) and kept outside the ~2.5m the camera presets orbit within, so
* they read as surrounding terrain rather than debris crowding the vehicle. */
function createTrailRocks() {
	const group = new Group();
	group.name = "TRAIL_ROCKS";
	const material = new MeshStandardMaterial({
		color: "#3a352e",
		roughness: .95,
		metalness: .02,
		flatShading: true
	});
	for (const [x, y, z, scale] of [
		[
			-3.4,
			.22,
			-2.1,
			.34
		],
		[
			-3.9,
			.16,
			.6,
			.24
		],
		[
			3.6,
			.2,
			-1.4,
			.3
		],
		[
			4.1,
			.14,
			1.6,
			.22
		],
		[
			-2.6,
			.12,
			3.3,
			.2
		],
		[
			2.9,
			.15,
			3.6,
			.24
		],
		[
			-4.4,
			.18,
			-3.4,
			.28
		],
		[
			4.6,
			.13,
			-3.8,
			.2
		]
	]) {
		const rock = new Mesh(new IcosahedronGeometry(1, 0), material);
		rock.scale.set(scale, scale * (.7 + (x % 1 === 0 ? 0 : .2)), scale);
		rock.position.set(x, y, z);
		rock.rotation.set(x * .7, z * .5, x * z * .1);
		rock.castShadow = true;
		rock.receiveShadow = true;
		group.add(rock);
	}
	return group;
}
function disposeTrailRocks(group) {
	(group.children[0]?.material)?.dispose();
	for (const child of group.children) if (child instanceof Mesh) child.geometry.dispose();
}
var TIER_SETTINGS = {
	high: {
		maxPixelRatio: 2,
		antialias: true,
		shadowsEnabled: true,
		shadowMapSize: 2048,
		loadAuthoredRunningGear: true,
		starfieldCount: 400,
		secondaryLightScale: 1
	},
	medium: {
		maxPixelRatio: 1.5,
		antialias: true,
		shadowsEnabled: true,
		shadowMapSize: 1024,
		loadAuthoredRunningGear: true,
		starfieldCount: 200,
		secondaryLightScale: .85
	},
	low: {
		maxPixelRatio: 1,
		antialias: false,
		shadowsEnabled: false,
		shadowMapSize: 512,
		loadAuthoredRunningGear: false,
		starfieldCount: 80,
		secondaryLightScale: .6
	}
};
function qualitySettingsFor(tier) {
	return {
		tier,
		...TIER_SETTINGS[tier]
	};
}
var TIER_RANK = {
	low: 0,
	medium: 1,
	high: 2
};
function weakerTier(a, b) {
	return TIER_RANK[a] <= TIER_RANK[b] ? a : b;
}
/** Map a numeric hint into a constrained tier, or null when the signal is not restrictive. */
function tierFromThreshold(value, lowAt, mediumAt) {
	if (typeof value !== "number" || value <= 0) return null;
	if (value <= lowAt) return "low";
	if (value <= mediumAt) return "medium";
	return null;
}
/**
* Pick a tier from coarse device signals. Prefer explicit override, then Save-Data, then the
* weakest of memory/core hints, then a mobile-ish heuristic, else high.
*/
function selectQualityTier(hints = {}) {
	if (hints.preferTier) return hints.preferTier;
	if (hints.saveData) return "low";
	const fromMemory = tierFromThreshold(hints.deviceMemoryGb, 2, 4);
	const fromCores = tierFromThreshold(hints.hardwareConcurrency, 2, 4);
	const fromHardware = fromMemory && fromCores ? weakerTier(fromMemory, fromCores) : fromMemory ?? fromCores;
	if (fromHardware) return fromHardware;
	const ua = hints.userAgent?.toLowerCase() ?? "";
	const touch = hints.maxTouchPoints ?? 0;
	if (/android|iphone|ipad|ipod|mobile/.test(ua) || touch > 1) return "medium";
	if ((hints.devicePixelRatio ?? 1) >= 3) return "medium";
	return "high";
}
function resolveQuality(hints = {}) {
	return qualitySettingsFor(selectQualityTier(hints));
}
/** Snapshot of `navigator` / `window` fields used by `selectQualityTier`. Safe under SSR. */
function collectBrowserDeviceHints(preferTier) {
	if (typeof navigator === "undefined") return preferTier ? { preferTier } : {};
	const nav = navigator;
	return {
		deviceMemoryGb: typeof nav.deviceMemory === "number" ? nav.deviceMemory : void 0,
		hardwareConcurrency: nav.hardwareConcurrency,
		maxTouchPoints: nav.maxTouchPoints,
		userAgent: nav.userAgent,
		devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : void 0,
		saveData: nav.connection?.saveData === true,
		preferTier
	};
}
/**
* Adaptive mid-session quality policy — the follow-up `lib/three/quality.ts` defers to issue #33.
*
* `quality.ts` picks a tier **once**, from device hints, and says so explicitly: "Adaptive
* mid-session policy (auto-downgrade from frame time) is intentionally left to issue #33." This is
* that policy. It consumes the frame times `lib/three/frameStats.ts` already collects — which that
* module was likewise written to be "the signal source #33 can later use" — and moves the tier
* when the opening guess turns out to be wrong.
*
* Device hints are a guess, and necessarily a coarse one: `deviceMemory` is Chromium-only,
* `hardwareConcurrency` counts cores rather than GPU capability, and neither says anything about
* fill rate — which is what actually decides whether this scene holds a frame rate. A machine that
* looks capable can still be driving a 4K display off an integrated GPU. Without a feedback loop
* the guess is final for the session; with one, it only has to be close.
*
* ## Why the policy is separate from the tiers
*
* `quality.ts` owns *what a tier means* (pixel ratio, shadow map, starfield density, whether to
* fetch the authored running gear). This module owns *when to change tier*, and nothing else — it
* touches no Three.js object and imports no renderer. That keeps the tuning testable against
* synthetic frame sequences instead of requiring a GPU and a stopwatch, and it means a change to
* what "low" costs does not disturb the logic deciding when to reach for it.
*
* ## The failure mode this is designed around
*
* The naive version oscillates. Quality drops, frame times improve *because* it dropped, quality
* rises, frame times degrade again — a visible pulsing that is worse than simply running at the
* lower tier. Three things prevent it:
*
*   - **Asymmetric thresholds.** The frame time that triggers a downgrade sits well above the one
*     that permits an upgrade, so the post-downgrade steady state does not immediately re-qualify.
*   - **Asymmetric dwell.** Downgrades react in about half a second; upgrades need several seconds
*     of sustained headroom. Being slow to add load back is the cheap direction to err.
*   - **A cooldown after every change.** Measurements taken while the renderer is still absorbing
*     a resolution or shadow-map change describe the transition, not the new steady state.
*/
/** Ladder order, worst to best. Mirrors `quality.ts`'s own ranking. */
var TIER_LADDER = [
	"low",
	"medium",
	"high"
];
/**
* Sustained frame time above this (ms) means the current tier is too expensive.
*
* ~33 ms is 30 fps. Chosen over a 60 fps target because this is an orbit-and-inspect showroom, not
* a twitch game: 30 fps is a perfectly good experience here, and degrading fidelity to chase 60 on
* hardware that cannot reach it trades away the product's appearance for a number nobody is
* looking at.
*/
var DOWNGRADE_ABOVE_MS = 33;
/**
* Sustained frame time below this (ms) means there is room to add quality back.
*
* ~20 ms is 50 fps. The gap to `DOWNGRADE_ABOVE_MS` is the hysteresis band: a scene sitting between
* 20 and 33 ms is left exactly where it is, which is the point — that band is where an oscillating
* governor would live.
*/
var UPGRADE_BELOW_MS = 20;
/** Consecutive qualifying frames before stepping down (~0.5 s of bad frames at 30 fps). */
var FRAMES_BEFORE_DOWNGRADE = 15;
/**
* Consecutive qualifying frames before stepping up (~4 s at 50 fps).
*
* An order of magnitude slower than a downgrade. A wrong downgrade costs some fidelity; a wrong
* upgrade costs a stutter and then a downgrade, which the user reads as the page misbehaving.
*/
var FRAMES_BEFORE_UPGRADE = 200;
/** Ignored after a tier change (ms) — measurements here describe the transition, not the result. */
var CHANGE_COOLDOWN_MS = 500;
/**
* Frame deltas above this (ms) are discarded rather than smoothed.
*
* A backgrounded tab, a blocking main-thread task, or a GC pause produces deltas of hundreds of
* milliseconds to seconds. Those describe the browser, not the renderer. `canvasIdle.ts` already
* suspends the loop when the tab is hidden, so this mostly catches the resume edge and long tasks —
* but without it the first frame back would drive a spurious downgrade.
*/
var OUTLIER_FRAME_MS = 250;
/**
* Weight of each new sample in the exponential moving average.
*
* 0.1 gives a time constant of roughly ten frames — long enough that one slow frame cannot move the
* average far, short enough to react inside the dwell windows above.
*/
var EWMA_ALPHA = .1;
/**
* Frames ignored at startup.
*
* The first frames of a WebGL/WebGPU scene include shader compilation, pipeline creation, and
* texture uploads. They are reliably slow, reliably unrepresentative, and would otherwise trigger
* an immediate downgrade on hardware that handles the scene comfortably a second later.
*/
var WARMUP_FRAMES = 30;
var QualityGovernor = class {
	onChange;
	now;
	tierIndex;
	averageFrameMs = 0;
	framesSeen = 0;
	slowStreak = 0;
	fastStreak = 0;
	changedAt = Number.NEGATIVE_INFINITY;
	constructor(options) {
		this.onChange = options.onChange;
		this.now = options.now ?? (() => performance.now());
		this.tierIndex = TIER_LADDER.indexOf(options.initialTier);
		if (this.tierIndex < 0) this.tierIndex = TIER_LADDER.length - 1;
	}
	/** The tier currently in effect. */
	get tier() {
		return TIER_LADDER[this.tierIndex];
	}
	/** Smoothed frame time in ms, or 0 before any sample. Exposed for telemetry. */
	get averageFrameTimeMs() {
		return this.averageFrameMs;
	}
	/**
	* Feeds one frame's duration to the governor. Call once per rendered frame.
	*
	* Cheap by construction — a few comparisons and one multiply-add — because it runs inside the
	* render loop, where a governor expensive enough to matter would be self-defeating.
	*/
	recordFrame(deltaMs) {
		if (!Number.isFinite(deltaMs) || deltaMs <= 0) return;
		if (deltaMs > OUTLIER_FRAME_MS) return;
		this.framesSeen += 1;
		this.averageFrameMs = this.framesSeen === 1 ? deltaMs : this.averageFrameMs + EWMA_ALPHA * (deltaMs - this.averageFrameMs);
		if (this.framesSeen <= WARMUP_FRAMES) return;
		if (this.now() - this.changedAt < CHANGE_COOLDOWN_MS) return;
		if (this.averageFrameMs > DOWNGRADE_ABOVE_MS) {
			this.slowStreak += 1;
			this.fastStreak = 0;
			if (this.slowStreak >= FRAMES_BEFORE_DOWNGRADE) this.step(-1, "downgrade");
			return;
		}
		if (this.averageFrameMs < UPGRADE_BELOW_MS) {
			this.fastStreak += 1;
			this.slowStreak = 0;
			if (this.fastStreak >= FRAMES_BEFORE_UPGRADE) this.step(1, "upgrade");
			return;
		}
		this.slowStreak = 0;
		this.fastStreak = 0;
	}
	/**
	* Discards accumulated timing without changing tier.
	*
	* Called when the render loop resumes from idle suspension: `canvasIdle.ts` stops the loop when
	* the tab is hidden or the canvas scrolls out of view, and the frames either side of that gap
	* describe the pause rather than the renderer.
	*/
	reset() {
		this.averageFrameMs = 0;
		this.framesSeen = 0;
		this.slowStreak = 0;
		this.fastStreak = 0;
	}
	step(direction, reason) {
		const next = this.tierIndex + direction;
		if (next < 0 || next >= TIER_LADDER.length) {
			this.slowStreak = 0;
			this.fastStreak = 0;
			return;
		}
		const from = this.tier;
		this.tierIndex = next;
		this.slowStreak = 0;
		this.fastStreak = 0;
		this.changedAt = this.now();
		this.averageFrameMs = reason === "downgrade" ? DOWNGRADE_ABOVE_MS : UPGRADE_BELOW_MS;
		this.onChange(qualitySettingsFor(this.tier), {
			from,
			reason
		});
	}
};
/**
* Canvas idle suspension: stop the rAF render loop when the tab is hidden or the canvas host is
* off-screen. Resume cleanly when either returns. Pure `computeSuspended` is unit-tested; the
* observer wiring lives in `createCanvasIdleGate` for VehicleCanvas.
*/
function computeSuspended(documentVisible, canvasIntersecting) {
	return !documentVisible || !canvasIntersecting;
}
/**
* Combines Page Visibility and IntersectionObserver into a single suspended flag.
* `onChange` fires only when the boolean flips.
*/
function createCanvasIdleGate(element, onChange, options = {}) {
	let documentVisible = typeof document === "undefined" ? true : document.visibilityState !== "hidden";
	let canvasIntersecting = options.initiallyIntersecting ?? true;
	let suspended = computeSuspended(documentVisible, canvasIntersecting);
	const emit = () => {
		const next = computeSuspended(documentVisible, canvasIntersecting);
		if (next === suspended) return;
		suspended = next;
		onChange(suspended);
	};
	const onVisibility = () => {
		documentVisible = document.visibilityState !== "hidden";
		emit();
	};
	if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibility);
	let observer = null;
	if (typeof IntersectionObserver !== "undefined") {
		observer = new IntersectionObserver((entries) => {
			const entry = entries[entries.length - 1];
			if (!entry) return;
			canvasIntersecting = entry.isIntersecting && entry.intersectionRatio > 0;
			emit();
		}, {
			root: null,
			rootMargin: options.rootMargin ?? "0px",
			threshold: options.threshold ?? 0
		});
		observer.observe(element);
	}
	return {
		get suspended() {
			return suspended;
		},
		dispose() {
			if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisibility);
			observer?.disconnect();
			observer = null;
		}
	};
}
var EMPTY = {
	lastFrameMs: 0,
	avgFrameMs: 0,
	fps: 0,
	avgFps: 0,
	samples: 0
};
var FrameTimeTracker = class {
	buffer;
	index = 0;
	filled = 0;
	lastNow = 0;
	started = false;
	lastFrameMs = 0;
	constructor(capacity = 60) {
		this.buffer = new Float64Array(Math.max(capacity, 1));
	}
	/**
	* Record a frame at `nowMs` (typically `performance.now()`). The first call only seeds the
	* clock and does not produce a sample.
	*/
	record(nowMs) {
		if (!this.started) {
			this.started = true;
			this.lastNow = nowMs;
			return this.snapshot();
		}
		const delta = Math.max(nowMs - this.lastNow, 0);
		this.lastNow = nowMs;
		this.lastFrameMs = delta;
		this.buffer[this.index] = delta;
		this.index = (this.index + 1) % this.buffer.length;
		if (this.filled < this.buffer.length) this.filled += 1;
		return this.snapshot();
	}
	snapshot() {
		if (this.filled === 0) return { ...EMPTY };
		let sum = 0;
		for (let i = 0; i < this.filled; i += 1) sum += this.buffer[i];
		const avgFrameMs = sum / this.filled;
		const lastFrameMs = this.lastFrameMs;
		return {
			lastFrameMs,
			avgFrameMs,
			fps: lastFrameMs > 0 ? 1e3 / lastFrameMs : 0,
			avgFps: avgFrameMs > 0 ? 1e3 / avgFrameMs : 0,
			samples: this.filled
		};
	}
	reset() {
		this.index = 0;
		this.filled = 0;
		this.lastNow = 0;
		this.started = false;
		this.lastFrameMs = 0;
		this.buffer.fill(0);
	}
};
/** Format a snapshot for `dataset` / log lines without allocating heavy objects. */
function formatFrameStats(stats) {
	if (stats.samples === 0) return "n/a";
	return `${stats.avgFps.toFixed(0)}fps avg/${stats.avgFrameMs.toFixed(1)}ms`;
}
var session = {
	metrics: [],
	flushed: false
};
/** Records one metric. Cheap and synchronous — safe to call from a render-loop callback. */
function recordMetric(metric) {
	if (session.flushed) return;
	session.metrics.push(metric);
}
/**
* Sends the batch, or logs it when no collector is configured.
*
* Idempotent: `visibilitychange` can fire more than once (a tab hidden, shown, and hidden again),
* and a second flush would double-count every metric in the batch.
*/
function flushMetrics() {
	if (session.flushed || session.metrics.length === 0) return;
	session.flushed = true;
	const payload = JSON.stringify({
		metrics: session.metrics,
		at: (/* @__PURE__ */ new Date()).toISOString()
	});
	console.info("[metrics]", payload);
}
/**
* Installs the flush trigger. Returns a teardown function.
*
* Call once per page. Safe to call again — a duplicate listener would flush twice, and the
* idempotency above makes the second call a no-op rather than a double-count.
*/
function installMetricsFlush() {
	if (typeof document === "undefined") return () => {};
	const onHidden = () => {
		if (document.visibilityState === "hidden") flushMetrics();
	};
	document.addEventListener("visibilitychange", onHidden);
	window.addEventListener("pagehide", flushMetrics);
	return () => {
		document.removeEventListener("visibilitychange", onHidden);
		window.removeEventListener("pagehide", flushMetrics);
	};
}
var RenderController = class RenderController {
	/** The live canvas — VehicleCanvas.tsx still writes its own dataset attributes on this directly
	* (`data-selected-part`, `data-hovered-part`, `data-load-phase`), the same way it always did. */
	canvas;
	mode;
	/** Exposed for `EnvironmentController.applyHdri`'s WebGL-only PMREM check — the exact renderer
	* reference `VehicleCanvas.tsx` used to bridge via its own `rendererRef`. */
	renderer;
	host;
	resizeObserver;
	idleGate;
	frameStats = new FrameTimeTracker(60);
	governor;
	options;
	handleContextLost;
	handleContextRestored;
	quality;
	scene = null;
	camera = null;
	tick;
	running = true;
	suspended;
	rafId = 0;
	framePublishCount = 0;
	disposed = false;
	/**
	* `rendererFactory` defaults to the real WebGPU/WebGL2 construction (`createRenderer` below) —
	* every real caller gets exactly that. The parameter exists so unit tests can inject a fake
	* `RendererLike` instead: this module's constructor, resize/quality/render-loop/capture/dispose
	* logic is otherwise plain, GPU-independent TypeScript, but `createRenderer` itself calls
	* `renderer.init()`/`getContext('webgl2')`, which needs a real GPU-backed canvas that neither
	* jsdom nor plain Node provides — the same "no WebGLRenderer available in this environment"
	* constraint `EnvironmentController.applyHdri`'s tests already document and work around.
	*/
	static async create(options, rendererFactory = createRenderer) {
		const quality = resolveQuality(collectBrowserDeviceHints());
		const { renderer, mode } = await rendererFactory(quality.antialias);
		return new RenderController(renderer, mode, quality, options);
	}
	constructor(renderer, mode, quality, options) {
		this.renderer = renderer;
		this.canvas = renderer.domElement;
		this.mode = mode;
		this.quality = quality;
		this.host = options.host;
		this.options = options;
		applyRendererQuality(renderer, quality);
		renderer.toneMapping = 4;
		renderer.toneMappingExposure = 1.05;
		this.canvas.dataset.renderer = mode;
		recordMetric({
			name: "renderer_selected",
			labels: {
				renderer: mode,
				tier: quality.tier
			}
		});
		this.canvas.dataset.quality = quality.tier;
		options.host.appendChild(this.canvas);
		this.resizeObserver = new ResizeObserver(() => this.resize());
		this.resizeObserver.observe(options.host);
		this.idleGate = createCanvasIdleGate(options.host, (next) => {
			this.suspended = next;
			this.canvas.dataset.idle = next ? "1" : "0";
			if (next) {
				this.cancelPendingRaf();
				return;
			}
			if (this.running) {
				this.cancelPendingRaf();
				this.frameStats.reset();
				this.governor.reset();
				this.loop();
			}
		});
		this.suspended = this.idleGate.suspended;
		this.canvas.dataset.idle = this.suspended ? "1" : "0";
		this.governor = new QualityGovernor({
			initialTier: quality.tier,
			onChange: (next, { from, reason }) => {
				this.applyQuality(next);
				this.options.onQualityChange?.(next);
				recordMetric({
					name: "quality_changed",
					value: Math.round(this.governor.averageFrameTimeMs),
					labels: {
						from,
						to: next.tier,
						reason
					}
				});
				console.info(`[quality] ${reason}: ${from} -> ${next.tier}`);
			}
		});
		/**
		* WebGL context loss.
		*
		* The GPU process can drop a context at any time — a driver reset, the OS reclaiming VRAM, a
		* background tab being evicted, too many live contexts. It arrives as an *event*, not an
		* exception, so neither a try/catch around model loading nor a React error boundary sees it:
		* the render loop just keeps calling into a dead context and the viewport freezes on its last
		* frame with nothing logged anywhere.
		*
		* `preventDefault` on `webglcontextlost` is what makes the context eligible for restoration at
		* all — without it the browser never fires `webglcontextrestored`.
		*/
		this.handleContextLost = (event) => {
			event.preventDefault();
			this.running = false;
			this.cancelPendingRaf();
			console.warn("[canvas] WebGL context lost; pausing render loop until it is restored.");
			this.options.onContextLost?.();
		};
		this.handleContextRestored = () => {
			console.info("[canvas] WebGL context restored; resuming render loop.");
			this.resize();
			this.options.onContextRestored?.();
			if (this.running) return;
			this.running = true;
			this.frameStats.reset();
			this.governor.reset();
			this.loop();
		};
		this.canvas.addEventListener("webglcontextlost", this.handleContextLost);
		this.canvas.addEventListener("webglcontextrestored", this.handleContextRestored);
	}
	get currentQuality() {
		return this.quality;
	}
	/** What `renderer.render`/`renderAsync` paints each frame. Set once the scene/camera exist. */
	attachScene(scene, camera) {
		this.scene = scene;
		this.camera = camera;
	}
	/** Sizes the renderer to the host's current CSS box and notifies `onResize`. Called once
	* explicitly by the caller after every other controller exists (so `onResize` — typically a
	* camera aspect update — has something to call into), and automatically on every host resize
	* and context restoration afterward. */
	resize() {
		const width = Math.max(this.host.clientWidth, 1);
		const height = Math.max(this.host.clientHeight, 1);
		this.renderer.setSize(width, height);
		this.options.onResize?.(width, height);
	}
	/**
	* Re-applies a quality tier to the live renderer: pixel ratio, shadow map enablement, dataset,
	* and a resize (matching the pre-extraction `applyTier`'s own unconditional resize — a safety
	* re-sync, not something this changes behavior on). Does NOT re-apply quality-dependent state
	* other controllers own (e.g. `EnvironmentController`'s shadow-casting lights) — that is what
	* `onQualityChange` is for.
	*/
	applyQuality(next) {
		this.quality = next;
		applyRendererQuality(this.renderer, next);
		this.canvas.dataset.quality = next.tier;
		this.resize();
	}
	/** Starts the render loop, calling `tick()` once before every frame's paint. */
	start(tick) {
		this.tick = tick;
		this.loop();
	}
	cancelPendingRaf() {
		if (this.rafId !== 0) {
			cancelAnimationFrame(this.rafId);
			this.rafId = 0;
		}
	}
	queueFrame() {
		if (this.rafId !== 0) return;
		this.rafId = requestAnimationFrame(() => {
			this.rafId = 0;
			this.loop();
		});
	}
	loop() {
		if (!this.running || this.disposed) return;
		if (this.suspended) return;
		const stats = this.frameStats.record(performance.now());
		this.governor.recordFrame(stats.lastFrameMs);
		this.framePublishCount += 1;
		if (stats.samples > 0 && this.framePublishCount % 30 === 0) this.canvas.dataset.frameStats = formatFrameStats(stats);
		this.tick?.();
		if (!this.scene || !this.camera) {
			this.queueFrame();
			return;
		}
		const scene = this.scene;
		const camera = this.camera;
		(this.renderer.renderAsync ? this.renderer.renderAsync(scene, camera) : Promise.resolve(this.renderer.render(scene, camera))).finally(() => {
			if (this.running && !this.suspended) this.queueFrame();
		});
	}
	/** Latest ring-buffer frame-timing snapshot — the `__vehicleFrameStats` dev hook's data source. */
	getFrameStats() {
		return this.frameStats.snapshot();
	}
	/**
	* A PNG data URL of the current canvas contents — the real, minimal capability behind a future
	* `showroom.capture` agent capability (see this module's own doc comment). `null` when nothing
	* has been rendered yet or the canvas is zero-sized, rather than a data URL of a blank frame.
	*/
	capture() {
		if (this.canvas.width === 0 || this.canvas.height === 0) return null;
		try {
			return this.canvas.toDataURL("image/png");
		} catch {
			return null;
		}
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.running = false;
		this.cancelPendingRaf();
		this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
		this.canvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
		this.idleGate.dispose();
		this.resizeObserver.disconnect();
		this.renderer.dispose();
		this.canvas.remove();
	}
};
function applyRendererQuality(renderer, quality) {
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio));
	renderer.shadowMap.enabled = quality.shadowsEnabled;
}
async function createRenderer(antialias) {
	if (navigator.gpu) try {
		const renderer = new WebGPURenderer({ antialias });
		await renderer.init();
		return {
			renderer,
			mode: "webgpu"
		};
	} catch (error) {
		console.warn("WebGPU initialization failed; using WebGL2 fallback.", error);
	}
	const renderer = new WebGLRenderer({
		antialias,
		alpha: false
	});
	renderer.outputColorSpace = SRGBColorSpace;
	return {
		renderer,
		mode: "webgl2"
	};
}
/**
* React orchestration layer for the 3D showroom. What used to be a single ~700-line setup effect
* owning a dozen scattered `let`s now constructs and wires four independently-owned authorities —
* `RenderController` (Priority 6: renderer/render-loop/quality/context-loss), `CameraController`
* (Priority 3: camera/controls/tour), `EnvironmentController` (Priority 5: lighting/terrain/HDRI),
* and `VehicleSceneController` (Priority 1: scene graph/picking/selection, constructed once the
* GLB resolves) — and translates their events into the React props this component was handed:
* `onReady`, `onError`, `onProgress`, `onPartHover`, `onPartSelect`, `onTourStatusChange`,
* `onTourStep`. Construction is a short, explicit, linear sequence (`RenderController.create()` →
* `CameraController` → `EnvironmentController` → `attachScene`/`resize`/`start`); disposal is the
* same sequence in reverse, in one `cleanup` closure.
*
* ## Why there is no `SceneRuntime` composition root (Priority 7)
*
* The mission scoped Priority 7 as conditional: a composition root only if one "solves real
* coordination problems," never "a dumping ground." It doesn't, here. The three-line construction
* order above is not duplicated anywhere, is not error-prone (each controller's constructor takes
* exactly what it owns — a canvas, a scene, a quality snapshot — not a live reference to a sibling
* controller), and disposal already reads as a flat list. Wrapping those three lines in a class
* would not remove coordination logic; it would relocate it and add an indirection every reader has
* to look through to find the same three calls.
*
* What is left in this file after Priorities 3/5/6 — pointer/keyboard DOM event handling, the
* progressive-load state machine, part hover/select, the cinematic-tour keyboard shortcuts — is not
* spare renderer/camera/environment coordination looking for a home. It is this component's actual
* job: translating DOM and scene events into the React callback props above. None of it can move
* into a plain, renderer-agnostic class without smuggling application state (React props, callback
* closures) into the Three.js module layer, which is exactly the boundary `CameraController`/
* `EnvironmentController`/`RenderController` were each built to hold ("no application-state or
* agent-layer dependency" — every one of their own doc comments says this). A `SceneRuntime` that
* owned pointer handling to justify its own existence would be the dumping ground the mission named
* as the failure mode, not a fix for one.
*/
function VehicleCanvas({ threeDConfig, slug, catalog, cameraPreset, lift, terrain, environmentPreset, hdriPresetId, onReady, onError, onProgress, tourAction, onTourStatusChange, onTourStep, onPartHover, onPartSelect }) {
	const hostRef = (0, import_react.useRef)(null);
	const cameraControllerRef = (0, import_react.useRef)(null);
	/** True while the cinematic tour owns the camera — suppresses the preset-change GSAP effect. */
	const tourActiveRef = (0, import_react.useRef)(false);
	const rootRef = (0, import_react.useRef)(null);
	/** Grounded `position.y` from `prepareVehicleRoot`; lift is applied relative to it. */
	const groundedYRef = (0, import_react.useRef)(0);
	/**
	* Bumped once the model is in the scene. The lift effect depends on it so the initial ride height
	* is applied when the root appears — otherwise the effect runs only while the 39 MB GLB is still
	* loading, finds no root, and never reruns because `lift` itself has not changed.
	*/
	const [sceneRevision, setSceneRevision] = (0, import_react.useState)(0);
	const environmentControllerRef = (0, import_react.useRef)(null);
	const renderControllerRef = (0, import_react.useRef)(null);
	const onReadyRef = (0, import_react.useRef)(onReady);
	const onErrorRef = (0, import_react.useRef)(onError);
	const onProgressRef = (0, import_react.useRef)(onProgress);
	const catalogRef = (0, import_react.useRef)(catalog);
	const onTourStatusChangeRef = (0, import_react.useRef)(onTourStatusChange);
	const onTourStepRef = (0, import_react.useRef)(onTourStep);
	const onPartHoverRef = (0, import_react.useRef)(onPartHover);
	const onPartSelectRef = (0, import_react.useRef)(onPartSelect);
	const cameraPresetRef = (0, import_react.useRef)(cameraPreset);
	(0, import_react.useEffect)(() => {
		onReadyRef.current = onReady;
		onErrorRef.current = onError;
		onProgressRef.current = onProgress;
		catalogRef.current = catalog;
		cameraPresetRef.current = cameraPreset;
		onTourStatusChangeRef.current = onTourStatusChange;
		onTourStepRef.current = onTourStep;
		onPartHoverRef.current = onPartHover;
		onPartSelectRef.current = onPartSelect;
	}, [
		cameraPreset,
		catalog,
		onError,
		onProgress,
		onReady,
		onTourStatusChange,
		onTourStep,
		onPartHover,
		onPartSelect
	]);
	(0, import_react.useEffect)(() => {
		let cleanup;
		let cancelled = false;
		(async () => {
			const host = hostRef.current;
			if (!host) return;
			const scene = new Scene();
			scene.background = new Color("#0b0f14");
			scene.fog = new Fog("#0b0f14", 16, 32);
			const renderController = await RenderController.create({
				host,
				onResize: (width, height) => {
					cameraControllerRef.current?.setAspect(width, height);
				},
				onQualityChange: (next) => {
					environmentControllerRef.current?.applyQuality(next);
				},
				onContextLost: () => {
					onErrorRef.current("Rendering was interrupted. Attempting to recover the 3D view.");
				}
			});
			if (cancelled) {
				renderController.dispose();
				return;
			}
			renderControllerRef.current = renderController;
			const canvasElement = renderController.canvas;
			const cameraController = new CameraController({
				domElement: canvasElement,
				initialPreset: cameraPreset,
				presets: threeDConfig.cameraPresets,
				onTourStatusChange: (status) => {
					tourActiveRef.current = status !== "idle";
					onTourStatusChangeRef.current?.(status);
				},
				onTourStep: (preset) => {
					onTourStepRef.current?.(preset);
				}
			});
			cameraControllerRef.current = cameraController;
			const camera = cameraController.camera;
			const environmentController = new EnvironmentController({
				scene,
				quality: renderController.currentQuality,
				initialTerrain: terrain,
				initialPreset: environmentPreset,
				starfieldCount: renderController.currentQuality.starfieldCount
			});
			environmentControllerRef.current = environmentController;
			renderController.attachScene(scene, camera);
			renderController.resize();
			/**
			* Keyboard cursor into `controller.findPartsByCapability("selectable")` — the "]"/"["/"Enter"
			* cases below cycle and select through it. A plain index rather than a semantic ID because
			* the list itself can change (a swapped GLB, a satisfied scene map growing); re-deriving the
			* list on every keypress and reusing the index is simpler than tracking staleness.
			*/
			let keyboardPartIndex = -1;
			/**
			* Keyboard orbit, zoom, and reset.
			*
			* OrbitControls' own `listenToKeyEvents` binds the arrows to *panning*, which slides the whole
			* scene sideways and is close to useless for inspecting a vehicle — what a user wants from the
			* arrows here is to walk around it. So the orbit is computed directly, in spherical
			* coordinates about the control target, honouring the same polar and distance limits the
			* mouse path is constrained by. Without this the entire 3D stage was reachable by pointer only.
			*/
			const handleKeyDown = (event) => {
				if (event.altKey || event.ctrlKey || event.metaKey) return;
				cameraController.cancelTour();
				switch (event.key) {
					case "ArrowLeft":
						cameraController.orbitBy(-KEYBOARD_ORBIT_STEP_RADIANS, 0);
						break;
					case "ArrowRight":
						cameraController.orbitBy(KEYBOARD_ORBIT_STEP_RADIANS, 0);
						break;
					case "ArrowUp":
						cameraController.orbitBy(0, -KEYBOARD_ORBIT_STEP_RADIANS);
						break;
					case "ArrowDown":
						cameraController.orbitBy(0, KEYBOARD_ORBIT_STEP_RADIANS);
						break;
					case "+":
					case "=":
						cameraController.dollyBy(-KEYBOARD_ZOOM_STEP);
						break;
					case "-":
					case "_":
						cameraController.dollyBy(KEYBOARD_ZOOM_STEP);
						break;
					case "Home":
						cameraController.resetToPreset(cameraPresetRef.current);
						event.preventDefault();
						return;
					case "]":
					case "[": {
						if (!controller) return;
						const parts = controller.findPartsByCapability("selectable");
						if (parts.length === 0) return;
						keyboardPartIndex = (keyboardPartIndex + (event.key === "]" ? 1 : -1) + parts.length) % parts.length;
						const part = parts[keyboardPartIndex];
						controller.hoverPart(part.id);
						canvasElement.dataset.hoveredPart = part.id;
						onPartHoverRef.current?.(part);
						event.preventDefault();
						return;
					}
					case "Enter": {
						if (!controller || keyboardPartIndex < 0) return;
						const part = controller.findPartsByCapability("selectable")[keyboardPartIndex];
						if (!part) return;
						controller.selectPart(part.id);
						canvasElement.dataset.selectedPart = part.id;
						onPartSelectRef.current?.(part);
						event.preventDefault();
						return;
					}
					case "Escape":
						if (!controller) return;
						controller.clearSelection();
						controller.hoverPart(void 0);
						canvasElement.dataset.selectedPart = "";
						canvasElement.dataset.hoveredPart = "";
						keyboardPartIndex = -1;
						onPartSelectRef.current?.(void 0);
						onPartHoverRef.current?.(void 0);
						event.preventDefault();
						return;
					default: return;
				}
				event.preventDefault();
			};
			host.addEventListener("keydown", handleKeyDown);
			const uninstallMetricsFlush = installMetricsFlush();
			let contactShadow = null;
			let controller = null;
			/**
			* Direct part interaction: pointer hover previews a part, a click/tap selects it (or clears
			* the selection when it misses everything selectable), and dragging to orbit never triggers
			* either — `three-mesh-bvh`-accelerated picking (`VehicleSceneController.pickAt`) makes the
			* raycast itself cheap; this block is what keeps it from running when nothing needs it.
			*
			* Distinguishing a click from the start of a drag is what makes this safe to layer on top of
			* `OrbitControls`, which is listening to the same `pointerdown`/`pointermove`/`pointerup`
			* sequence on this element: a `pointerup` only selects when the pointer moved less than
			* `DRAG_THRESHOLD_PX` since `pointerdown`, and hover raycasting is suppressed entirely while
			* the pointer is down and past that threshold, so an orbit drag never fights a hover pick for
			* the same frame.
			*/
			const DRAG_THRESHOLD_PX = 6;
			let pointerDownAt = null;
			let isDragging = false;
			let hoverRafPending = false;
			let hoverRafId = 0;
			let lastHoverNdc = null;
			/**
			* The one pointer this block is currently tracking for a potential tap/click, by
			* `PointerEvent.pointerId`. Without this, a second finger touching down mid-gesture (the
			* start of a two-finger pinch/pan — `OrbitControls` handles that gesture itself, via its own
			* listeners on this same element) would overwrite `pointerDownAt`/`isDragging`, which were
			* mid-flight for the first finger, and could turn a pinch into a spurious selection when
			* either finger lifts. `null` means no candidate tap is in flight.
			*/
			let activePointerId = null;
			const reportHover = (entry) => {
				canvasElement.dataset.hoveredPart = entry?.id ?? "";
				onPartHoverRef.current?.(entry);
			};
			const reportSelection = (entry) => {
				canvasElement.dataset.selectedPart = entry?.id ?? "";
				onPartSelectRef.current?.(entry);
			};
			const clearHover = () => {
				lastHoverNdc = null;
				if (!controller) return;
				controller.hoverPart(void 0);
				reportHover(void 0);
			};
			const scheduleHoverPick = () => {
				if (hoverRafPending) return;
				hoverRafPending = true;
				hoverRafId = requestAnimationFrame(() => {
					hoverRafPending = false;
					if (!controller || !lastHoverNdc) return;
					const result = controller.pickAt(lastHoverNdc, camera);
					controller.hoverPart(result?.entry.id);
					reportHover(result?.entry);
				});
			};
			const isPrimaryPointer = (event) => event.pointerType !== "mouse" || event.button === 0;
			const handlePointerDown = (event) => {
				if (!isPrimaryPointer(event)) return;
				if (activePointerId !== null) {
					pointerDownAt = null;
					isDragging = false;
					return;
				}
				activePointerId = event.pointerId;
				pointerDownAt = {
					x: event.clientX,
					y: event.clientY
				};
				isDragging = false;
			};
			const handlePointerMove = (event) => {
				if (event.pointerId !== activePointerId) return;
				if (pointerDownAt) {
					const dx = event.clientX - pointerDownAt.x;
					const dy = event.clientY - pointerDownAt.y;
					if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) isDragging = true;
					return;
				}
				lastHoverNdc = pointerToNdc(event.clientX, event.clientY, canvasElement.getBoundingClientRect());
				scheduleHoverPick();
			};
			const handlePointerUp = (event) => {
				if (event.pointerId !== activePointerId) return;
				activePointerId = null;
				const downAt = pointerDownAt;
				const wasDragging = isDragging;
				pointerDownAt = null;
				isDragging = false;
				if (!downAt || wasDragging || !controller || !isPrimaryPointer(event)) return;
				const ndc = pointerToNdc(event.clientX, event.clientY, canvasElement.getBoundingClientRect());
				const result = controller.pickAt(ndc, camera);
				controller.selectPart(result?.entry.id);
				reportSelection(result?.entry);
				keyboardPartIndex = -1;
			};
			const handlePointerLeave = (event) => {
				if (event.pointerId === activePointerId) {
					activePointerId = null;
					pointerDownAt = null;
					isDragging = false;
				}
				clearHover();
			};
			canvasElement.addEventListener("pointerdown", handlePointerDown);
			canvasElement.addEventListener("pointermove", handlePointerMove);
			canvasElement.addEventListener("pointerup", handlePointerUp);
			canvasElement.addEventListener("pointerleave", handlePointerLeave);
			canvasElement.addEventListener("pointercancel", handlePointerLeave);
			renderController.start(() => cameraController.update());
			cleanup = () => {
				if (hoverRafPending) {
					cancelAnimationFrame(hoverRafId);
					hoverRafPending = false;
				}
				uninstallMetricsFlush();
				cameraControllerRef.current?.dispose();
				cameraControllerRef.current = null;
				tourActiveRef.current = false;
				host.removeEventListener("keydown", handleKeyDown);
				canvasElement.removeEventListener("pointerdown", handlePointerDown);
				canvasElement.removeEventListener("pointermove", handlePointerMove);
				canvasElement.removeEventListener("pointerup", handlePointerUp);
				canvasElement.removeEventListener("pointerleave", handlePointerLeave);
				canvasElement.removeEventListener("pointercancel", handlePointerLeave);
				environmentControllerRef.current?.dispose();
				environmentControllerRef.current = null;
				renderControllerRef.current?.dispose();
				renderControllerRef.current = null;
				if (controller) {
					controller.dispose();
					controller = null;
				} else if (rootRef.current) {
					scene.remove(rootRef.current);
					disposeSubtree(rootRef.current);
				}
				if (contactShadow) disposeContactShadow(contactShadow);
				rootRef.current = null;
			};
			let progressive = initialProgressiveState();
			const publishReady = (root) => {
				const report = verifyNodeContract(root, catalogRef.current);
				for (const entry of report.unsatisfied) console.warn(`[customization] option "${entry.option.id}" is unavailable for this asset.`, {
					missingNodes: entry.missingNodes,
					missingMaterials: entry.missingMaterials
				});
				controller = new VehicleSceneController(root, report.satisfied, getSceneMapForVehicle(slug));
				for (const unsatisfied of controller.sceneMapReport.unsatisfied) console.warn(`[scene] part "${unsatisfied.entry.id}" has no matching geometry in this asset: ${unsatisfied.reason}`);
				keyboardPartIndex = -1;
				onReadyRef.current(controller, report.satisfied);
			};
			const mountSettledRoot = (root) => {
				prepareVehicleRoot(root, threeDConfig);
				root.updateWorldMatrix(true, true);
				const footprint = new Box3().setFromObject(root);
				if (contactShadow) {
					scene.remove(contactShadow);
					disposeContactShadow(contactShadow);
				}
				contactShadow = createContactShadow(footprint);
				scene.add(contactShadow);
				buildProceduralAccessories(root);
				scene.add(root);
				rootRef.current = root;
				groundedYRef.current = root.position.y;
				setSceneRevision((revision) => revision + 1);
				publishReady(root);
			};
			if (!Boolean(threeDConfig.hasModel && threeDConfig.modelUrl)) {
				progressive = reduceProgressiveLoad(progressive, { type: "no-model" });
				const root = createProceduralVehicle();
				if (cancelled) {
					disposeSubtree(root);
					return;
				}
				mountSettledRoot(root);
			} else {
				progressive = reduceProgressiveLoad(progressive, { type: "start-placeholder" });
				const placeholder = createProceduralVehicle();
				placeholder.name = "PROGRESSIVE_PLACEHOLDER";
				placeholder.userData.__progressivePlaceholder = true;
				placeholder.position.y = 0;
				placeholder.rotation.y = Math.PI;
				scene.add(placeholder);
				rootRef.current = placeholder;
				groundedYRef.current = placeholder.position.y;
				setSceneRevision((revision) => revision + 1);
				progressive = reduceProgressiveLoad(progressive, { type: "start-loading" });
				canvasElement.dataset.loadPhase = progressive.phase;
				let detailed = null;
				try {
					const modelStartedAt = performance.now();
					detailed = await loadVehicleRoot(threeDConfig, (fraction) => onProgressRef.current?.(fraction));
					recordMetric({
						name: "model_loaded",
						value: Math.round(performance.now() - modelStartedAt)
					});
					progressive = reduceProgressiveLoad(progressive, { type: "glb-decoded" });
				} catch (error) {
					console.error("High-detail glTF failed to load; using procedural fallback.", error);
					onErrorRef.current("The detailed model could not be loaded. Showing a simplified vehicle.");
					progressive = reduceProgressiveLoad(progressive, { type: "load-failed" });
				}
				if (cancelled) {
					if (detailed) disposeSubtree(detailed);
					scene.remove(placeholder);
					disposeSubtree(placeholder);
					rootRef.current = null;
					return;
				}
				canvasElement.dataset.loadPhase = progressive.phase;
				if (detailed && progressive.hasDetailedModel) {
					if (renderController.currentQuality.loadAuthoredRunningGear) try {
						await installWheelAndTireAssets(detailed, threeDConfig);
					} catch (error) {
						console.warn("[customization] supplied wheel and tyre glTFs could not be loaded.", error);
					}
					if (cancelled) {
						disposeSubtree(detailed);
						scene.remove(placeholder);
						disposeSubtree(placeholder);
						rootRef.current = null;
						return;
					}
					scene.remove(placeholder);
					disposeSubtree(placeholder);
					mountSettledRoot(detailed);
					progressive = reduceProgressiveLoad(progressive, { type: "settled" });
				} else {
					scene.remove(placeholder);
					mountSettledRoot(placeholder);
				}
			}
			canvasElement.dataset.loadPhase = progressive.phase;
		})().catch((error) => {
			console.error("Vehicle scene initialization failed:", error);
			onErrorRef.current(error instanceof Error ? error.message : String(error));
		});
		return () => {
			cancelled = true;
			cleanup?.();
		};
	}, [threeDConfig]);
	(0, import_react.useEffect)(() => {
		const root = rootRef.current;
		if (!root) return;
		gsapWithCSS.to(root.position, {
			y: groundedYRef.current + lift * .045,
			duration: motionDuration(.35),
			ease: "power2.out"
		});
	}, [lift, sceneRevision]);
	(0, import_react.useEffect)(() => {
		const cameraController = cameraControllerRef.current;
		if (!cameraController) return;
		if (tourActiveRef.current) return;
		cameraController.transitionToPreset(cameraPreset);
	}, [cameraPreset]);
	(0, import_react.useEffect)(() => {
		if (!tourAction) return;
		const cameraController = cameraControllerRef.current;
		if (!cameraController) return;
		if (tourAction.type === "play") cameraController.playTour();
		else if (tourAction.type === "pause") cameraController.pauseTour();
		else cameraController.cancelTour();
	}, [tourAction]);
	(0, import_react.useEffect)(() => {
		cameraControllerRef.current?.setPresets(threeDConfig.cameraPresets);
	}, [threeDConfig.cameraPresets]);
	(0, import_react.useEffect)(() => {
		environmentControllerRef.current?.setTerrainAndPreset(terrain, environmentPreset);
	}, [terrain, environmentPreset]);
	(0, import_react.useEffect)(() => {
		const environmentController = environmentControllerRef.current;
		const renderController = renderControllerRef.current;
		if (!environmentController || !renderController || !hdriPresetId) return;
		environmentController.applyHdri(renderController.renderer, hdriPresetId);
	}, [
		hdriPresetId,
		terrain,
		environmentPreset,
		sceneRevision
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: "vehicle-canvas",
		tabIndex: 0,
		role: "group",
		"aria-label": "Vehicle viewer. Use arrow keys to orbit the vehicle, plus and minus to zoom, and Home to return to the selected camera angle. Use the right and left bracket keys to cycle through selectable vehicle parts, Enter to select the highlighted part, and Escape to clear the selection. Click or tap a part directly to select it."
	});
}
/** A soft radial-gradient disc rather than a real-time shadow: it reads as a grounding cue under
* every lighting preset and camera angle, including ones where the directional shadow map is thin
* or absent (e.g. a shallow key-light angle), instead of the vehicle relying on the dynamic shadow
* alone to look like it's resting on the floor. */
function createContactShadow(footprint) {
	const size = footprint.getSize(new Vector3());
	const width = Math.max(size.x, .5) * 1.6;
	const depth = Math.max(size.z, .5) * 1.3;
	const texture = createRadialGradientTexture();
	const material = new MeshBasicMaterial({
		map: texture,
		transparent: true,
		depthWrite: false,
		toneMapped: false
	});
	const mesh = new Mesh(new PlaneGeometry(width, depth), material);
	mesh.name = "CONTACT_SHADOW";
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = .0012;
	return mesh;
}
function disposeContactShadow(mesh) {
	mesh.geometry.dispose();
	const material = mesh.material;
	material.map?.dispose();
	material.dispose();
}
function createRadialGradientTexture() {
	const size = 128;
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	gradient.addColorStop(0, "rgba(0,0,0,0.6)");
	gradient.addColorStop(.55, "rgba(0,0,0,0.32)");
	gradient.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	return texture;
}
async function loadVehicleRoot(threeDConfig, onProgress) {
	if (!threeDConfig.hasModel || !threeDConfig.modelUrl) return createProceduralVehicle();
	return (await getGltfLoader().loadAsync(threeDConfig.modelUrl, (event) => {
		if (!event.lengthComputable || event.total <= 0) return;
		onProgress?.(Math.min(event.loaded / event.total, 1));
	})).scene;
}
/**
* Mounts the supplied standalone running-gear assets at the authored wheel mounts. The original
* meshes are removed (not merely hidden) so the catalog's exact node-name contract resolves to
* the replacements and the scene never renders duplicate wheels or tyres.
*/
async function installWheelAndTireAssets(root, threeDConfig) {
	const config = threeDConfig.wheelAndTireAssets;
	if (!config) return;
	const mounts = threeDConfig.wheelMountNames.map((name) => root.getObjectByName(name));
	if (mounts.some((mount) => !mount)) {
		console.warn("[customization] supplied wheel and tyre glTFs were not mounted: wheel mounts are missing.");
		return;
	}
	const [wheelSource, tireSource] = await Promise.all([loadAsset(config.wheelUrl), loadAsset(config.tireUrl)]);
	for (let index = 0; index < mounts.length; index += 1) {
		const wheelNodeName = config.wheelNodeNames[index];
		const tireNodeName = config.tireNodeNames[index];
		removeNode(root.getObjectByName(wheelNodeName));
		removeNode(root.getObjectByName(tireNodeName));
		const assembly = new Group();
		assembly.name = `AUTHORED_RUNNING_GEAR_${index}`;
		const tire = instantiateAsset(tireSource);
		tire.name = tireNodeName;
		const wheel = instantiateAsset(wheelSource);
		wheel.name = wheelNodeName;
		renameMaterials(wheel, index < 2 ? "wheel.metal" : "wheel.metal.001");
		assembly.add(tire, wheel);
		attachToMount(mounts[index], assembly, "authored-wheel-and-tire");
		assembly.scale.setScalar(config.scale ?? 1);
	}
}
function removeNode(node) {
	node?.parent?.remove(node);
}
/**
* Renames the `wheel.metal` slot on `root`'s meshes to `name`, cloning the material first.
*
* `instantiateAsset` reuses geometry and materials by reference (`SkeletonUtils.clone`, see
* `assets.ts`), so all four wheel assemblies mounted from the same source share one `wheel.metal`
* `Material` instance. Renaming it in place — the previous behaviour — mutated that shared object:
* relabelling the rear pair to `wheel.metal.001` silently relabelled the front pair too, since both
* pairs pointed at the same object, leaving no mesh named `wheel.metal` at all. Every wheel-colour
* catalog option targets both slots by name (`WHEEL_MATERIALS = ["wheel.metal", "wheel.metal.001"]`
* in `lib/data/options/*.ts`), so that collapsed contract silently dropped every one of them from
* the served catalog (`verifyNodeContract` reports the missing slot and removes the option, exactly
* as it's designed to for a genuinely absent material — there was no way for it to tell renamed and
* missing apart). Cloning here gives this wheel assembly its own material instance to rename,
* leaving the shared cached original — and every other assembly still using it — untouched.
*/
function renameMaterials(root, name) {
	if (name === "wheel.metal") return;
	root.traverse((object) => {
		if (!(object instanceof Mesh)) return;
		const renamed = (Array.isArray(object.material) ? object.material : [object.material]).map((material) => {
			if (material.name !== "wheel.metal") return material;
			const clone = material.clone();
			clone.name = name;
			return clone;
		});
		object.material = Array.isArray(object.material) ? renamed : renamed[0];
	});
}
/**
* Hides retained donor geometry, then centres and grounds the vehicle using only the nodes the
* catalog nominates. Exported for the grounding test.
*/
function prepareVehicleRoot(root, threeDConfig) {
	root.name = "VEHICLE_ROOT";
	for (const name of threeDConfig.hiddenNodeNames ?? []) {
		const node = root.getObjectByName(name);
		if (node) node.visible = false;
		else console.warn(`[customization] hiddenNodeNames references a missing node: "${name}"`);
	}
	root.traverse((object) => {
		if (!(object instanceof Mesh)) return;
		object.castShadow = true;
		object.receiveShadow = true;
	});
	const box = boundsOf(root, threeDConfig.groundingNodeNames);
	if (box) {
		const center = box.getCenter(new Vector3());
		const size = box.getSize(new Vector3());
		root.position.sub(center);
		root.position.y += size.y / 2;
	}
	root.rotation.y = Math.PI;
}
function boundsOf(root, nodeNames) {
	root.updateWorldMatrix(true, true);
	if (!nodeNames?.length) return new Box3().setFromObject(root);
	const box = new Box3();
	let any = false;
	for (const name of nodeNames) {
		const node = root.getObjectByName(name);
		if (!node) continue;
		box.expandByObject(node);
		any = true;
	}
	return any ? box : new Box3().setFromObject(root);
}
//#endregion
export { VehicleCanvas };
