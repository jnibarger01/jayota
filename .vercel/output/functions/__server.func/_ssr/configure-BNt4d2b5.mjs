import { o as __toESM } from "../_runtime.mjs";
import { _ as paintStudioPriceDelta, a as HDRI_PRESETS, b as withOptionSelected, h as isSelected, l as defaultPaintStudioCustom, m as isProceduralPreview, n as CUSTOMIZATION_SCHEMA_VERSION, o as PAINT_CUSTOM_OPTION_ID, p as isMultiSelect, r as DEFAULT_CUSTOM_MATERIAL, t as CATEGORY_APPLY_ORDER, u as defaultPaintStudioOem, y as withOptionDeselected } from "./paintStudio-DYvbOXnp.mjs";
import { H as require_jsx_runtime, U as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isOptionAvailableForGrade } from "./lineup-m5PRC25T.mjs";
import { a as forbidden, c as revisionConflict, o as invalidBody, s as notFound, t as ApiError } from "./rate-limit-Bmx5kPmD.mjs";
import { A as CloudSun, B as Armchair, C as Landmark, E as Expand, I as Check, M as ClipboardCheck, N as CircleGauge, O as Download, R as Camera, S as Lightbulb, _ as PaintBucket, a as TriangleAlert, c as Share2, d as Save, f as RotateCcw, g as Pause, h as Play, i as Truck, j as CloudOff, k as Cog, l as Settings2, m as Printer, n as X, o as SlidersHorizontal, p as Redo2, r as Undo2, s as Shuffle, t as ZoomIn, u as Search, v as Mountain, x as LoaderCircle, y as Map, z as Box } from "../_libs/lucide-react.mjs";
import { a as validatePatchConfiguration, c as generateOwnerToken, d as Route$2, i as validatePaintStudio, l as hashOwnerToken, n as validateCameraState, o as validateSelections, r as validateCreateConfiguration, s as validateVehicleIdentity, u as verifyOwnerToken } from "./router-BebVFJVp.mjs";
import { r as pageUrl, t as getVehicle } from "./client-BzQaeYA7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configure-BNt4d2b5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORE_KEY = "toyota-showroom:configurations:v1";
var RECOVERY_KEY = "toyota-showroom:recovery:v1";
function readStore() {
	try {
		const raw = window.localStorage.getItem(STORE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function writeStore(store) {
	try {
		window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
	} catch (cause) {
		throw new ApiError(507, "local_persistence_failed", "This browser could not persist the configuration. The current view is not durable across reloads.", { cause });
	}
}
function newId() {
	return `cfg_${(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)).replace(/-/g, "").slice(0, 20)}`;
}
var localConfigurationTransport = {
	async create(input) {
		const validated = validateCreateConfiguration(input);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const configuration = {
			configurationId: newId(),
			vehicleId: validated.vehicleId,
			modelYear: validated.modelYear,
			model: validated.model,
			gradeId: validated.gradeId,
			selections: validated.selections,
			cameraState: validated.cameraState,
			paintStudio: validated.paintStudio,
			revision: 1,
			schemaVersion: CUSTOMIZATION_SCHEMA_VERSION,
			createdAt: now,
			updatedAt: now
		};
		const ownerToken = generateOwnerToken();
		const ownerTokenHash = await hashOwnerToken(ownerToken);
		const store = readStore();
		store[configuration.configurationId] = {
			configuration,
			ownerTokenHash
		};
		writeStore(store);
		return {
			configuration,
			ownerToken
		};
	},
	async get(configurationId) {
		const record = readStore()[configurationId];
		if (!record) throw notFound(`No configuration found with id "${configurationId}".`);
		return record.configuration;
	},
	async update(configurationId, patch, ownerToken) {
		const store = readStore();
		const stored = store[configurationId];
		if (!stored) throw notFound(`No configuration found with id "${configurationId}".`);
		if (!await verifyOwnerToken(ownerToken, stored.ownerTokenHash)) throw forbidden(`Owner token missing or does not match for configuration "${configurationId}".`);
		const existing = stored.configuration;
		const validated = validatePatchConfiguration(patch, {
			vehicleId: existing.vehicleId,
			gradeId: existing.gradeId,
			selections: existing.selections
		});
		if (validated.expectedRevision !== void 0 && validated.expectedRevision !== existing.revision) throw revisionConflict(`Configuration "${configurationId}" is at revision ${existing.revision}, not ${validated.expectedRevision}.`);
		const next = {
			...existing,
			selections: validated.selections ?? existing.selections,
			cameraState: validated.cameraState ?? existing.cameraState,
			paintStudio: validated.paintStudio ?? existing.paintStudio,
			revision: existing.revision + 1,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		store[configurationId] = {
			configuration: next,
			ownerTokenHash: stored.ownerTokenHash
		};
		writeStore(store);
		this.clearRecovery(configurationId);
		return next;
	},
	async delete(configurationId, ownerToken) {
		const store = readStore();
		const stored = store[configurationId];
		if (!stored) return;
		if (!await verifyOwnerToken(ownerToken, stored.ownerTokenHash)) throw forbidden(`Owner token missing or does not match for configuration "${configurationId}".`);
		delete store[configurationId];
		writeStore(store);
		this.clearRecovery(configurationId);
	},
	saveRecovery(configuration) {
		try {
			window.localStorage.setItem(RECOVERY_KEY, JSON.stringify(configuration));
		} catch {}
	},
	readRecovery(configurationId) {
		try {
			const raw = window.localStorage.getItem(RECOVERY_KEY);
			if (!raw) return null;
			const value = JSON.parse(raw);
			return value.configurationId === configurationId ? value : null;
		} catch {
			return null;
		}
	},
	clearRecovery(configurationId) {
		try {
			if (this.readRecovery(configurationId)) window.localStorage.removeItem(RECOVERY_KEY);
		} catch {}
	},
	/**
	* Every configuration currently in this browser's local store — used by the multi-vehicle garage
	* to list builds when Worker/D1 is unavailable. Read-only; does not require owner tokens.
	*/
	list() {
		return Object.values(readStore()).map((record) => record.configuration);
	}
};
/**
* The only module in the client that talks to the configuration endpoints.
*
* UI components never call `fetch` — they call the store, the store calls this. That keeps request
* shape, error translation, and base-path handling in one place, and makes the store trivially
* testable by stubbing this module.
*/
var basePath = typeof import.meta !== "undefined" && "/" ? "/".replace(/\/$/, "") : "";
function apiUrl(path) {
	return `${basePath}/api/v1${path}`;
}
async function request(url, init) {
	let response;
	try {
		response = await fetch(url, {
			...init,
			headers: {
				"Content-Type": "application/json",
				...init?.headers
			}
		});
	} catch (cause) {
		throw new ApiError(0, "network_error", "Could not reach the configuration service.", { cause });
	}
	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new ApiError(response.status, body?.error?.code ?? "request_failed", body?.error?.message ?? `Request to ${url} failed with ${response.status}`);
	}
	if (response.status === 204) return void 0;
	return response.json();
}
/**
* Whether the request-aware backend is reachable.
*
* `null` until proven either way. It latches to `false` the first time a *write* fails in a way
* only a host without the route can fail — a network error, a 405, or a 404 on POST/PATCH, which
* is precisely what the static GitHub Pages export returns. A 404 on GET is left alone, because
* against a live API it means the configuration genuinely does not exist.
*
* Worker/D1 is the production persistence path. Pages keeps `local` as a demo/offline fallback
* so the static site still saves and shares (via deep links) without a live API.
*/
var remoteAvailable = null;
var persistenceModeListeners = /* @__PURE__ */ new Set();
function notifyPersistenceModeListeners() {
	for (const listener of persistenceModeListeners) listener();
}
function setRemoteAvailable(value) {
	if (remoteAvailable === value) return;
	remoteAvailable = value;
	notifyPersistenceModeListeners();
}
/** Current persistence surface — safe to read from UI after bootstrap/save has run. */
function getPersistenceMode() {
	if (remoteAvailable === null) return "unknown";
	return remoteAvailable ? "worker" : "local";
}
/** Subscribe to latch changes (`unknown` → `worker` | `local`). Returns an unsubscribe. */
function subscribePersistenceMode(listener) {
	persistenceModeListeners.add(listener);
	return () => {
		persistenceModeListeners.delete(listener);
	};
}
function indicatesMissingBackend(error, method) {
	if (!(error instanceof ApiError)) return false;
	if (error.code === "network_error" || error.status === 405 || error.status === 501) return true;
	if (error.status === 404) {
		if (method === "WRITE") return true;
		return error.code !== "not_found";
	}
	return false;
}
async function withFallback(method, remote, local) {
	if (remoteAvailable === false) return local();
	try {
		const result = await remote();
		setRemoteAvailable(true);
		return result;
	} catch (error) {
		if (indicatesMissingBackend(error, method)) {
			setRemoteAvailable(false);
			console.info("[configurations] No Worker/D1 backend detected; using local demo persistence (saves stay in this browser; share uses deep links).");
			return local();
		}
		throw error;
	}
}
/**
* Owner-token bookkeeping (lib/shared/ownerToken.ts).
*
* `createConfiguration` receives a plaintext capability token exactly once and remembers it here;
* `updateConfiguration`/`deleteConfiguration` attach it automatically. This is deliberately invisible
* to every caller above this module — `configurationStore.ts` and `BuilderApp.tsx` call
* `updateConfiguration(id, patch)` exactly as before and need no awareness that a write is now
* authenticated at all.
*/
var OWNER_TOKENS_STORAGE_KEY = "toyota-showroom:ownerTokens";
var OWNER_TOKEN_HEADER = "X-Owner-Token";
function readOwnerTokens() {
	try {
		const raw = window.localStorage.getItem(OWNER_TOKENS_STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function rememberOwnerToken(configurationId, ownerToken) {
	try {
		const tokens = readOwnerTokens();
		tokens[configurationId] = ownerToken;
		window.localStorage.setItem(OWNER_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
	} catch {}
}
function ownerTokenFor(configurationId) {
	return readOwnerTokens()[configurationId] ?? "";
}
/**
* The customization catalog is static data and is read from the generated snapshot, the same way
* `lib/api/client.ts` reads vehicles. Grade filtering happens here because a static host cannot
* vary a file by query string.
*/
async function listVehicleOptions(vehicleId, gradeId) {
	const { getOptionsForVehicle, isOptionAvailableForGrade } = await import("./lineup-m5PRC25T.mjs").then((n) => n.m).then((n) => n.d);
	const normalized = getOptionsForVehicle(vehicleId).map((option) => normalizeOptionAssets(option));
	return gradeId ? normalized.filter((option) => isOptionAvailableForGrade(option, gradeId)) : normalized;
}
/**
* Catalog data stores root-relative asset URLs. Under the GitHub Pages deployment the site is
* mounted at a sub-path, so every URL a loader will consume needs the same prefix `lib/api/client.ts`
* applies to vehicle media — otherwise a decal texture or replacement GLB is fetched from the domain
* root and 404s the moment those options become contract-satisfied.
*/
function normalizeOptionAssets(option, base = basePath) {
	const withBase = (url) => url.startsWith("/") ? `${base}${url}` : url;
	const next = { ...option };
	if (next.assetUrl) next.assetUrl = withBase(next.assetUrl);
	if (next.thumbnailUrl) next.thumbnailUrl = withBase(next.thumbnailUrl);
	if (next.materialConfig?.textureUrl) next.materialConfig = {
		...next.materialConfig,
		textureUrl: withBase(next.materialConfig.textureUrl)
	};
	return next;
}
async function createConfiguration(input) {
	return withFallback("WRITE", async () => {
		const { data, ownerToken } = await request(apiUrl("/configurations"), {
			method: "POST",
			body: JSON.stringify(input)
		});
		rememberOwnerToken(data.configurationId, ownerToken);
		return data;
	}, async () => {
		const { configuration, ownerToken } = await localConfigurationTransport.create(input);
		rememberOwnerToken(configuration.configurationId, ownerToken);
		return configuration;
	});
}
async function getConfiguration(configurationId) {
	return withFallback("GET", async () => {
		const { data } = await request(apiUrl(`/configurations/${encodeURIComponent(configurationId)}`));
		return data;
	}, () => localConfigurationTransport.get(configurationId));
}
async function updateConfiguration(configurationId, input, options = {}) {
	return withFallback("WRITE", async () => {
		const { data } = await request(apiUrl(`/configurations/${encodeURIComponent(configurationId)}`), {
			method: "PATCH",
			body: JSON.stringify(input),
			keepalive: options.keepalive,
			headers: { [OWNER_TOKEN_HEADER]: ownerTokenFor(configurationId) }
		});
		return data;
	}, () => localConfigurationTransport.update(configurationId, input, ownerTokenFor(configurationId)));
}
var PERSIST_DEBOUNCE_MS = 400;
function emptyState() {
	return {
		configuration: null,
		catalog: [],
		status: "idle",
		error: null,
		pending: /* @__PURE__ */ new Set()
	};
}
var ConfigurationStore = class {
	state = emptyState();
	listeners = /* @__PURE__ */ new Set();
	controller = null;
	flushTimer = null;
	flushPromise = null;
	flushRequested = false;
	mutationVersion = 0;
	lastPersisted = null;
	batchedOptionIds = /* @__PURE__ */ new Set();
	subscribe = (listener) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	};
	getSnapshot = () => this.state;
	setState(patch) {
		this.state = {
			...this.state,
			...patch
		};
		for (const listener of this.listeners) listener();
	}
	/**
	* Publish configuration + catalog before the detailed mesh settles so builder chrome (option
	* buttons, Share, camera persistence) is usable after bootstrap / progressive first paint.
	* Scene mutations no-op until `attachScene` wires a controller (`applyToScene` early-returns).
	*/
	hydrate(configuration, catalog) {
		this.controller = null;
		this.lastPersisted = configuration;
		this.mutationVersion = 0;
		this.batchedOptionIds.clear();
		if (this.flushTimer) clearTimeout(this.flushTimer);
		this.flushTimer = null;
		this.flushRequested = false;
		this.setState({
			configuration,
			catalog,
			status: "idle",
			error: null,
			pending: /* @__PURE__ */ new Set()
		});
	}
	async attachScene(controller, configuration, catalog) {
		this.controller = controller;
		if (!(this.state.configuration?.configurationId === configuration.configurationId)) {
			this.lastPersisted = configuration;
			this.mutationVersion = 0;
			this.batchedOptionIds.clear();
			this.setState({
				configuration,
				catalog,
				status: "idle",
				error: null,
				pending: /* @__PURE__ */ new Set()
			});
		} else {
			this.setState({
				configuration,
				catalog
			});
			if (!this.lastPersisted) this.lastPersisted = configuration;
		}
		const { failed } = await controller.applyConfiguration(configuration.selections, this.state.configuration?.paintStudio ?? configuration.paintStudio);
		if (failed.length > 0) this.setState({
			status: "error",
			error: `Could not apply saved options: ${failed.join(", ")}`
		});
	}
	detachScene() {
		this.controller = null;
	}
	reset() {
		if (this.flushTimer) clearTimeout(this.flushTimer);
		this.flushTimer = null;
		this.flushRequested = false;
		this.batchedOptionIds.clear();
		this.lastPersisted = null;
		this.mutationVersion = 0;
		this.state = emptyState();
		for (const listener of this.listeners) listener();
	}
	async selectOption(option) {
		const current = this.state.configuration;
		if (!current) return;
		const alreadyOn = isSelected(current.selections, option);
		if (alreadyOn && !isMultiSelect(option.category)) return;
		const selections = alreadyOn ? withOptionDeselected(current.selections, option) : withOptionSelected(current.selections, option, this.state.catalog);
		let paintStudio = current.paintStudio;
		if (option.category === "paint" && option.id !== "paint-custom" && !alreadyOn) paintStudio = {
			mode: "oem",
			hdriPresetId: current.paintStudio?.hdriPresetId ?? "hdri-studio"
		};
		const next = {
			...current,
			selections,
			paintStudio,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.mutationVersion += 1;
		const pending = new Set(this.state.pending).add(option.id);
		this.setState({
			configuration: next,
			pending,
			status: "saving",
			error: null
		});
		this.batchedOptionIds.add(option.id);
		if (await this.applyToScene(option, !alreadyOn)) this.queueFlush();
	}
	async replaceSelections(selections) {
		const current = this.state.configuration;
		if (!current) return;
		const next = {
			...current,
			selections,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.mutationVersion += 1;
		this.setState({
			configuration: next,
			status: "saving",
			error: null,
			pending: /* @__PURE__ */ new Set()
		});
		if (this.controller) {
			const { failed } = await this.controller.applyConfiguration(selections, this.state.configuration?.paintStudio);
			if (failed.length > 0) {
				await this.rollback(`Could not apply options: ${failed.join(", ")}`);
				return;
			}
		}
		this.queueFlush();
	}
	/**
	* Updates OEM/custom paint-studio state. Custom material params are schema-safe numbers/hex —
	* GLB targets are applied via the scene controller's catalog constants.
	*/
	async setPaintStudio(paintStudio, selections) {
		const current = this.state.configuration;
		if (!current) return;
		const next = {
			...current,
			selections: selections ?? current.selections,
			paintStudio,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.mutationVersion += 1;
		this.setState({
			configuration: next,
			status: "saving",
			error: null
		});
		if (this.controller) {
			const { failed } = await this.controller.applyConfiguration(next.selections, paintStudio);
			if (failed.length > 0) {
				await this.rollback(`Could not apply paint studio: ${failed.join(", ")}`);
				return;
			}
		}
		this.queueFlush();
	}
	async applyToScene(option, enable) {
		const controller = this.controller;
		if (!controller) return true;
		if (!(enable ? await controller.applyOption(option) : await controller.removeOption(option))) {
			await this.rollback(`"${option.label}" could not be applied to the model.`);
			return false;
		}
		return true;
	}
	setCameraState(cameraState) {
		const current = this.state.configuration;
		if (!current) return;
		this.mutationVersion += 1;
		this.setState({
			configuration: {
				...current,
				cameraState
			},
			status: "saving"
		});
		this.queueFlush();
	}
	queueFlush() {
		if (this.flushTimer) clearTimeout(this.flushTimer);
		this.flushTimer = setTimeout(() => void this.flush(), PERSIST_DEBOUNCE_MS);
	}
	/**
	* `keepalive` is for the `pagehide` path: browsers may abort an ordinary in-flight fetch as the
	* document unloads, which would drop a click made inside the debounce window.
	*/
	async flush(options = {}) {
		if (this.flushTimer) clearTimeout(this.flushTimer);
		this.flushTimer = null;
		if (this.flushPromise) {
			this.flushRequested = true;
			await this.flushPromise;
			return;
		}
		this.flushPromise = this.performFlushLoop(options);
		try {
			await this.flushPromise;
		} finally {
			this.flushPromise = null;
		}
	}
	async performFlushLoop(options = {}) {
		do {
			this.flushRequested = false;
			const configuration = this.state.configuration;
			if (!configuration) return;
			const sentVersion = this.mutationVersion;
			const batched = [...this.batchedOptionIds];
			if (batched.length === 0 && this.matchesPersisted(configuration)) return;
			this.batchedOptionIds.clear();
			try {
				const saved = await updateConfiguration(configuration.configurationId, {
					selections: configuration.selections,
					cameraState: configuration.cameraState,
					paintStudio: configuration.paintStudio,
					expectedRevision: this.lastPersisted?.revision
				}, options);
				this.lastPersisted = saved;
				if (this.mutationVersion === sentVersion) this.setState({
					configuration: saved,
					status: "saved",
					error: null,
					pending: withoutIds(this.state.pending, batched)
				});
				else {
					const newer = this.state.configuration;
					this.setState({
						configuration: newer ? {
							...newer,
							revision: saved.revision,
							createdAt: saved.createdAt,
							updatedAt: saved.updatedAt
						} : saved,
						status: "saving",
						error: null,
						pending: withoutIds(this.state.pending, batched)
					});
					this.flushRequested = true;
				}
			} catch (error) {
				await this.rollback(error instanceof Error ? error.message : String(error), batched);
				return;
			}
		} while (this.flushRequested || this.batchedOptionIds.size > 0);
	}
	/** Whether the local record already matches what the server last confirmed. */
	matchesPersisted(configuration) {
		const persisted = this.lastPersisted;
		if (!persisted) return false;
		return JSON.stringify(configuration.selections) === JSON.stringify(persisted.selections) && JSON.stringify(configuration.cameraState ?? null) === JSON.stringify(persisted.cameraState ?? null) && JSON.stringify(configuration.paintStudio ?? null) === JSON.stringify(persisted.paintStudio ?? null);
	}
	async rollback(message, batched = []) {
		const restored = this.lastPersisted;
		this.mutationVersion += 1;
		this.batchedOptionIds.clear();
		this.flushRequested = false;
		this.setState({
			configuration: restored ?? this.state.configuration,
			status: "error",
			error: message,
			pending: withoutIds(this.state.pending, batched.length ? batched : [...this.state.pending])
		});
		if (restored && this.controller) await this.controller.applyConfiguration(restored.selections, restored.paintStudio);
	}
	clearError() {
		if (this.state.status === "error") this.setState({
			status: "idle",
			error: null
		});
	}
};
function withoutIds(pending, ids) {
	const next = new Set(pending);
	for (const id of ids) next.delete(id);
	return next;
}
var configurationStore = new ConfigurationStore();
/**
* React binding for the configuration store.
*
* `useSyncExternalStore` is given the store's identity-stable snapshot, so a re-render happens only
* when the store actually replaces state — clicking the already-selected paint chip does not.
*/
function useConfiguration() {
	return (0, import_react.useSyncExternalStore)(configurationStore.subscribe, configurationStore.getSnapshot, configurationStore.getSnapshot);
}
/** React binding for Worker vs local (Pages demo) persistence detection. */
function usePersistenceMode() {
	return (0, import_react.useSyncExternalStore)(subscribePersistenceMode, getPersistenceMode, getPersistenceMode);
}
function CustomizationButton({ option, variant = "chip", onBeforeSelect }) {
	const { configuration, pending } = useConfiguration();
	const selected = (configuration?.selections[option.category] ?? []).includes(option.id);
	const busy = pending.has(option.id);
	const onClick = () => {
		onBeforeSelect?.();
		configurationStore.selectOption(option);
	};
	if (variant === "swatch") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": option.label,
		"aria-pressed": selected,
		title: option.priceDelta ? `${option.label} (+$${option.priceDelta})` : option.label,
		className: selected ? "active" : "",
		style: { background: option.materialConfig?.color ?? "#333" },
		disabled: busy,
		onClick,
		children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			size: 12,
			className: "spin"
		}) : null
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-label": isProceduralPreview(option) ? `${option.label} (Preview)` : option.label,
		"aria-pressed": selected,
		className: `option-chip ${selected ? "active" : ""} ${isProceduralPreview(option) ? "is-preview" : ""}`.trim(),
		disabled: busy,
		onClick,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: option.label }),
			isProceduralPreview(option) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
				className: "option-preview-badge",
				"data-testid": "procedural-preview-badge",
				children: "Preview"
			}) : null,
			option.priceDelta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["+$", option.priceDelta.toLocaleString()] }) : null,
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				size: 13,
				className: "spin"
			}) : selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 }) : null
		]
	});
}
function materialFromOption(option) {
	const cfg = option?.materialConfig;
	return {
		color: cfg?.color ?? DEFAULT_CUSTOM_MATERIAL.color,
		metalness: cfg?.metalness ?? DEFAULT_CUSTOM_MATERIAL.metalness,
		roughness: cfg?.roughness ?? DEFAULT_CUSTOM_MATERIAL.roughness,
		clearcoat: cfg?.clearcoat ?? DEFAULT_CUSTOM_MATERIAL.clearcoat,
		clearcoatRoughness: cfg?.clearcoatRoughness ?? DEFAULT_CUSTOM_MATERIAL.clearcoatRoughness
	};
}
function PaintStudioPanel({ paintStudio, oemPaintOptions, selectedPaintId, catalog, onBeforeChange }) {
	const mode = paintStudio?.mode ?? "oem";
	const hdriPresetId = paintStudio?.hdriPresetId ?? "hdri-studio";
	const material = paintStudio?.material ?? DEFAULT_CUSTOM_MATERIAL;
	const customOption = catalog.find((option) => option.id === PAINT_CUSTOM_OPTION_ID);
	const switchMode = (nextMode) => {
		onBeforeChange?.();
		const currentSelections = configurationStore.getSnapshot().configuration?.selections ?? {};
		if (nextMode === "oem") {
			const fallback = oemPaintOptions.find((option) => option.id === selectedPaintId && option.id !== "paint-custom") ?? oemPaintOptions[0];
			const selections = {
				...currentSelections,
				paint: fallback ? [fallback.id] : []
			};
			configurationStore.setPaintStudio(defaultPaintStudioOem(hdriPresetId), selections);
			return;
		}
		const seeded = materialFromOption(oemPaintOptions.find((option) => option.id === selectedPaintId) ?? oemPaintOptions[0]);
		if (!customOption) return;
		configurationStore.setPaintStudio(defaultPaintStudioCustom(seeded, hdriPresetId), {
			...currentSelections,
			paint: [PAINT_CUSTOM_OPTION_ID]
		});
	};
	const updateMaterial = (patch) => {
		onBeforeChange?.();
		const nextMaterial = {
			...material,
			...patch
		};
		const currentSelections = configurationStore.getSnapshot().configuration?.selections ?? {};
		configurationStore.setPaintStudio({
			mode: "custom",
			hdriPresetId,
			material: nextMaterial
		}, {
			...currentSelections,
			paint: [PAINT_CUSTOM_OPTION_ID]
		});
	};
	const setHdri = (id) => {
		onBeforeChange?.();
		const next = mode === "custom" ? {
			mode: "custom",
			hdriPresetId: id,
			material
		} : defaultPaintStudioOem(id);
		configurationStore.setPaintStudio(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "control-section paint-studio",
		"data-testid": "paint-studio",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 14 }),
				" Paint studio",
				mode === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["+$", 595 .toLocaleString()] }) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "segmented",
				role: "group",
				"aria-label": "Paint studio mode",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: mode === "oem" ? "active" : "",
					"aria-pressed": mode === "oem",
					"data-testid": "paint-mode-oem",
					onClick: () => switchMode("oem"),
					children: "OEM"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: mode === "custom" ? "active" : "",
					"aria-pressed": mode === "custom",
					"data-testid": "paint-mode-custom",
					onClick: () => switchMode("custom"),
					disabled: !customOption,
					children: "Custom"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "paint-studio-sub",
				children: "HDRI preset"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chip-row paint-hdri-row",
				"data-testid": "paint-hdri-presets",
				children: HDRI_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `option-chip ${hdriPresetId === preset.id ? "active" : ""}`,
					"aria-pressed": hdriPresetId === preset.id,
					"data-testid": `hdri-${preset.id}`,
					onClick: () => setHdri(preset.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: preset.label }), preset.priceDelta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["+$", preset.priceDelta.toLocaleString()] }) : null]
				}, preset.id))
			}),
			mode === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "paint-micro-controls",
				"data-testid": "paint-micro-controls",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					htmlFor: "paint-studio-color",
					children: ["Colour", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "paint-studio-color",
						type: "color",
						value: material.color,
						onChange: (event) => updateMaterial({ color: event.target.value })
					})]
				}), [
					["metalness", "Metalness"],
					["roughness", "Roughness"],
					["clearcoat", "Clearcoat"],
					["clearcoatRoughness", "Clearcoat roughness"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					htmlFor: `paint-studio-${key}`,
					children: [
						label,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: material[key].toFixed(2) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: `paint-studio-${key}`,
							type: "range",
							min: 0,
							max: 1,
							step: .01,
							value: material[key],
							onChange: (event) => updateMaterial({ [key]: Number(event.target.value) })
						})
					]
				}, key))]
			}) : null
		]
	});
}
var CanvasErrorBoundary = class extends import_react.Component {
	state = {
		error: null,
		attempt: 0
	};
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error, info) {
		console.error("[canvas] 3D stage failed to render.", error, info.componentStack);
		this.props.onError?.(error);
	}
	retry = () => {
		this.setState((state) => ({
			error: null,
			attempt: state.attempt + 1
		}));
	};
	render() {
		const { error, attempt } = this.state;
		const { children, fallbackImage } = this.props;
		if (!error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children }, attempt);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "vehicle-canvas canvas-fallback",
			role: "alert",
			children: [fallbackImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "canvas-fallback-image",
				src: fallbackImage.url,
				alt: fallbackImage.alt
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "canvas-fallback-notice",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 18 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "canvas-fallback-title",
						children: "Interactive view unavailable"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "canvas-fallback-body",
						children: "Showing a static image instead. Every configuration option below still works."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "ghost",
						type: "button",
						onClick: this.retry,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 14 }), " Try again"]
					})
				]
			})]
		});
	}
};
/**
* Grade sticker price for a build total. Falls back to the vehicle's cheapest published MSRP when
* the grade id is missing or unknown — never trusts a client-supplied dollar figure.
*/
function resolveGradeMsrp(vehicle, gradeId) {
	if (!vehicle) return 0;
	const grade = gradeId ? vehicle.grades.find((candidate) => candidate.id === gradeId) : void 0;
	if (grade) return grade.msrp;
	return Math.min(vehicle.pricing.baseMsrp, ...vehicle.grades.map((candidate) => candidate.msrp));
}
/**
* Live build estimate: grade MSRP + sum of selected options' catalog `priceDelta`s.
*
* Derived from selections + trusted catalog on every call (including restore). Not persisted on
* `VehicleConfiguration` — keeping the schema selection-only keeps D1 / localConfigurationTransport
* offline round-trips simple and avoids accepting client-authored dollar figures.
*/
function estimateBuildTotal(baseMsrp, catalog, configuration) {
	if (!configuration) return baseMsrp;
	const selected = new Set(Object.values(configuration.selections).flat());
	const optionsTotal = catalog.reduce((total, option) => total + (selected.has(option.id) ? option.priceDelta ?? 0 : 0), 0);
	const hdriExtra = paintStudioPriceDelta(configuration.paintStudio ? {
		...configuration.paintStudio,
		mode: "oem"
	} : void 0);
	return baseMsrp + optionsTotal + hdriExtra;
}
/**
* Standard amortizing-loan monthly payment: M = P * r(1+r)^n / ((1+r)^n - 1), where `r` is the
* monthly interest rate and `n` the term in months. Falls back to a straight-line P/n split when
* `aprPercent` is 0, since the amortization formula divides by zero there.
*
* An estimate only — real financing terms depend on credit, lender, and incentives this catalog
* has no data for, same disclaimer this repo already applies to MSRP figures themselves.
*/
function estimateMonthlyPayment(principal, aprPercent, termMonths) {
	if (principal <= 0 || termMonths <= 0) return 0;
	if (aprPercent <= 0) return principal / termMonths;
	const monthlyRate = aprPercent / 100 / 12;
	const factor = Math.pow(1 + monthlyRate, termMonths);
	return principal * monthlyRate * factor / (factor - 1);
}
function readSharedConfigurationId(hash) {
	const id = new URLSearchParams(hash.replace(/^#/, "")).get("configuration");
	return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
}
function filterBuildOptions(catalog, query, selectedIds, selectedOnly) {
	const normalized = query.trim().toLocaleLowerCase();
	return catalog.filter((option) => {
		if (selectedOnly && !selectedIds.has(option.id)) return false;
		return !normalized || option.label.toLocaleLowerCase().includes(normalized);
	});
}
function calculateBuildProgress(configuration) {
	if (!configuration) return 0;
	const completed = [
		"paint",
		"wheels",
		"trim",
		"accessory"
	].filter((category) => (configuration.selections[category] ?? []).length > 0).length;
	return Math.round(completed / 4 * 100);
}
function createRandomSelections(catalog, random = Math.random) {
	const selections = {};
	for (const category of CATEGORY_APPLY_ORDER) {
		const options = catalog.filter((option) => option.category === category && option.id !== "paint-custom");
		if (options.length === 0) continue;
		const count = isMultiSelect(category) ? Math.min(options.length, random() > .65 ? 2 : 1) : 1;
		const shuffled = [...options];
		for (let index = shuffled.length - 1; index > 0; index -= 1) {
			const swapIndex = Math.floor(random() * (index + 1));
			[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
		}
		selections[category] = shuffled.slice(0, count).map((option) => option.id);
	}
	return selections;
}
function formatBuildSummary(vehicleLabel, baseMsrp, catalog, configuration) {
	const selected = new Set(Object.values(configuration.selections).flat());
	const lines = catalog.filter((option) => selected.has(option.id)).map((option) => `- ${option.label}${option.priceDelta ? ` (+$${option.priceDelta.toLocaleString()})` : ""}`);
	return [
		`${vehicleLabel} build`,
		`Configuration: ${configuration.configurationId}`,
		`Grade: ${configuration.gradeId}`,
		`Base MSRP: $${baseMsrp.toLocaleString()}`,
		`Estimated total: $${estimateBuildTotal(baseMsrp, catalog, configuration).toLocaleString()}`,
		"",
		"Selected options:",
		...lines.length ? lines : ["- No upgrades selected"]
	].join("\n");
}
var CAMERA_DECIMALS = 3;
function roundCoord(n) {
	const factor = 10 ** CAMERA_DECIMALS;
	return Math.round(n * factor) / factor;
}
function compactCamera(camera) {
	return {
		...camera.presetId ? { i: camera.presetId } : {},
		p: camera.position.map(roundCoord),
		t: camera.target.map(roundCoord)
	};
}
function expandCamera(raw) {
	return {
		...raw.i ? { presetId: raw.i } : {},
		position: raw.p,
		target: raw.t
	};
}
function compactPaintStudio(paintStudio) {
	const compact = { m: paintStudio.mode === "custom" ? "c" : "o" };
	if (paintStudio.hdriPresetId) compact.h = paintStudio.hdriPresetId;
	if (paintStudio.mode === "custom" && paintStudio.material) {
		compact.col = paintStudio.material.color;
		compact.me = paintStudio.material.metalness;
		compact.r = paintStudio.material.roughness;
		compact.cc = paintStudio.material.clearcoat;
		compact.cr = paintStudio.material.clearcoatRoughness;
	}
	return compact;
}
function expandPaintStudio(raw) {
	if (raw.m === "c") return {
		mode: "custom",
		...raw.h ? { hdriPresetId: raw.h } : {},
		material: {
			color: raw.col ?? "#1558d6",
			metalness: raw.me ?? .65,
			roughness: raw.r ?? .28,
			clearcoat: raw.cc ?? 1,
			clearcoatRoughness: raw.cr ?? .06
		}
	};
	return {
		mode: "oem",
		...raw.h ? { hdriPresetId: raw.h } : {}
	};
}
function toBase64Url(bytes) {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return (typeof btoa === "function" ? btoa(binary) : Buffer.from(bytes).toString("base64")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(encoded) {
	const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
	const padLength = (4 - padded.length % 4) % 4;
	const base64 = padded + "=".repeat(padLength);
	if (typeof atob === "function") {
		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
		return bytes;
	}
	return new Uint8Array(Buffer.from(base64, "base64"));
}
/** Encodes selections + camera into a URL-safe `c=` value (option ids only). */
function encodeBuildDeepLink(input) {
	const payload = {
		v: 1,
		g: input.gradeId,
		s: input.selections
	};
	if (input.cameraState) payload.c = compactCamera(input.cameraState);
	if (input.paintStudio) payload.p = compactPaintStudio(input.paintStudio);
	const json = JSON.stringify(payload);
	return toBase64Url(new TextEncoder().encode(json));
}
/**
* Decodes a `c=` value without catalog validation. Throws `ApiError` (422) on malformed payloads
* so callers can treat decode failures the same way as invalid saved-config bodies.
*/
function decodeBuildDeepLink(encoded) {
	if (typeof encoded !== "string" || encoded.trim() === "") throw invalidBody(`Deep-link payload must be a non-empty string.`);
	let json;
	try {
		json = new TextDecoder().decode(fromBase64Url(encoded.trim()));
	} catch {
		throw invalidBody(`Deep-link payload is not valid base64url.`);
	}
	let raw;
	try {
		raw = JSON.parse(json);
	} catch {
		throw invalidBody(`Deep-link payload is not valid JSON.`);
	}
	if (typeof raw !== "object" || raw === null || Array.isArray(raw)) throw invalidBody(`Deep-link payload must be a JSON object.`);
	const candidate = raw;
	if (candidate.v !== 1) throw invalidBody(`Unsupported deep-link schema version "${String(candidate.v)}" (expected 1).`);
	if (typeof candidate.g !== "string" || candidate.g.trim() === "") throw invalidBody(`Deep-link "g" (gradeId) must be a non-empty string.`);
	if (candidate.s === void 0) throw invalidBody(`Deep-link "s" (selections) is required.`);
	let cameraState;
	if (candidate.c !== void 0 && candidate.c !== null) {
		if (typeof candidate.c !== "object" || Array.isArray(candidate.c)) throw invalidBody(`Deep-link "c" (camera) must be an object when present.`);
		const cam = candidate.c;
		cameraState = expandCamera({
			i: typeof cam.i === "string" ? cam.i : void 0,
			p: cam.p,
			t: cam.t
		});
	}
	let paintStudio;
	if (candidate.p !== void 0 && candidate.p !== null) {
		if (typeof candidate.p !== "object" || Array.isArray(candidate.p)) throw invalidBody(`Deep-link "p" (paintStudio) must be an object when present.`);
		const rawPaint = candidate.p;
		if (rawPaint.m !== "o" && rawPaint.m !== "c") throw invalidBody(`Deep-link "p.m" must be "o" (oem) or "c" (custom).`);
		paintStudio = expandPaintStudio(rawPaint);
	}
	return {
		gradeId: candidate.g,
		selections: candidate.s,
		cameraState,
		paintStudio
	};
}
/**
* Decodes then validates against the same catalog rules as saved configurations.
* `vehicleId` / `modelYear` come from the route + vehicle record, not the URL.
*/
function validateBuildDeepLink(vehicleId, modelYear, encoded) {
	const decoded = decodeBuildDeepLink(encoded);
	validateVehicleIdentity(vehicleId, modelYear, decoded.gradeId);
	const selections = validateSelections(vehicleId, decoded.gradeId, decoded.selections);
	const cameraState = validateCameraState(decoded.cameraState);
	const paintStudio = validatePaintStudio(decoded.paintStudio, selections);
	return {
		gradeId: decoded.gradeId,
		selections,
		cameraState,
		paintStudio
	};
}
/** Reads the `c` query param from a search string (`?c=…` or bare `c=…`). */
function readBuildDeepLinkParam(search) {
	const normalized = search.startsWith("?") ? search.slice(1) : search;
	if (!normalized) return null;
	try {
		const value = new URLSearchParams(normalized).get("c");
		return value && value.trim() !== "" ? value : null;
	} catch {
		return null;
	}
}
/** Builds `/[slug]/?c=…` share URL from the current selections + camera. */
function createBuildDeepLinkUrl(origin, pathname, input) {
	const encoded = encodeBuildDeepLink(input);
	const path = pathname.endsWith("/") || pathname === "" ? pathname : `${pathname}/`;
	const url = new URL(path || "/", origin);
	url.searchParams.set("c", encoded);
	return url.toString();
}
/**
* Multi-vehicle garage (#17).
*
* Saved builds live in Worker/D1 or localConfigurationTransport; this module keeps a browser-side
* *index* of configuration ids the user pinned via "Save build", plus helpers to load / group /
* compare them. Mutable operations always go through `deleteConfiguration` / `updateConfiguration`
* so owner-token rules stay enforced on the transport boundary — the garage never bypasses them.
*/
var GARAGE_INDEX_KEY = "toyota-showroom:garage:v1";
function readIndex() {
	try {
		const raw = window.localStorage.getItem(GARAGE_INDEX_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function writeIndex(index) {
	try {
		window.localStorage.setItem(GARAGE_INDEX_KEY, JSON.stringify(index));
	} catch {}
}
/**
* Pin a configuration into the garage index. Idempotent for the same id — refreshes metadata and
* `pinnedAt` so a re-save bubbles it to the top without creating duplicates.
*/
function pinConfigurationToGarage(configuration, options = {}) {
	const index = readIndex();
	const pin = {
		configurationId: configuration.configurationId,
		vehicleId: configuration.vehicleId,
		modelYear: configuration.modelYear,
		model: configuration.model,
		gradeId: configuration.gradeId,
		pinnedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...options.label ? { label: options.label } : index[configuration.configurationId]?.label ? { label: index[configuration.configurationId].label } : {}
	};
	index[configuration.configurationId] = pin;
	writeIndex(index);
	return pin;
}
/**
* Three.js (core + the WebGPU renderer + loaders + gsap) is the single heaviest dependency this
* app ships — split into its own chunk so `/explore` and `/compare`, which never render a canvas,
* don't pay to parse it, and so this page's own chrome (header, rail, right panel) can paint and
* become interactive before that chunk finishes downloading.
*/
var VehicleCanvas = (0, import_react.lazy)(() => import("./VehicleCanvas-CN1xBFTN.mjs").then((module) => ({ default: module.VehicleCanvas })));
/** Used only when no `vehicleSlug` prop is given — the root route's implicit default vehicle. */
var DEFAULT_VEHICLE_SLUG = "4runner";
var DEFAULT_GRADE = "trd-pro";
function storageKeyFor(vehicleSlug) {
	return `toyota-showroom:configurationId:${vehicleSlug}`;
}
var CATEGORY_LABELS = {
	paint: "Paint",
	wheels: "Wheels",
	hood: "Hood",
	panel: "Body panels",
	decal: "Decals & graphics",
	trim: "Trim",
	accessory: "Accessories",
	interior: "Interior"
};
/** Categories rendered as circular colour swatches rather than text chips. */
var SWATCH_CATEGORIES = /* @__PURE__ */ new Set(["paint", "interior"]);
function BuilderApp({ vehicleSlug = DEFAULT_VEHICLE_SLUG }) {
	const [bootstrap, setBootstrap] = (0, import_react.useState)(null);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	/** True once VehicleCanvas has settled and attached a scene controller (not merely hydrated). */
	const [sceneReady, setSceneReady] = (0, import_react.useState)(false);
	const [preset, setPreset] = (0, import_react.useState)(null);
	const [lift, setLift] = (0, import_react.useState)(0);
	const [gradeChanging, setGradeChanging] = (0, import_react.useState)(false);
	const [terrain, setTerrain] = (0, import_react.useState)("Studio");
	const [environmentPreset, setEnvironmentPreset] = (0, import_react.useState)("Daytime");
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("paint");
	const [garageMessage, setGarageMessage] = (0, import_react.useState)("Changes save automatically");
	const [optionQuery, setOptionQuery] = (0, import_react.useState)("");
	const [selectedOnly, setSelectedOnly] = (0, import_react.useState)(false);
	const [budget, setBudget] = (0, import_react.useState)(65e3);
	const [downPayment, setDownPayment] = (0, import_react.useState)(0);
	const [apr, setApr] = (0, import_react.useState)(6.9);
	const [termMonths, setTermMonths] = (0, import_react.useState)(60);
	const [historyAvailability, setHistoryAvailability] = (0, import_react.useState)({
		canUndo: false,
		canRedo: false
	});
	const [tourOpen, setTourOpen] = (0, import_react.useState)(false);
	/** Cinematic camera tour (hero → wheels → interior), distinct from the onboarding tour card. */
	const [cinematicTourStatus, setCinematicTourStatus] = (0, import_react.useState)("idle");
	const [cinematicTourAction, setCinematicTourAction] = (0, import_react.useState)(null);
	const [mobilePanelOpen, setMobilePanelOpen] = (0, import_react.useState)(false);
	const controllerRef = (0, import_react.useRef)(null);
	const stageRef = (0, import_react.useRef)(null);
	const fullApplicableRef = (0, import_react.useRef)([]);
	const searchRef = (0, import_react.useRef)(null);
	const undoStack = (0, import_react.useRef)([]);
	const redoStack = (0, import_react.useRef)([]);
	/**
	* Main-asset download progress, 0..1, or null when the size is unknown.
	*
	* Distinct from "is the scene ready": since the render loop now starts before any geometry
	* exists, the showroom is already drawn and interactive while this counts up. It drives a thin
	* determinate bar over a live scene, not a spinner over a blank one — and stays null (bar hidden)
	* when the response has no Content-Length to measure against.
	*/
	const [modelProgress, setModelProgress] = (0, import_react.useState)(null);
	/** Mirrors `VehicleSceneController.selectedPartId` — a click/tap/keyboard selection in the 3D
	* viewport, surfaced here so the configurator chrome can react without touching Three.js. */
	const [selectedPart, setSelectedPart] = (0, import_react.useState)(void 0);
	const { configuration, catalog, status, error } = useConfiguration();
	const isLocalPersistence = usePersistenceMode() === "local";
	/**
	* Reconciles `selectedPart` against `controller.selectedPartId` on every configuration change.
	*
	* `VehicleSceneController.applyConfiguration` clears its own selection internally (so a stale
	* highlight can never survive a full reapply — see the controller's own doc comment), but it is
	* called from several places that have no way to reach this component's `setSelectedPart`
	* directly: `configurationStore.attachScene` (both call sites in this file), and
	* `ConfigurationStore.replaceSelections`/`setPaintStudio`/its undo-redo restore, all internal to
	* `lib/state/configurationStore.ts`. Rather than thread a callback through every one of those,
	* this asks the controller — the actual source of truth — after the fact: cheap, and correct
	* regardless of which path caused the change. A plain `selectOption` (the everyday "click a paint
	* chip" flow) applies a single option and leaves `controller.selectedPartId` untouched, so this is
	* a no-op then — the `prev.id === id` check below only clears or replaces when the controller's
	* own state has actually moved.
	*/
	(0, import_react.useEffect)(() => {
		const controller = controllerRef.current;
		const id = controller?.selectedPartId;
		setSelectedPart((prev) => {
			if (!id) return prev ? void 0 : prev;
			if (prev?.id === id) return prev;
			return controller?.getPart(id);
		});
	}, [configuration]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const vehicle = await getVehicle(vehicleSlug);
				const gradeId = vehicle.grades.some((grade) => grade.id === DEFAULT_GRADE) ? DEFAULT_GRADE : vehicle.grades[0]?.id ?? DEFAULT_GRADE;
				const [options, configuration] = await Promise.all([listVehicleOptions(vehicleSlug), resumeOrCreateConfiguration(vehicle, gradeId)]);
				if (cancelled) return;
				const forGrade = options.filter((option) => isOptionAvailableForGrade(option, configuration.gradeId));
				configurationStore.hydrate(configuration, forGrade);
				setBootstrap({
					vehicle,
					catalog: options,
					configuration
				});
				setPreset(presetForConfiguration(vehicle, configuration));
			} catch (err) {
				if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
			}
		})();
		return () => {
			cancelled = true;
			configurationStore.reset();
		};
	}, [vehicleSlug]);
	const handleSceneReady = (0, import_react.useCallback)((controller, applicable) => {
		controllerRef.current = controller;
		fullApplicableRef.current = applicable;
		setModelProgress(null);
		if (!bootstrap) return;
		setSceneReady(true);
		(async () => {
			await configurationStore.flush();
			const live = configurationStore.getSnapshot().configuration;
			const configuration = live && live.configurationId === bootstrap.configuration.configurationId ? live : bootstrap.configuration;
			const forGrade = applicable.filter((option) => isOptionAvailableForGrade(option, configuration.gradeId));
			await configurationStore.attachScene(controller, configuration, forGrade);
		})();
	}, [bootstrap]);
	const handleSceneError = (0, import_react.useCallback)((message) => setLoadError(message), []);
	const dispatchCinematicTour = (0, import_react.useCallback)((type) => {
		setCinematicTourAction({
			seq: Date.now(),
			type
		});
	}, []);
	const toggleCinematicTour = (0, import_react.useCallback)(() => {
		if (cinematicTourStatus === "playing") {
			dispatchCinematicTour("pause");
			return;
		}
		dispatchCinematicTour("play");
	}, [cinematicTourStatus, dispatchCinematicTour]);
	const handleTourStep = (0, import_react.useCallback)((next) => {
		setPreset(next);
		configurationStore.setCameraState({
			presetId: next.id,
			position: next.position,
			target: next.target
		});
	}, []);
	/**
	* Switches the active grade. `gradeId` is immutable on a persisted configuration (the server
	* only accepts it at creation — see `docs/INTEGRATION_GUIDE.md` §5), so this creates a new
	* configuration rather than patching the current one, the same way `reset()` does.
	*
	* Selections that are no longer compatible with the new grade (a TRD Pro-only paint, a
	* Limited-only interior) are dropped before the new configuration is created; `attachScene`'s
	* `applyConfiguration` then resets every writable slot on the live scene and replays only what
	* survived, so the 3D view can never show a selection the new grade doesn't actually offer.
	*/
	const changeGrade = async (gradeId) => {
		if (!bootstrap || !controllerRef.current || !configuration) return;
		if (gradeId === configuration.gradeId) return;
		setGradeChanging(true);
		try {
			const forGrade = fullApplicableRef.current.filter((option) => isOptionAvailableForGrade(option, gradeId));
			const forGradeIds = new Set(forGrade.map((option) => option.id));
			const carried = {};
			for (const category of CATEGORY_APPLY_ORDER) {
				const ids = (configuration.selections[category] ?? []).filter((id) => forGradeIds.has(id));
				if (ids.length > 0) carried[category] = ids;
			}
			const fresh = await createConfiguration({
				vehicleId: bootstrap.vehicle.slug,
				modelYear: bootstrap.vehicle.year,
				gradeId,
				selections: carried,
				cameraState: configuration.cameraState
			});
			rememberConfigurationId(vehicleSlug, fresh.configurationId);
			setBootstrap({
				...bootstrap,
				configuration: fresh
			});
			await configurationStore.attachScene(controllerRef.current, fresh, forGrade);
		} catch (err) {
			setLoadError(err instanceof Error ? err.message : String(err));
		} finally {
			setGradeChanging(false);
		}
	};
	(0, import_react.useEffect)(() => {
		const flush = () => void configurationStore.flush({ keepalive: true });
		window.addEventListener("pagehide", flush);
		return () => window.removeEventListener("pagehide", flush);
	}, []);
	const grouped = (0, import_react.useMemo)(() => CATEGORY_APPLY_ORDER.map((category) => ({
		category,
		options: catalog.filter((option) => option.category === category)
	})).filter((group) => group.options.length > 0), [catalog]);
	const selectedIds = (0, import_react.useMemo)(() => new Set(Object.values(configuration?.selections ?? {}).flat()), [configuration]);
	const visibleCatalog = (0, import_react.useMemo)(() => filterBuildOptions(catalog, optionQuery, selectedIds, selectedOnly), [
		catalog,
		optionQuery,
		selectedIds,
		selectedOnly
	]);
	const visibleGrouped = (0, import_react.useMemo)(() => grouped.map((group) => ({
		...group,
		options: group.options.filter((option) => visibleCatalog.includes(option))
	})), [grouped, visibleCatalog]);
	const selectedGrade = (0, import_react.useMemo)(() => bootstrap?.vehicle.grades.find((grade) => grade.id === configuration?.gradeId), [bootstrap, configuration]);
	const installedCount = (0, import_react.useMemo)(() => {
		if (!configuration) return 0;
		return (configuration.selections.accessory ?? []).length + (configuration.selections.decal ?? []).length;
	}, [configuration]);
	const baseMsrp = (0, import_react.useMemo)(() => resolveGradeMsrp(bootstrap?.vehicle, configuration?.gradeId), [bootstrap, configuration?.gradeId]);
	const estimatedTotal = (0, import_react.useMemo)(() => estimateBuildTotal(baseMsrp, catalog, configuration), [
		baseMsrp,
		catalog,
		configuration
	]);
	const buildProgress = calculateBuildProgress(configuration);
	const overBudget = estimatedTotal > budget;
	const effectiveDownPayment = Math.min(downPayment, estimatedTotal);
	const financedPrincipal = Math.max(0, estimatedTotal - effectiveDownPayment);
	const estimatedMonthlyPayment = (0, import_react.useMemo)(() => estimateMonthlyPayment(financedPrincipal, apr, termMonths), [
		financedPrincipal,
		apr,
		termMonths
	]);
	const rememberHistory = (0, import_react.useCallback)(() => {
		if (!configuration) return;
		undoStack.current.push(structuredClone(configuration.selections));
		redoStack.current = [];
		setHistoryAvailability({
			canUndo: true,
			canRedo: false
		});
	}, [configuration]);
	const restoreHistory = (0, import_react.useCallback)(async (direction) => {
		if (!configuration) return;
		const source = direction === "undo" ? undoStack.current : redoStack.current;
		const target = direction === "undo" ? redoStack.current : undoStack.current;
		const selections = source.pop();
		if (!selections) return;
		target.push(structuredClone(configuration.selections));
		setHistoryAvailability({
			canUndo: undoStack.current.length > 0,
			canRedo: redoStack.current.length > 0
		});
		await configurationStore.replaceSelections(selections);
	}, [configuration]);
	const surpriseMe = (0, import_react.useCallback)(async () => {
		if (!configuration) return;
		rememberHistory();
		await configurationStore.replaceSelections(createRandomSelections(catalog));
		setGarageMessage("A surprise build is ready");
	}, [
		catalog,
		configuration,
		rememberHistory
	]);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => {
			try {
				setTourOpen(!window.localStorage.getItem("toyota-showroom:tour-seen"));
			} catch {}
		}, 0);
		return () => window.clearTimeout(timer);
	}, []);
	const downloadSummary = (0, import_react.useCallback)(() => {
		if (!configuration || !bootstrap) return;
		const text = formatBuildSummary(`${bootstrap.vehicle.year} Toyota ${bootstrap.vehicle.model}`, resolveGradeMsrp(bootstrap.vehicle, configuration.gradeId), catalog, configuration);
		const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `toyota-${bootstrap.vehicle.slug}-${configuration.configurationId}.txt`;
		anchor.click();
		URL.revokeObjectURL(url);
	}, [
		bootstrap,
		catalog,
		configuration
	]);
	(0, import_react.useEffect)(() => {
		const onKeyDown = (event) => {
			const editing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
			if (event.key === "/" && !editing) {
				event.preventDefault();
				searchRef.current?.focus();
			} else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
				event.preventDefault();
				restoreHistory(event.shiftKey ? "redo" : "undo");
			} else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
				event.preventDefault();
				restoreHistory("redo");
			} else if (event.key === "Escape") setMobilePanelOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [restoreHistory]);
	const reset = async () => {
		if (!bootstrap) return;
		const fresh = await createConfiguration({
			vehicleId: bootstrap.vehicle.slug,
			modelYear: bootstrap.vehicle.year,
			gradeId: bootstrap.configuration.gradeId
		});
		rememberConfigurationId(vehicleSlug, fresh.configurationId);
		if (controllerRef.current) await configurationStore.attachScene(controllerRef.current, fresh, catalog);
		setLift(2);
		setEnvironmentPreset("Daytime");
		setPreset(bootstrap.vehicle.threeDConfig.cameraPresets[0] ?? null);
		undoStack.current = [];
		redoStack.current = [];
		setHistoryAvailability({
			canUndo: false,
			canRedo: false
		});
	};
	const saveToGarage = async () => {
		await configurationStore.flush();
		const current = configurationStore.getSnapshot().configuration;
		if (current) pinConfigurationToGarage(current);
		setGarageMessage(isLocalPersistence ? "Build pinned to garage (this browser only — demo / offline)" : "Build saved to your garage");
	};
	const share = async () => {
		if (!configuration) return;
		const url = createBuildDeepLinkUrl(window.location.origin, window.location.pathname, {
			gradeId: configuration.gradeId,
			selections: configuration.selections,
			cameraState: configuration.cameraState,
			paintStudio: configuration.paintStudio
		});
		try {
			await navigator.clipboard.writeText(url);
			setGarageMessage(isLocalPersistence ? "Share link copied — deep link restores this build without cloud save" : "Share link copied to clipboard");
		} catch {
			setGarageMessage(isLocalPersistence ? "Share link ready to copy — deep link works without Worker/D1" : "Share link ready to copy");
			try {
				window.prompt("Copy this build link", url);
			} catch {}
		}
	};
	const toggleFullscreen = async () => {
		if (document.fullscreenElement) await document.exitFullscreen();
		else await stageRef.current?.requestFullscreen();
	};
	if (loadError && !bootstrap) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "builder-shell builder-status",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Couldn’t load the builder: ", loadError] })
	});
	if (!bootstrap || !preset) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "builder-shell builder-status",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Loading ",
			vehicleSlug,
			"…"
		] })
	});
	const { vehicle } = bootstrap;
	const cameraPresets = vehicle.threeDConfig.cameraPresets;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "builder-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { size: 24 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: vehicle.model.toUpperCase() }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WEBGPU BUILDER" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "active",
							children: "Build"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => window.location.assign(pageUrl("explore")),
							children: "Explore"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => window.location.assign(pageUrl("garage")),
							children: "Garage"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ghost icon-action",
								title: "Undo (Ctrl/⌘ Z)",
								disabled: !historyAvailability.canUndo,
								onClick: () => void restoreHistory("undo"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ghost icon-action",
								title: "Redo (Ctrl/⌘ Shift Z)",
								disabled: !historyAvailability.canRedo,
								onClick: () => void restoreHistory("redo"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo2, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "ghost",
								onClick: () => void reset(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 16 }), " Reset"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveIndicator, {
								status,
								local: isLocalPersistence
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary",
								onClick: () => void share(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { size: 16 }), " Share"]
							})
						]
					})
				]
			}),
			loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "config-error",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 15 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loadError }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setLoadError(null),
						children: "Dismiss"
					})
				]
			}) : null,
			isLocalPersistence ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "persistence-banner",
				role: "status",
				"data-testid": "persistence-mode-banner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, {
					size: 15,
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Demo / offline saves" }), " — builds stay in this browser. Share uses a deep link so others can open your build without Worker/D1. Production persistence is Cloudflare Worker + D1; see the deployment runbook to promote."] })]
			}) : null,
			tourOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tour-card",
				role: "dialog",
				"aria-label": "Builder tour",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "tour-close",
						"aria-label": "Close tour",
						onClick: () => {
							setTourOpen(false);
							try {
								window.localStorage.setItem("toyota-showroom:tour-seen", "1");
							} catch {}
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 15 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Build your 4Runner" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Choose a system, search options, watch your budget, then save or share. Press ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "/" }),
						" to search and ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "Ctrl Z" }),
						" to undo."
					] })
				]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "config-error",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 15 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => configurationStore.clearError(),
						children: "Dismiss"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "workspace",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "left-rail",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "vehicle-title",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [vehicle.year, " TOYOTA"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: vehicle.model }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										selectedGrade ? `${selectedGrade.name} · ` : "",
										"Estimated $",
										estimatedTotal.toLocaleString()
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "summary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Installed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: installedCount })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lift" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [lift, "\""] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Revision" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: configuration?.revision ?? "—" })] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "build-progress",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Build progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [buildProgress, "%"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { style: { width: `${buildProgress}%` } }) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "section-label",
								children: "Grade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grade-row",
								children: vehicle.grades.map((grade) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: grade.id === configuration?.gradeId ? "grade-item active" : "grade-item",
									disabled: gradeChanging || !configuration || !sceneReady,
									onClick: () => void changeGrade(grade.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: grade.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["$", grade.msrp.toLocaleString()] })]
								}, grade.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "section-label",
								children: "Systems"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `rail-item ${activeCategory === "paint" ? "active" : ""}`,
								onClick: () => setActiveCategory("paint"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaintBucket, { size: 18 }), " Exterior"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `rail-item ${activeCategory === "wheels" ? "active" : ""}`,
								onClick: () => setActiveCategory("wheels"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleGauge, { size: 18 }), " Wheels & Tires"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `rail-item ${activeCategory === "trim" ? "active" : ""}`,
								onClick: () => setActiveCategory("trim"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 18 }), " Suspension"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `rail-item ${activeCategory === "accessory" ? "active" : ""}`,
								onClick: () => setActiveCategory("accessory"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { size: 18 }), " Lighting"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `rail-item ${activeCategory === "panel" ? "active" : ""}`,
								onClick: () => setActiveCategory("panel"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cog, { size: 18 }), " Performance"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `rail-item ${activeCategory === "decal" ? "active" : ""}`,
								onClick: () => setActiveCategory("decal"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { size: 18 }), " Accessories"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: `rail-item ${activeCategory === "interior" ? "active" : ""}`,
								onClick: () => setActiveCategory("interior"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Armchair, { size: 18 }), " Interior"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "garage-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 15 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Garage" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: garageMessage }),
									isLocalPersistence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "garage-local-hint",
										children: "Local demo — not synced to Worker/D1"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => void saveToGarage(),
										children: "Save build"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "garage-open",
										onClick: () => window.location.assign(pageUrl("garage")),
										children: "Open garage"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "quick-tools",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => void surpriseMe(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { size: 14 }), " Surprise me"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: downloadSummary,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 14 }), " Download specs"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => window.print(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { size: 14 }), " Print build"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tech-stack",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Next.js" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "React" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Three.js" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WebGPU" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GSAP" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Drizzle/D1" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "stage",
						ref: stageRef,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "stage-toolbar",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "camera-group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { size: 16 }),
										cameraPresets.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: preset.id === item.id ? "selected" : "",
											onClick: () => {
												if (cinematicTourStatus !== "idle") dispatchCinematicTour("cancel");
												setPreset(item);
												configurationStore.setCameraState({
													presetId: item.id,
													position: item.position,
													target: item.target
												});
											},
											children: item.label
										}, item.id)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "cinematic-tour-toggle",
											className: cinematicTourStatus !== "idle" ? "selected" : "",
											"aria-pressed": cinematicTourStatus === "playing",
											title: cinematicTourStatus === "playing" ? "Pause cinematic tour" : "Play cinematic tour",
											onClick: toggleCinematicTour,
											children: [cinematicTourStatus === "playing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cinematicTourStatus === "playing" ? "Pause" : cinematicTourStatus === "paused" ? "Resume" : "Tour" })]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "viewport-actions",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											title: "Zoom",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { size: 17 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											title: "Settings",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { size: 17 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											title: "Fullscreen",
											onClick: () => void toggleFullscreen(),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { size: 17 })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "mobile-config-trigger",
								"aria-controls": "configuration-panel",
								"aria-expanded": mobilePanelOpen,
								onClick: () => {
									setTourOpen(false);
									setMobilePanelOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { size: 16 }), " Customize"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasErrorBoundary, {
								fallbackImage: vehicle.media.hero,
								onError: (error) => setLoadError(error.message),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
									fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "vehicle-canvas vehicle-canvas-loading",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
											size: 28,
											className: "spin"
										})
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleCanvas, {
										threeDConfig: vehicle.threeDConfig,
										slug: vehicle.slug,
										catalog: bootstrap.catalog,
										cameraPreset: preset,
										lift,
										terrain,
										environmentPreset,
										hdriPresetId: configuration?.paintStudio?.hdriPresetId,
										onReady: handleSceneReady,
										onError: handleSceneError,
										onProgress: setModelProgress,
										tourAction: cinematicTourAction,
										onTourStatusChange: setCinematicTourStatus,
										onTourStep: handleTourStep,
										onPartSelect: setSelectedPart
									})
								})
							}),
							selectedPart && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "selected-part-badge",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedPart.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Deselect ${selectedPart.label}`,
									onClick: () => {
										controllerRef.current?.clearSelection();
										setSelectedPart(void 0);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 12 })
								})]
							}),
							modelProgress !== null && modelProgress < 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "model-progress",
								role: "progressbar",
								"aria-label": "Loading vehicle model",
								"aria-valuemin": 0,
								"aria-valuemax": 100,
								"aria-valuenow": Math.round(modelProgress * 100),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "model-progress-fill",
									style: { transform: `scaleX(${modelProgress})` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "gpu-status",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " WebGPU preferred"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Assembled 4Runner asset · WebGL fallback ready" })]
							})
						]
					}),
					mobilePanelOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mobile-panel-backdrop",
						"aria-label": "Close configuration panel",
						onClick: () => setMobilePanelOpen(false)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						id: "configuration-panel",
						className: `right-panel ${mobilePanelOpen ? "mobile-open" : ""}`,
						"aria-label": "Vehicle configuration",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel-title",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Configuration" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: CATEGORY_LABELS[activeCategory] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "panel-actions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mountain, { size: 22 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "panel-close",
										"aria-label": "Close configuration panel",
										onClick: () => setMobilePanelOpen(false),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "option-tools",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: searchRef,
									value: optionQuery,
									onChange: (event) => setOptionQuery(event.target.value),
									placeholder: "Search options…"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: selectedOnly ? "active" : "",
									"aria-pressed": selectedOnly,
									onClick: () => setSelectedOnly((value) => !value),
									children: "Selected only"
								})]
							}),
							catalog.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "panel-empty",
								children: "Preparing customization options…"
							}) : null,
							activeCategory === "paint" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaintStudioPanel, {
								paintStudio: configuration?.paintStudio,
								oemPaintOptions: catalog.filter((option) => option.category === "paint" && option.id !== "paint-custom"),
								selectedPaintId: (configuration?.selections.paint ?? [])[0],
								catalog,
								onBeforeChange: rememberHistory
							}) : null,
							visibleGrouped.filter(({ category }) => category === activeCategory).map(({ category, options }) => {
								const visibleOptions = category === "paint" ? options.filter((option) => option.id !== PAINT_CUSTOM_OPTION_ID) : options;
								const paintMode = configuration?.paintStudio?.mode ?? "oem";
								if (category === "paint" && paintMode === "custom") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "control-section",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: CATEGORY_LABELS[category] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "panel-empty",
										children: "Custom studio controls the body finish. Switch to OEM to pick a catalog colour."
									})]
								}, category);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "control-section",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: CATEGORY_LABELS[category] }),
										visibleOptions.some(isProceduralPreview) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "panel-preview-note",
											"data-testid": "procedural-preview-note",
											children: "Preview geometry — procedural stand-ins until authored catalog meshes ship. Selections still save by option id."
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: SWATCH_CATEGORIES.has(category) ? "paint-row" : "chip-row",
											"data-testid": category === "paint" ? "oem-paint-swatches" : void 0,
											children: visibleOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomizationButton, {
												option,
												variant: SWATCH_CATEGORIES.has(category) ? "swatch" : "chip",
												onBeforeSelect: rememberHistory
											}, option.id))
										}),
										visibleOptions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "panel-empty",
											children: "No matching options in this system."
										}) : null
									]
								}, category);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "control-section",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "Lift height" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "segmented",
									children: [
										0,
										1,
										2,
										3
									].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: lift === value ? "active" : "",
										onClick: () => setLift(value),
										children: [value, "\""]
									}, value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "control-section scene-controls",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { size: 14 }), " Terrain preview"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "segmented",
										children: [
											"Studio",
											"Trail",
											"Night"
										].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: terrain === item ? "active" : "",
											onClick: () => setTerrain(item),
											children: item
										}, item))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { size: 14 }), " Environment"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "segmented environment-presets",
										children: [
											"Daytime",
											"Sunset",
											"Night"
										].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: environmentPreset === item ? "active" : "",
											"aria-pressed": environmentPreset === item,
											onClick: () => setEnvironmentPreset(item),
											children: item
										}, item))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "comparison-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Build comparison" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Base MSRP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["$", baseMsrp.toLocaleString()] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Configured upgrades" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["+$", (estimatedTotal - baseMsrp).toLocaleString()] })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "total",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
											"data-testid": "estimated-total",
											children: ["$", estimatedTotal.toLocaleString()]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: `budget-card ${overBudget ? "over" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "build-budget",
										children: "Target budget"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "$" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "build-budget",
										type: "number",
										min: baseMsrp,
										step: "500",
										value: budget,
										onChange: (event) => setBudget(Number(event.target.value))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: overBudget ? `$${(estimatedTotal - budget).toLocaleString()} over target` : `$${(budget - estimatedTotal).toLocaleString()} remaining` })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "financing-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Estimated financing" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "financing-inputs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "financing-down",
												children: ["Down payment", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "$" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "financing-down",
													type: "number",
													min: 0,
													max: estimatedTotal,
													step: "500",
													value: effectiveDownPayment,
													onChange: (event) => setDownPayment(Math.min(estimatedTotal, Math.max(0, Number(event.target.value))))
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "financing-apr",
												children: ["APR", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "financing-apr",
													type: "number",
													min: 0,
													max: 30,
													step: "0.1",
													value: apr,
													onChange: (event) => setApr(Math.max(0, Number(event.target.value)))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "%" })] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "financing-term",
												children: ["Term", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													id: "financing-term",
													value: termMonths,
													onChange: (event) => setTermMonths(Number(event.target.value)),
													children: [
														36,
														48,
														60,
														72
													].map((months) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: months,
														children: [months, " mo"]
													}, months))
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount financed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
										"data-testid": "amount-financed",
										children: ["$", financedPrincipal.toLocaleString()]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "total",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Est. monthly payment" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
											"data-testid": "estimated-monthly-payment",
											children: [
												"$",
												estimatedMonthlyPayment.toLocaleString(void 0, { maximumFractionDigits: 0 }),
												"/mo"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "financing-disclaimer",
										children: "Estimate only — not a real financing offer. Actual rate and terms depend on credit and lender. Payment tracks the live build total derived from your selections."
									})
								]
							})
						]
					})
				]
			})
		]
	});
}
function SaveIndicator({ status, local }) {
	if (status === "saving") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "ghost",
		disabled: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			size: 16,
			className: "spin"
		}), " Saving"]
	});
	if (status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "ghost",
		disabled: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 16 }), " Not saved"]
	});
	if (status === "saved") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "ghost",
		disabled: true,
		title: local ? "Saved in this browser (demo / offline)" : "Saved to Worker/D1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }),
			" ",
			local ? "Saved locally" : "Saved"
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "ghost",
		disabled: true,
		title: local ? "Demo / offline — localStorage only" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }),
			" ",
			local ? "Local only" : "Up to date"
		]
	});
}
/**
* Resolves the camera a resumed configuration should open with.
*
* A saved `cameraState` is honoured over the vehicle's first preset, otherwise choosing and saving
* a camera angle would appear to work until the next refresh. A stored `presetId` is preferred so
* the matching toolbar button reads as selected; a configuration saved from a free orbit falls back
* to its raw position and target.
*/
function presetForConfiguration(vehicle, configuration) {
	const presets = vehicle.threeDConfig.cameraPresets;
	const saved = configuration.cameraState;
	if (!saved) return presets[0] ?? null;
	const matching = presets.find((preset) => preset.id === saved.presetId);
	if (matching) return matching;
	return {
		id: saved.presetId ?? "saved",
		label: "Saved",
		position: saved.position,
		target: saved.target
	};
}
function rememberConfigurationId(vehicleSlug, configurationId) {
	try {
		window.localStorage.setItem(storageKeyFor(vehicleSlug), configurationId);
	} catch {}
}
/**
* Resumes the configuration this browser last worked on for this vehicle, or creates a fresh one.
*
* Only the *id* is kept client-side; the configuration itself is re-fetched, so the server stays
* authoritative and a build edited elsewhere shows its latest state here. A stored id that no
* longer resolves (deleted, or a wiped dev database) falls through to creating a new record rather
* than leaving the builder stuck on an error. The vehicle-id check also guards against a corrupted
* or hand-edited storage value pointing at the wrong vehicle.
*/
async function resumeOrCreateConfiguration(vehicle, gradeId) {
	const deepLink = tryRestoreFromDeepLink(vehicle);
	if (deepLink) {
		const created = await createConfiguration({
			vehicleId: vehicle.slug,
			modelYear: vehicle.year,
			gradeId: deepLink.gradeId,
			selections: deepLink.selections,
			cameraState: deepLink.cameraState,
			paintStudio: deepLink.paintStudio
		});
		rememberConfigurationId(vehicle.slug, created.configurationId);
		return created;
	}
	const storedId = safeReadStoredId(vehicle.slug);
	if (storedId) try {
		const existing = await getConfiguration(storedId);
		if (existing.vehicleId === vehicle.slug) return existing;
	} catch {}
	const created = await createConfiguration({
		vehicleId: vehicle.slug,
		modelYear: vehicle.year,
		gradeId
	});
	rememberConfigurationId(vehicle.slug, created.configurationId);
	return created;
}
/**
* Decodes and catalog-validates `?c=…`. Returns null on absence or any validation failure so the
* builder can fall through to the normal resume/create path rather than blocking on a bad link.
*/
function tryRestoreFromDeepLink(vehicle) {
	try {
		const encoded = readBuildDeepLinkParam(window.location.search);
		if (!encoded) return null;
		return validateBuildDeepLink(vehicle.slug, vehicle.year, encoded);
	} catch {
		return null;
	}
}
function safeReadStoredId(vehicleSlug) {
	try {
		return readSharedConfigurationId(window.location.hash) ?? window.localStorage.getItem(storageKeyFor(vehicleSlug));
	} catch {
		return null;
	}
}
function ConfigurePage() {
	const { slug } = Route$2.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuilderApp, { vehicleSlug: slug })
	});
}
//#endregion
export { ConfigurePage as component };
