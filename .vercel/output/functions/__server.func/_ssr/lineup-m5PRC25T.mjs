import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lineup-m5PRC25T.js
var lineup_m5PRC25T_exports = /* @__PURE__ */ __exportAll({
	a: () => filterLineup,
	c: () => getOptionById,
	d: () => options_exports,
	f: () => VEHICLE_SCHEMA_VERSION,
	h: () => getVehicleBySlug,
	i: () => featuredLineup,
	l: () => getOptionsForVehicle,
	m: () => VEHICLES,
	n: () => LINEUP_TABS,
	o: () => getLineupBySlug,
	p: () => toVehicleSummary,
	r: () => electrifiedLabel,
	s: () => lineupConfigure,
	t: () => LINEUP,
	u: () => isOptionAvailableForGrade
});
/** Single source of truth for the vehicle catalog. Add new models here only. */
var VEHICLES = [
	{
		slug: "4runner",
		year: 2024,
		model: "4Runner",
		bodyStyle: "suv",
		categories: [
			"suv",
			"off-road",
			"truck-based"
		],
		availability: "in_production",
		updatedAt: "2024-11-01T00:00:00.000Z",
		pricing: {
			baseMsrp: 40455,
			destinationFee: 1450,
			currency: "USD"
		},
		powertrains: { "v6-4.0l": {
			id: "v6-4.0l",
			type: "gas",
			engine: "4.0L V6",
			horsepowerHp: 270,
			torqueLbFt: 278,
			transmission: "5-speed automatic",
			drivetrain: "4wd",
			fuelEconomy: {
				unit: "mpg",
				city: 16,
				highway: 19,
				combined: 17
			},
			towingCapacityLbs: 5e3,
			payloadCapacityLbs: 1200
		} },
		grades: [
			{
				id: "sr5",
				name: "SR5",
				msrp: 40455,
				powertrainId: "v6-4.0l",
				seating: 5,
				availableExteriorColorCodes: [
					"218",
					"070",
					"1J9",
					"1G3",
					"3U5"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"Multi-Terrain Select",
					"8-in touchscreen",
					"LED headlights"
				],
				packages: []
			},
			{
				id: "trd-off-road",
				name: "TRD Off-Road",
				msrp: 43955,
				powertrainId: "v6-4.0l",
				seating: 5,
				availableExteriorColorCodes: [
					"218",
					"070",
					"1J9",
					"1G3",
					"3U5"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"Crawl Control",
					"Locking rear differential",
					"TRD-tuned suspension"
				],
				packages: [{
					id: "premium-pkg",
					name: "Premium Package",
					price: 3520,
					includes: ["Leather-trimmed seats", "Sunroof"]
				}]
			},
			{
				id: "trd-pro",
				name: "TRD Pro",
				msrp: 53900,
				powertrainId: "v6-4.0l",
				seating: 5,
				availableExteriorColorCodes: [
					"1J9",
					"218",
					"0R2"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"FOX internal-bypass shocks",
					"TRD front skid plate",
					"Roof rack"
				],
				packages: []
			},
			{
				id: "limited",
				name: "Limited",
				msrp: 50260,
				powertrainId: "v6-4.0l",
				seating: 5,
				availableExteriorColorCodes: [
					"218",
					"070",
					"1G3",
					"3U5"
				],
				availableInteriorColorCodes: ["fa20-black", "lf10-red"],
				standardFeatures: [
					"JBL premium audio",
					"Heated/ventilated front seats",
					"Adaptive variable suspension"
				],
				packages: []
			}
		],
		specs: [
			{
				category: "dimensions",
				key: "length_in",
				label: "Overall length",
				value: 191.3,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "width_in",
				label: "Overall width",
				value: 75.8,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "height_in",
				label: "Overall height",
				value: 71.5,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "cargo_volume_cu_ft",
				label: "Cargo volume behind 2nd row",
				value: 46.3,
				unit: "cu ft"
			},
			{
				category: "capability",
				key: "ground_clearance_in",
				label: "Ground clearance",
				value: 9.6,
				unit: "in"
			},
			{
				category: "capability",
				key: "approach_angle_deg",
				label: "Approach angle",
				value: 33,
				unit: "deg"
			},
			{
				category: "capability",
				key: "departure_angle_deg",
				label: "Departure angle",
				value: 26,
				unit: "deg"
			},
			{
				category: "performance",
				key: "zero_to_60_sec",
				label: "0–60 mph",
				value: 6.9,
				unit: "sec"
			},
			{
				category: "safety",
				key: "toyota_safety_sense",
				label: "Toyota Safety Sense",
				value: "TSS 2.5"
			},
			{
				category: "safety",
				key: "blind_spot_monitor",
				label: "Blind Spot Monitor",
				value: true
			},
			{
				category: "technology",
				key: "touchscreen_in",
				label: "Touchscreen display",
				value: 8,
				unit: "in"
			},
			{
				category: "technology",
				key: "wireless_carplay",
				label: "Wireless Apple CarPlay",
				value: true
			},
			{
				category: "comfort",
				key: "heated_seats",
				label: "Heated front seats",
				value: true
			},
			{
				category: "warranty",
				key: "basic_warranty_years_miles",
				label: "Basic warranty",
				value: "3 yr / 36,000 mi"
			},
			{
				category: "warranty",
				key: "powertrain_warranty_years_miles",
				label: "Powertrain warranty",
				value: "5 yr / 60,000 mi"
			}
		],
		exteriorColors: [
			{
				code: "218",
				name: "Blueprint",
				hex: "#1558d6",
				availableGradeIds: [
					"sr5",
					"trd-off-road",
					"trd-pro",
					"limited"
				]
			},
			{
				code: "070",
				name: "Midnight Black Metallic",
				hex: "#101215",
				availableGradeIds: [
					"sr5",
					"trd-off-road",
					"limited"
				]
			},
			{
				code: "1J9",
				name: "Ice Cap",
				hex: "#d8dde2",
				availableGradeIds: [
					"sr5",
					"trd-off-road",
					"trd-pro"
				]
			},
			{
				code: "1G3",
				name: "Underground",
				hex: "#4f545a",
				availableGradeIds: [
					"sr5",
					"trd-off-road",
					"limited"
				],
				isPremium: true
			},
			{
				code: "3U5",
				name: "Barcelona Red Metallic",
				hex: "#9d1d20",
				availableGradeIds: [
					"sr5",
					"trd-off-road",
					"limited"
				]
			},
			{
				code: "0R2",
				name: "Solar Octane",
				hex: "#ff6a1a",
				availableGradeIds: ["trd-pro"],
				isPremium: true
			}
		],
		interiorColors: [{
			code: "fa20-black",
			name: "Black",
			hex: "#1a1a1a",
			material: "softex",
			availableGradeIds: [
				"sr5",
				"trd-off-road",
				"trd-pro",
				"limited"
			]
		}, {
			code: "lf10-red",
			name: "Red Leather",
			hex: "#4a1113",
			material: "leather",
			availableGradeIds: ["limited"]
		}],
		media: {
			hero: {
				url: "/images/modsnation_7416_final_hero_tweaked.png",
				alt: "2024 Toyota 4Runner TRD Pro, front three-quarter view"
			},
			gallery: [{
				url: "/images/modsnation_7416_final_hero_tweaked.png",
				alt: "2024 Toyota 4Runner TRD Pro, front three-quarter view"
			}, {
				url: "/images/lineup/4runner.webp",
				alt: "2024 Toyota 4Runner, studio three-quarter rear view"
			}],
			thumbnails: [{
				url: "/images/lineup/4runner.webp",
				alt: "2024 Toyota 4Runner thumbnail"
			}],
			videos: [],
			environmentMaps: []
		},
		threeDConfig: {
			hasModel: true,
			modelUrl: "/models/modsnation_7416_assets_assembled.glb",
			cameraPresets: [
				{
					id: "hero",
					label: "Hero",
					position: [
						7.5,
						4,
						8.5
					],
					target: [
						0,
						1.1,
						0
					]
				},
				{
					id: "wheels",
					label: "Wheels",
					position: [
						4.5,
						1.05,
						4.8
					],
					target: [
						-.9,
						.55,
						1.3
					]
				},
				{
					id: "interior",
					label: "Interior",
					position: [
						5.2,
						2.35,
						1.1
					],
					target: [
						0,
						1.35,
						0
					]
				},
				{
					id: "front",
					label: "Front",
					position: [
						0,
						2.2,
						-10
					],
					target: [
						0,
						1,
						0
					]
				},
				{
					id: "side",
					label: "Side",
					position: [
						10,
						2.2,
						0
					],
					target: [
						0,
						1,
						0
					]
				},
				{
					id: "rear",
					label: "Rear",
					position: [
						0,
						2.2,
						10
					],
					target: [
						0,
						1,
						0
					]
				}
			],
			paintableMaterialNames: ["body.carmain"],
			wheelMountNames: [
				"MOUNT_WHEEL_FRONT_LEFT",
				"MOUNT_WHEEL_FRONT_RIGHT",
				"MOUNT_WHEEL_REAR_LEFT",
				"MOUNT_WHEEL_REAR_RIGHT"
			],
			wheelAndTireAssets: {
				wheelUrl: "/models/4runner-2024/ModsNation_7416_wheel_a.glb",
				tireUrl: "/models/4runner-2024/ModsNation_7416_tire.glb",
				scale: 1.45,
				wheelNodeNames: [
					"PLACED_WEISU_front_left",
					"PLACED_WEISU_front_right",
					"PLACED_WEISU_rear_left",
					"PLACED_WEISU_rear_right"
				],
				tireNodeNames: [
					"PLACED_KO3_front_left",
					"PLACED_KO3_front_right",
					"PLACED_KO3_rear_left",
					"PLACED_KO3_rear_right"
				]
			},
			interiorMaterialNames: ["interior.seat"],
			groundingNodeNames: [
				"BODY",
				"PLACED_KO3_front_left",
				"PLACED_KO3_front_right",
				"PLACED_KO3_rear_left",
				"PLACED_KO3_rear_right"
			]
		}
	},
	{
		slug: "tacoma",
		year: 2024,
		model: "Tacoma",
		bodyStyle: "truck",
		categories: [
			"truck",
			"off-road",
			"midsize"
		],
		availability: "in_production",
		updatedAt: "2024-11-01T00:00:00.000Z",
		pricing: {
			baseMsrp: 31500,
			destinationFee: 1450,
			currency: "USD"
		},
		powertrains: {
			"i4-2.4l-turbo": {
				id: "i4-2.4l-turbo",
				type: "gas",
				engine: "2.4L Turbo I4",
				horsepowerHp: 228,
				torqueLbFt: 243,
				transmission: "8-speed automatic",
				drivetrain: "4wd",
				fuelEconomy: {
					unit: "mpg",
					city: 20,
					highway: 24,
					combined: 22
				},
				towingCapacityLbs: 6500,
				payloadCapacityLbs: 1709
			},
			"i-force-max-hybrid": {
				id: "i-force-max-hybrid",
				type: "hybrid",
				engine: "2.4L Turbo I4 + electric motor (i-FORCE MAX)",
				horsepowerHp: 326,
				torqueLbFt: 465,
				transmission: "8-speed automatic",
				drivetrain: "4wd",
				fuelEconomy: {
					unit: "mpg",
					city: 22,
					highway: 24,
					combined: 23
				},
				towingCapacityLbs: 6e3,
				payloadCapacityLbs: 1560
			}
		},
		grades: [
			{
				id: "sr",
				name: "SR",
				msrp: 31500,
				powertrainId: "i4-2.4l-turbo",
				seating: 5,
				availableExteriorColorCodes: [
					"040",
					"218",
					"1J9"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: ["8-in touchscreen", "Toyota Safety Sense 3.0"],
				packages: []
			},
			{
				id: "trd-off-road",
				name: "TRD Off-Road",
				msrp: 38560,
				powertrainId: "i4-2.4l-turbo",
				seating: 5,
				availableExteriorColorCodes: [
					"040",
					"218",
					"1J9",
					"3U5"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"Crawl Control",
					"Multi-Terrain Select",
					"TRD-tuned suspension"
				],
				packages: []
			},
			{
				id: "trd-pro",
				name: "TRD Pro",
				msrp: 55765,
				powertrainId: "i-force-max-hybrid",
				seating: 5,
				availableExteriorColorCodes: [
					"1J9",
					"218",
					"0R2"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"FOX live valve shocks",
					"TRD front skid plate",
					"i-FORCE MAX hybrid powertrain"
				],
				packages: []
			}
		],
		specs: [
			{
				category: "dimensions",
				key: "length_in",
				label: "Overall length",
				value: 212.7,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "bed_length_in",
				label: "Bed length",
				value: 60.5,
				unit: "in"
			},
			{
				category: "capability",
				key: "ground_clearance_in",
				label: "Ground clearance",
				value: 9.7,
				unit: "in"
			},
			{
				category: "capability",
				key: "max_towing_lbs",
				label: "Max towing",
				value: 6500,
				unit: "lbs"
			},
			{
				category: "performance",
				key: "zero_to_60_sec",
				label: "0–60 mph",
				value: 6.3,
				unit: "sec"
			},
			{
				category: "safety",
				key: "toyota_safety_sense",
				label: "Toyota Safety Sense",
				value: "TSS 3.0"
			},
			{
				category: "technology",
				key: "touchscreen_in",
				label: "Touchscreen display",
				value: 8,
				unit: "in"
			},
			{
				category: "comfort",
				key: "heated_seats",
				label: "Heated front seats",
				value: true
			},
			{
				category: "warranty",
				key: "basic_warranty_years_miles",
				label: "Basic warranty",
				value: "3 yr / 36,000 mi"
			}
		],
		exteriorColors: [
			{
				code: "040",
				name: "Super White",
				hex: "#f2f2ef",
				availableGradeIds: ["sr", "trd-off-road"]
			},
			{
				code: "218",
				name: "Blueprint",
				hex: "#1558d6",
				availableGradeIds: [
					"sr",
					"trd-off-road",
					"trd-pro"
				]
			},
			{
				code: "1J9",
				name: "Ice Cap",
				hex: "#d8dde2",
				availableGradeIds: [
					"sr",
					"trd-off-road",
					"trd-pro"
				]
			},
			{
				code: "3U5",
				name: "Barcelona Red Metallic",
				hex: "#9d1d20",
				availableGradeIds: ["trd-off-road"]
			},
			{
				code: "0R2",
				name: "Solar Octane",
				hex: "#ff6a1a",
				availableGradeIds: ["trd-pro"],
				isPremium: true
			}
		],
		interiorColors: [{
			code: "fa20-black",
			name: "Black",
			hex: "#1a1a1a",
			material: "fabric",
			availableGradeIds: [
				"sr",
				"trd-off-road",
				"trd-pro"
			]
		}],
		media: {
			hero: {
				url: "/images/campaign/tacoma.jpg",
				alt: "Silver Toyota Tacoma on a mountain highway at dusk"
			},
			gallery: [{
				url: "/images/campaign/tacoma.jpg",
				alt: "Silver Toyota Tacoma on a mountain highway at dusk"
			}],
			thumbnails: [{
				url: "/images/campaign/tacoma.jpg",
				alt: "Toyota Tacoma thumbnail"
			}],
			videos: [],
			environmentMaps: []
		},
		threeDConfig: {
			hasModel: false,
			cameraPresets: [
				{
					id: "hero",
					label: "Hero",
					position: [
						7.5,
						4,
						8.5
					],
					target: [
						0,
						1.1,
						0
					]
				},
				{
					id: "wheels",
					label: "Wheels",
					position: [
						4.5,
						1.05,
						4.8
					],
					target: [
						-.9,
						.55,
						1.3
					]
				},
				{
					id: "interior",
					label: "Interior",
					position: [
						5.2,
						2.35,
						1.1
					],
					target: [
						0,
						1.35,
						0
					]
				},
				{
					id: "front",
					label: "Front",
					position: [
						0,
						2.2,
						-10
					],
					target: [
						0,
						1,
						0
					]
				},
				{
					id: "side",
					label: "Side",
					position: [
						10,
						2.2,
						0
					],
					target: [
						0,
						1,
						0
					]
				},
				{
					id: "rear",
					label: "Rear",
					position: [
						0,
						2.2,
						10
					],
					target: [
						0,
						1,
						0
					]
				}
			],
			paintableMaterialNames: ["body.carmain"],
			wheelMountNames: [],
			interiorMaterialNames: []
		}
	},
	{
		slug: "camry",
		year: 2025,
		model: "Camry",
		bodyStyle: "sedan",
		categories: [
			"sedan",
			"hybrid",
			"electrified"
		],
		availability: "in_production",
		updatedAt: "2024-11-01T00:00:00.000Z",
		pricing: {
			baseMsrp: 28400,
			destinationFee: 1095,
			currency: "USD"
		},
		powertrains: {
			"hybrid-2.5l": {
				id: "hybrid-2.5l",
				type: "hybrid",
				engine: "2.5L I4 hybrid",
				horsepowerHp: 225,
				torqueLbFt: 208,
				transmission: "electronic CVT",
				drivetrain: "fwd",
				fuelEconomy: {
					unit: "mpg",
					city: 51,
					highway: 53,
					combined: 52
				}
			},
			"hybrid-2.5l-awd": {
				id: "hybrid-2.5l-awd",
				type: "hybrid",
				engine: "2.5L I4 hybrid",
				horsepowerHp: 232,
				torqueLbFt: 208,
				transmission: "electronic CVT",
				drivetrain: "awd",
				fuelEconomy: {
					unit: "mpg",
					city: 44,
					highway: 47,
					combined: 46
				}
			}
		},
		grades: [
			{
				id: "le",
				name: "LE",
				msrp: 28400,
				powertrainId: "hybrid-2.5l",
				seating: 5,
				availableExteriorColorCodes: [
					"040",
					"1G3",
					"070"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"8-in touchscreen",
					"Toyota Safety Sense 3.0",
					"Standard hybrid powertrain"
				],
				packages: []
			},
			{
				id: "xle",
				name: "XLE",
				msrp: 31900,
				powertrainId: "hybrid-2.5l-awd",
				seating: 5,
				availableExteriorColorCodes: [
					"040",
					"1G3",
					"070",
					"3U5"
				],
				availableInteriorColorCodes: ["fa20-black", "lf10-macadamia"],
				standardFeatures: [
					"Heated front seats",
					"Wireless charging",
					"AWD available"
				],
				packages: []
			},
			{
				id: "xse",
				name: "XSE",
				msrp: 33900,
				powertrainId: "hybrid-2.5l-awd",
				seating: 5,
				availableExteriorColorCodes: [
					"070",
					"1G3",
					"3U5"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"Sport-tuned suspension",
					"19-in wheels",
					"Paddle shifters"
				],
				packages: []
			}
		],
		specs: [
			{
				category: "dimensions",
				key: "length_in",
				label: "Overall length",
				value: 193,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "trunk_volume_cu_ft",
				label: "Trunk volume",
				value: 15.1,
				unit: "cu ft"
			},
			{
				category: "performance",
				key: "zero_to_60_sec",
				label: "0–60 mph",
				value: 7.4,
				unit: "sec"
			},
			{
				category: "safety",
				key: "toyota_safety_sense",
				label: "Toyota Safety Sense",
				value: "TSS 3.0"
			},
			{
				category: "technology",
				key: "touchscreen_in",
				label: "Touchscreen display",
				value: 8,
				unit: "in"
			},
			{
				category: "technology",
				key: "wireless_carplay",
				label: "Wireless Apple CarPlay",
				value: true
			},
			{
				category: "comfort",
				key: "heated_seats",
				label: "Heated front seats",
				value: true
			},
			{
				category: "warranty",
				key: "basic_warranty_years_miles",
				label: "Basic warranty",
				value: "3 yr / 36,000 mi"
			},
			{
				category: "warranty",
				key: "hybrid_battery_warranty_years_miles",
				label: "Hybrid battery warranty",
				value: "10 yr / 150,000 mi"
			}
		],
		exteriorColors: [
			{
				code: "040",
				name: "Super White",
				hex: "#f2f2ef",
				availableGradeIds: ["le", "xle"]
			},
			{
				code: "1G3",
				name: "Underground",
				hex: "#4f545a",
				availableGradeIds: [
					"le",
					"xle",
					"xse"
				]
			},
			{
				code: "070",
				name: "Midnight Black Metallic",
				hex: "#101215",
				availableGradeIds: [
					"le",
					"xle",
					"xse"
				]
			},
			{
				code: "3U5",
				name: "Barcelona Red Metallic",
				hex: "#9d1d20",
				availableGradeIds: ["xle", "xse"]
			}
		],
		interiorColors: [{
			code: "fa20-black",
			name: "Black",
			hex: "#1a1a1a",
			material: "fabric",
			availableGradeIds: [
				"le",
				"xle",
				"xse"
			]
		}, {
			code: "lf10-macadamia",
			name: "Macadamia",
			hex: "#a9885f",
			material: "leather",
			availableGradeIds: ["xle"]
		}],
		media: {
			hero: {
				url: "/images/campaign/camry.jpg",
				alt: "Silver Toyota Camry on a mountain highway at dusk"
			},
			gallery: [{
				url: "/images/campaign/camry.jpg",
				alt: "Silver Toyota Camry on a mountain highway at dusk"
			}],
			thumbnails: [{
				url: "/images/campaign/camry.jpg",
				alt: "Toyota Camry thumbnail"
			}],
			videos: [],
			environmentMaps: []
		},
		threeDConfig: {
			hasModel: false,
			cameraPresets: [
				{
					id: "hero",
					label: "Hero",
					position: [
						7.5,
						4,
						8.5
					],
					target: [
						0,
						1.1,
						0
					]
				},
				{
					id: "wheels",
					label: "Wheels",
					position: [
						4.5,
						1.05,
						4.8
					],
					target: [
						-.9,
						.55,
						1.3
					]
				},
				{
					id: "interior",
					label: "Interior",
					position: [
						5.2,
						2.35,
						1.1
					],
					target: [
						0,
						1.35,
						0
					]
				},
				{
					id: "front",
					label: "Front",
					position: [
						0,
						2.2,
						-10
					],
					target: [
						0,
						1,
						0
					]
				},
				{
					id: "side",
					label: "Side",
					position: [
						10,
						2.2,
						0
					],
					target: [
						0,
						1,
						0
					]
				},
				{
					id: "rear",
					label: "Rear",
					position: [
						0,
						2.2,
						10
					],
					target: [
						0,
						1,
						0
					]
				}
			],
			paintableMaterialNames: ["body.carmain"],
			wheelMountNames: [],
			interiorMaterialNames: []
		}
	},
	{
		slug: "ae86",
		year: 1985,
		model: "Corolla GT-S (AE86)",
		bodyStyle: "hatchback",
		categories: [
			"coupe",
			"classic",
			"jdm",
			"rwd"
		],
		availability: "discontinued",
		updatedAt: "2024-11-01T00:00:00.000Z",
		pricing: {
			baseMsrp: 9858,
			destinationFee: 250,
			currency: "USD"
		},
		powertrains: {
			"4a-c-1.6l": {
				id: "4a-c-1.6l",
				type: "gas",
				engine: "1.6L SOHC I4 (4A-C)",
				horsepowerHp: 74,
				torqueLbFt: 88,
				transmission: "5-speed manual",
				drivetrain: "rwd",
				fuelEconomy: {
					unit: "mpg",
					city: 25,
					highway: 33,
					combined: 28
				}
			},
			"4a-ge-1.6l": {
				id: "4a-ge-1.6l",
				type: "gas",
				engine: "1.6L DOHC 16-valve I4 (4A-GE)",
				horsepowerHp: 112,
				torqueLbFt: 97,
				transmission: "5-speed manual",
				drivetrain: "rwd",
				fuelEconomy: {
					unit: "mpg",
					city: 23,
					highway: 30,
					combined: 26
				}
			}
		},
		grades: [{
			id: "sr5",
			name: "SR5",
			msrp: 9858,
			powertrainId: "4a-c-1.6l",
			seating: 4,
			availableExteriorColorCodes: ["040", "202"],
			availableInteriorColorCodes: ["black-vinyl"],
			standardFeatures: [
				"5-speed manual",
				"AM/FM cassette stereo",
				"Rear-wheel drive"
			],
			packages: []
		}, {
			id: "gt-s",
			name: "GT-S",
			msrp: 11498,
			powertrainId: "4a-ge-1.6l",
			seating: 4,
			availableExteriorColorCodes: [
				"040",
				"202",
				"3P0"
			],
			availableInteriorColorCodes: ["black-vinyl"],
			standardFeatures: [
				"4A-GE DOHC engine",
				"Sport-tuned suspension",
				"Limited-slip differential"
			],
			packages: []
		}],
		specs: [
			{
				category: "dimensions",
				key: "length_in",
				label: "Overall length",
				value: 172,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "width_in",
				label: "Overall width",
				value: 65.4,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "height_in",
				label: "Overall height",
				value: 50.8,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "curb_weight_lbs",
				label: "Curb weight",
				value: 2270,
				unit: "lbs"
			},
			{
				category: "performance",
				key: "zero_to_60_sec",
				label: "0–60 mph",
				value: 8.5,
				unit: "sec"
			},
			{
				category: "safety",
				key: "driver_assist_suite",
				label: "Driver assist systems",
				value: "None (predates active safety systems)"
			},
			{
				category: "technology",
				key: "am_fm_cassette",
				label: "Factory AM/FM cassette stereo",
				value: true
			},
			{
				category: "comfort",
				key: "manual_windows",
				label: "Manual windows and locks",
				value: true
			}
		],
		exteriorColors: [
			{
				code: "040",
				name: "Super White",
				hex: "#f2f2ef",
				availableGradeIds: ["sr5", "gt-s"]
			},
			{
				code: "202",
				name: "Black",
				hex: "#101215",
				availableGradeIds: ["sr5", "gt-s"]
			},
			{
				code: "3P0",
				name: "Classic Red",
				hex: "#b3141c",
				availableGradeIds: ["gt-s"],
				isPremium: true
			}
		],
		interiorColors: [{
			code: "black-vinyl",
			name: "Black",
			hex: "#1a1a1a",
			material: "fabric",
			availableGradeIds: ["sr5", "gt-s"]
		}],
		media: {
			hero: {
				url: "",
				alt: "1985 Toyota Corolla GT-S (AE86) — photography not packaged in this catalog"
			},
			gallery: [],
			thumbnails: [],
			videos: [],
			environmentMaps: []
		},
		threeDConfig: {
			hasModel: true,
			modelUrl: "/models/toyota-ae86-ivofficial.glb",
			cameraPresets: [
				{
					id: "hero",
					label: "Hero",
					position: [
						5,
						2.2,
						5.5
					],
					target: [
						0,
						.55,
						0
					]
				},
				{
					id: "wheels",
					label: "Wheels",
					position: [
						3,
						.65,
						3.1
					],
					target: [
						-.55,
						.35,
						.85
					]
				},
				{
					id: "interior",
					label: "Interior",
					position: [
						3.6,
						1.35,
						.7
					],
					target: [
						0,
						.75,
						0
					]
				},
				{
					id: "front",
					label: "Front",
					position: [
						0,
						1.4,
						-6.5
					],
					target: [
						0,
						.5,
						0
					]
				},
				{
					id: "side",
					label: "Side",
					position: [
						6.5,
						1.4,
						0
					],
					target: [
						0,
						.5,
						0
					]
				},
				{
					id: "rear",
					label: "Rear",
					position: [
						0,
						1.4,
						6.5
					],
					target: [
						0,
						.5,
						0
					]
				}
			],
			paintableMaterialNames: ["Body"],
			wheelMountNames: [],
			interiorMaterialNames: [],
			groundingNodeNames: [
				"Car",
				"Wheel1",
				"Wheel2",
				"Wheel3",
				"Wheel4"
			]
		}
	},
	{
		slug: "rav4",
		year: 2024,
		model: "RAV4",
		bodyStyle: "crossover",
		categories: [
			"crossover",
			"suv",
			"compact"
		],
		availability: "in_production",
		updatedAt: "2026-08-03T19:16:18.891Z",
		pricing: {
			baseMsrp: 29250,
			destinationFee: 1450,
			currency: "USD"
		},
		powertrains: { "2.5l-dynamic-force": {
			id: "2.5l-dynamic-force",
			type: "gas",
			engine: "2.5L Dynamic Force I4",
			horsepowerHp: 203,
			torqueLbFt: 184,
			transmission: "8-speed automatic",
			drivetrain: "awd",
			fuelEconomy: {
				unit: "mpg",
				city: 27,
				highway: 35,
				combined: 30
			},
			towingCapacityLbs: 1500
		} },
		grades: [
			{
				id: "le",
				name: "LE",
				msrp: 29250,
				powertrainId: "2.5l-dynamic-force",
				seating: 5,
				availableExteriorColorCodes: [
					"040",
					"1G3",
					"218",
					"3U5"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"Toyota Safety Sense 3.0",
					"7-in touchscreen",
					"AWD"
				],
				packages: []
			},
			{
				id: "xle",
				name: "XLE",
				msrp: 31300,
				powertrainId: "2.5l-dynamic-force",
				seating: 5,
				availableExteriorColorCodes: [
					"040",
					"1G3",
					"218",
					"3U5",
					"0R2"
				],
				availableInteriorColorCodes: ["fa20-black"],
				standardFeatures: [
					"Blind Spot Monitor",
					"Heated front seats",
					"Power liftgate"
				],
				packages: []
			},
			{
				id: "limited",
				name: "Limited",
				msrp: 36150,
				powertrainId: "2.5l-dynamic-force",
				seating: 5,
				availableExteriorColorCodes: [
					"040",
					"1G3",
					"218",
					"3U5",
					"0R2"
				],
				availableInteriorColorCodes: ["fa20-black", "lf10-red"],
				standardFeatures: [
					"JBL premium audio",
					"Ventilated front seats",
					"Digital rearview mirror"
				],
				packages: []
			}
		],
		specs: [
			{
				category: "dimensions",
				key: "length_in",
				label: "Overall length",
				value: 180.9,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "width_in",
				label: "Overall width",
				value: 73,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "height_in",
				label: "Overall height",
				value: 67,
				unit: "in"
			},
			{
				category: "dimensions",
				key: "cargo_volume_cu_ft",
				label: "Cargo volume behind 2nd row",
				value: 37.6,
				unit: "cu ft"
			},
			{
				category: "capability",
				key: "ground_clearance_in",
				label: "Ground clearance",
				value: 8.4,
				unit: "in"
			},
			{
				category: "performance",
				key: "zero_to_60_sec",
				label: "0–60 mph",
				value: 8,
				unit: "sec"
			},
			{
				category: "safety",
				key: "toyota_safety_sense",
				label: "Toyota Safety Sense",
				value: "TSS 3.0"
			},
			{
				category: "safety",
				key: "blind_spot_monitor",
				label: "Blind Spot Monitor",
				value: true
			},
			{
				category: "technology",
				key: "touchscreen_in",
				label: "Touchscreen display",
				value: 8,
				unit: "in"
			},
			{
				category: "technology",
				key: "wireless_carplay",
				label: "Wireless Apple CarPlay",
				value: true
			},
			{
				category: "warranty",
				key: "basic_warranty_years_miles",
				label: "Basic warranty",
				value: "3 yr / 36,000 mi"
			},
			{
				category: "warranty",
				key: "powertrain_warranty_years_miles",
				label: "Powertrain warranty",
				value: "5 yr / 60,000 mi"
			}
		],
		exteriorColors: [
			{
				code: "040",
				name: "Super White",
				hex: "#f2f2ef",
				availableGradeIds: [
					"le",
					"xle",
					"limited"
				]
			},
			{
				code: "1G3",
				name: "Underground",
				hex: "#4f545a",
				availableGradeIds: [
					"le",
					"xle",
					"limited"
				],
				isPremium: true
			},
			{
				code: "218",
				name: "Blueprint",
				hex: "#1558d6",
				availableGradeIds: [
					"le",
					"xle",
					"limited"
				]
			},
			{
				code: "3U5",
				name: "Barcelona Red Metallic",
				hex: "#9d1d20",
				availableGradeIds: [
					"le",
					"xle",
					"limited"
				]
			},
			{
				code: "0R2",
				name: "Solar Octane",
				hex: "#ff6a1a",
				availableGradeIds: ["xle", "limited"],
				isPremium: true
			}
		],
		interiorColors: [{
			code: "fa20-black",
			name: "Black",
			hex: "#1a1a1a",
			material: "fabric",
			availableGradeIds: [
				"le",
				"xle",
				"limited"
			]
		}, {
			code: "lf10-red",
			name: "Red",
			hex: "#4a1113",
			material: "leather",
			availableGradeIds: ["limited"]
		}],
		media: {
			hero: {
				url: "/images/campaign/rav4.jpg",
				alt: "Silver Toyota RAV4 on a mountain highway at dusk"
			},
			gallery: [{
				url: "/images/campaign/rav4.jpg",
				alt: "Silver Toyota RAV4 on a mountain highway at dusk"
			}, {
				url: "/renders/rav4-2024/rendered-rav4-viewport.png",
				alt: "2024 Toyota RAV4 Limited, captured 3D viewport render from this showroom"
			}],
			thumbnails: [{
				url: "/images/campaign/rav4.jpg",
				alt: "Toyota RAV4 thumbnail"
			}],
			videos: [],
			environmentMaps: []
		},
		threeDConfig: {
			hasModel: true,
			modelUrl: "/models/rav4-2024/rav4_2024_limited_decoded.glb",
			cameraPresets: [
				{
					id: "hero",
					label: "Hero",
					position: [
						7,
						3.5,
						8
					],
					target: [
						0,
						.85,
						0
					]
				},
				{
					id: "wheels",
					label: "Wheels",
					position: [
						4.2,
						1,
						4.6
					],
					target: [
						-.85,
						.45,
						1.25
					]
				},
				{
					id: "interior",
					label: "Interior",
					position: [
						4.8,
						2.1,
						1
					],
					target: [
						0,
						1,
						0
					]
				},
				{
					id: "front",
					label: "Front",
					position: [
						0,
						2,
						-9.5
					],
					target: [
						0,
						.8,
						0
					]
				},
				{
					id: "side",
					label: "Side",
					position: [
						9.5,
						2,
						0
					],
					target: [
						0,
						.8,
						0
					]
				},
				{
					id: "rear",
					label: "Rear",
					position: [
						0,
						2,
						9.5
					],
					target: [
						0,
						.8,
						0
					]
				}
			],
			paintableMaterialNames: ["body.carmain"],
			wheelMountNames: [
				"MOUNT_WHEEL_FRONT_LEFT",
				"MOUNT_WHEEL_FRONT_RIGHT",
				"MOUNT_WHEEL_REAR_LEFT",
				"MOUNT_WHEEL_REAR_RIGHT"
			],
			interiorMaterialNames: [],
			groundingNodeNames: ["BODY"]
		}
	}
];
function getVehicleBySlug(slug) {
	return VEHICLES.find((vehicle) => vehicle.slug === slug);
}
/** Canonical Toyota vehicle schema (v1). All catalog data and API responses conform to this. */
var VEHICLE_SCHEMA_VERSION = "1.0.0";
function toVehicleQueryFacts(vehicle) {
	const powertrains = Object.values(vehicle.powertrains);
	return {
		bodyStyle: vehicle.bodyStyle,
		categories: vehicle.categories,
		availability: vehicle.availability,
		drivetrains: powertrains.map((p) => p.drivetrain),
		powertrainTypes: powertrains.map((p) => p.type),
		maxSeating: Math.max(...vehicle.grades.map((g) => g.seating)),
		maxTowingLbs: Math.max(0, ...powertrains.map((p) => p.towingCapacityLbs ?? 0)),
		startingMsrp: Math.min(vehicle.pricing.baseMsrp, ...vehicle.grades.map((g) => g.msrp))
	};
}
function toVehicleSummary(vehicle) {
	return {
		slug: vehicle.slug,
		year: vehicle.year,
		model: vehicle.model,
		updatedAt: vehicle.updatedAt,
		thumbnail: vehicle.media.thumbnails[0] ?? vehicle.media.hero,
		...toVehicleQueryFacts(vehicle)
	};
}
/**
* 4Runner customization catalog.
*
* Every `targetNodes` / `targetMaterials` value below was read out of
* `public/models/modsnation_7416_assets_assembled.glb` (see `docs/INTEGRATION_GUIDE.md` §3 for
* the dump utility). They are exact `Object3D.name` / `Material.name` strings — nothing here
* depends on child order or traversal position.
*
* Every exported catalog entry is enforced against the shipped GLB in CI. Definitions awaiting
* authored geometry live in `plannedFourRunnerOptions` below and are not served to clients.
*/
var VEHICLE$4 = ["4runner"];
/** `BODY` is a single mesh carrying ten materials; paint must address the `body.carmain` slot. */
var PAINT_NODES$4 = ["BODY"];
var PAINT_MATERIALS$4 = ["body.carmain"];
/** The four positioned wheels. `MOUNT_WHEEL_*` are empty transform nodes at the same coordinates. */
var WHEEL_NODES$2 = [
	"PLACED_WEISU_front_left",
	"PLACED_WEISU_front_right",
	"PLACED_WEISU_rear_left",
	"PLACED_WEISU_rear_right"
];
/** Front pair uses `wheel.metal`, rear pair uses `wheel.metal.001` — both slots are named. */
var WHEEL_MATERIALS$2 = ["wheel.metal", "wheel.metal.001"];
var TIRE_NODES$2 = [
	"PLACED_KO3_front_left",
	"PLACED_KO3_front_right",
	"PLACED_KO3_rear_left",
	"PLACED_KO3_rear_right"
];
function paint$4(id, label, color, extra) {
	return {
		id,
		category: "paint",
		label,
		operation: "material-update",
		targetNodes: PAINT_NODES$4,
		targetMaterials: PAINT_MATERIALS$4,
		materialConfig: {
			color,
			metalness: .65,
			roughness: .28,
			clearcoat: 1,
			clearcoatRoughness: .06,
			...extra
		},
		compatibleVehicleIds: VEHICLE$4
	};
}
var fourRunnerOptions = [
	paint$4("paint-218-blueprint", "Blueprint", "#1558d6"),
	paint$4("paint-070-midnight-black", "Midnight Black Metallic", "#101215"),
	paint$4("paint-1j9-ice-cap", "Ice Cap", "#d8dde2", {
		metalness: .35,
		roughness: .35
	}),
	paint$4("paint-1g3-underground", "Underground", "#4f545a", {
		roughness: .45,
		clearcoat: .5
	}),
	paint$4("paint-3u5-barcelona-red", "Barcelona Red Metallic", "#9d1d20"),
	{
		...paint$4("paint-0r2-solar-octane", "Solar Octane", "#ff6a1a"),
		priceDelta: 425,
		compatibleGradeIds: ["trd-pro"]
	},
	{
		id: "paint-custom",
		category: "paint",
		label: "Custom Paint Studio",
		operation: "material-update",
		targetNodes: PAINT_NODES$4,
		targetMaterials: PAINT_MATERIALS$4,
		materialConfig: {
			color: "#1558d6",
			metalness: .65,
			roughness: .28,
			clearcoat: 1,
			clearcoatRoughness: .06
		},
		priceDelta: 595,
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "wheels-weisu-machined",
		category: "wheels",
		label: "WEISU Machined",
		operation: "material-update",
		targetNodes: WHEEL_NODES$2,
		targetMaterials: WHEEL_MATERIALS$2,
		materialConfig: {
			color: "#9aa1ab",
			metalness: .92,
			roughness: .22
		},
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "wheels-weisu-satin-black",
		category: "wheels",
		label: "WEISU Satin Black",
		operation: "material-update",
		targetNodes: WHEEL_NODES$2,
		targetMaterials: WHEEL_MATERIALS$2,
		materialConfig: {
			color: "#15171a",
			metalness: .55,
			roughness: .52
		},
		priceDelta: 380,
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "wheels-weisu-bronze",
		category: "wheels",
		label: "WEISU Bronze",
		operation: "material-update",
		targetNodes: WHEEL_NODES$2,
		targetMaterials: WHEEL_MATERIALS$2,
		materialConfig: {
			color: "#8c6239",
			metalness: .85,
			roughness: .3
		},
		priceDelta: 520,
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "wheels-weisu-gunmetal",
		category: "wheels",
		label: "WEISU Gunmetal",
		operation: "material-update",
		targetNodes: WHEEL_NODES$2,
		targetMaterials: WHEEL_MATERIALS$2,
		materialConfig: {
			color: "#3f434a",
			metalness: .88,
			roughness: .26
		},
		priceDelta: 445,
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "trim-tire-letters-raised-white",
		category: "trim",
		selectionGroup: "trim-tire-letters",
		label: "Raised White Letters",
		operation: "material-update",
		targetNodes: TIRE_NODES$2,
		targetMaterials: ["tire.sidewall"],
		materialConfig: {
			color: "#6f6f6c",
			roughness: .85
		},
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "trim-tire-letters-blackwall",
		category: "trim",
		selectionGroup: "trim-tire-letters",
		label: "Blackwall",
		operation: "material-update",
		targetNodes: TIRE_NODES$2,
		targetMaterials: ["tire.sidewall"],
		materialConfig: {
			color: "#141414",
			roughness: .94
		},
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "trim-grille-blackout",
		category: "trim",
		selectionGroup: "trim-grille",
		label: "Blackout Grille",
		operation: "material-update",
		targetNodes: ["Tun_GRILLE"],
		targetMaterials: ["plastik.all.003"],
		materialConfig: {
			color: "#0d0f11",
			metalness: .35,
			roughness: .55
		},
		priceDelta: 295,
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "trim-grille-chrome",
		category: "trim",
		selectionGroup: "trim-grille",
		label: "Chrome Grille",
		operation: "material-update",
		targetNodes: ["Tun_GRILLE"],
		targetMaterials: ["plastik.all.003"],
		materialConfig: {
			color: "#c9ced6",
			metalness: .95,
			roughness: .12
		},
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "accessory-roof-rack",
		category: "accessory",
		label: "Overland Roof Rack",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_ROOF_RACK"],
		priceDelta: 1150,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "accessory-light-bar",
		category: "accessory",
		label: "LED Light Bar",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_LIGHT_BAR"],
		priceDelta: 680,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "accessory-rock-sliders",
		category: "accessory",
		label: "Rock Sliders",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_ROCK_SLIDERS"],
		priceDelta: 890,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "accessory-underglow",
		category: "accessory",
		label: "LED Underglow",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_UNDERGLOW"],
		priceDelta: 450,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$4
	},
	{
		id: "accessory-fog-lights",
		category: "accessory",
		label: "Auxiliary Fog Lights",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_FOG_LIGHTS"],
		priceDelta: 320,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$4
	}
];
/**
* Tacoma customization catalog.
*
* `threeDConfig.hasModel` is `false` for this vehicle (`lib/data/vehicles/tacoma.ts`) — there is no
* Tacoma GLB in this repo, only the shared 4Runner asset. `VehicleCanvas`'s `loadVehicleRoot` falls
* back to `createProceduralVehicle()` (`lib/three/proceduralParts.ts`) for any vehicle without a
* model, and that fallback is deliberately built with the *same* node and material names as the real
* 4Runner GLB ("named to match the detailed asset so the same catalog records resolve against the
* fallback" — see that file's own comment). These options target those shared names, so they are
* genuinely functional today against the procedural vehicle, not forward-declared placeholders
* waiting on an asset — unlike the 4Runner catalog's gated hood/decal entries.
*
* Colours are pulled from `lib/data/vehicles/tacoma.ts`'s own `exteriorColors`/`grades`, rather than
* invented, so a paint option's label, hex, and grade gating always match the vehicle's own data.
*/
var VEHICLE$3 = ["tacoma"];
var PAINT_NODES$3 = ["BODY"];
var PAINT_MATERIALS$3 = ["body.carmain"];
var WHEEL_NODES$1 = [
	"PLACED_WEISU_front_left",
	"PLACED_WEISU_front_right",
	"PLACED_WEISU_rear_left",
	"PLACED_WEISU_rear_right"
];
var WHEEL_MATERIALS$1 = ["wheel.metal"];
var TIRE_NODES$1 = [
	"PLACED_KO3_front_left",
	"PLACED_KO3_front_right",
	"PLACED_KO3_rear_left",
	"PLACED_KO3_rear_right"
];
function paint$3(id, label, color, priceDelta, gradeIds) {
	return {
		id,
		category: "paint",
		label,
		operation: "material-update",
		targetNodes: PAINT_NODES$3,
		targetMaterials: PAINT_MATERIALS$3,
		materialConfig: {
			color,
			metalness: .65,
			roughness: .28,
			clearcoat: 1,
			clearcoatRoughness: .06
		},
		...priceDelta ? { priceDelta } : {},
		...gradeIds ? { compatibleGradeIds: gradeIds } : {},
		compatibleVehicleIds: VEHICLE$3
	};
}
var tacomaOptions = [
	paint$3("paint-040-super-white", "Super White", "#f2f2ef"),
	paint$3("paint-218-blueprint", "Blueprint", "#1558d6"),
	paint$3("paint-1j9-ice-cap", "Ice Cap", "#d8dde2", void 0, [
		"sr",
		"trd-off-road",
		"trd-pro"
	]),
	paint$3("paint-3u5-barcelona-red", "Barcelona Red Metallic", "#9d1d20", void 0, ["trd-off-road"]),
	paint$3("paint-0r2-solar-octane", "Solar Octane", "#ff6a1a", 425, ["trd-pro"]),
	{
		id: "wheels-trail-machined",
		category: "wheels",
		label: "Trail Machined",
		operation: "material-update",
		targetNodes: WHEEL_NODES$1,
		targetMaterials: WHEEL_MATERIALS$1,
		materialConfig: {
			color: "#9aa1ab",
			metalness: .92,
			roughness: .22
		},
		compatibleVehicleIds: VEHICLE$3
	},
	{
		id: "wheels-trail-satin-black",
		category: "wheels",
		label: "Trail Satin Black",
		operation: "material-update",
		targetNodes: WHEEL_NODES$1,
		targetMaterials: WHEEL_MATERIALS$1,
		materialConfig: {
			color: "#15171a",
			metalness: .55,
			roughness: .52
		},
		priceDelta: 380,
		compatibleVehicleIds: VEHICLE$3
	},
	{
		id: "wheels-trail-bronze",
		category: "wheels",
		label: "Trail Bronze",
		operation: "material-update",
		targetNodes: WHEEL_NODES$1,
		targetMaterials: WHEEL_MATERIALS$1,
		materialConfig: {
			color: "#8c6239",
			metalness: .85,
			roughness: .3
		},
		priceDelta: 480,
		compatibleVehicleIds: VEHICLE$3,
		compatibleGradeIds: ["trd-off-road", "trd-pro"]
	},
	{
		id: "trim-tire-letters-raised-white",
		category: "trim",
		selectionGroup: "trim-tire-letters",
		label: "Raised White Letters",
		operation: "material-update",
		targetNodes: TIRE_NODES$1,
		targetMaterials: ["tire.sidewall"],
		materialConfig: {
			color: "#6f6f6c",
			roughness: .85
		},
		compatibleVehicleIds: VEHICLE$3
	},
	{
		id: "trim-tire-letters-blackwall",
		category: "trim",
		selectionGroup: "trim-tire-letters",
		label: "Blackwall",
		operation: "material-update",
		targetNodes: TIRE_NODES$1,
		targetMaterials: ["tire.sidewall"],
		materialConfig: {
			color: "#141414",
			roughness: .94
		},
		compatibleVehicleIds: VEHICLE$3
	},
	{
		id: "accessory-roof-rack",
		category: "accessory",
		label: "Overland Roof Rack",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_ROOF_RACK"],
		priceDelta: 1150,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$3
	},
	{
		id: "accessory-light-bar",
		category: "accessory",
		label: "LED Light Bar",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_LIGHT_BAR"],
		priceDelta: 680,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$3,
		compatibleGradeIds: ["trd-off-road", "trd-pro"]
	},
	{
		id: "accessory-rock-sliders",
		category: "accessory",
		label: "Rock Sliders",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_ROCK_SLIDERS"],
		priceDelta: 890,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$3,
		compatibleGradeIds: ["trd-off-road", "trd-pro"]
	},
	{
		id: "accessory-underglow",
		category: "accessory",
		label: "LED Underglow",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_UNDERGLOW"],
		priceDelta: 450,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$3
	},
	{
		id: "accessory-fog-lights",
		category: "accessory",
		label: "Auxiliary Fog Lights",
		operation: "mesh-visibility",
		targetNodes: ["ACCESSORY_FOG_LIGHTS"],
		priceDelta: 320,
		geometrySource: "procedural-preview",
		compatibleVehicleIds: VEHICLE$3,
		compatibleGradeIds: ["trd-off-road", "trd-pro"]
	}
];
/**
* Camry customization catalog.
*
* Same rationale as `lib/data/options/tacoma.ts`: `hasModel` is `false`
* (`lib/data/vehicles/camry.ts`), so `VehicleCanvas` renders the procedural fallback vehicle
* (`lib/three/proceduralParts.ts`), which is deliberately named to match the real 4Runner GLB's
* node/material contract. These options are genuinely functional against that fallback today.
*
* Unlike Tacoma, this catalog omits the off-road accessories (roof rack, light bar, rock sliders)
* and raised-white-letter tire lettering — all are truck/off-road-coded and would misrepresent what
* a Camry buyer is actually choosing between, even though the underlying procedural nodes exist and
* would technically resolve. Catalog scope is a per-vehicle product decision, not just "everything
* the fallback happens to support."
*/
var VEHICLE$2 = ["camry"];
var PAINT_NODES$2 = ["BODY"];
var PAINT_MATERIALS$2 = ["body.carmain"];
var WHEEL_NODES = [
	"PLACED_WEISU_front_left",
	"PLACED_WEISU_front_right",
	"PLACED_WEISU_rear_left",
	"PLACED_WEISU_rear_right"
];
var WHEEL_MATERIALS = ["wheel.metal"];
var TIRE_NODES = [
	"PLACED_KO3_front_left",
	"PLACED_KO3_front_right",
	"PLACED_KO3_rear_left",
	"PLACED_KO3_rear_right"
];
function paint$2(id, label, color, gradeIds) {
	return {
		id,
		category: "paint",
		label,
		operation: "material-update",
		targetNodes: PAINT_NODES$2,
		targetMaterials: PAINT_MATERIALS$2,
		materialConfig: {
			color,
			metalness: .7,
			roughness: .22,
			clearcoat: 1,
			clearcoatRoughness: .05
		},
		...gradeIds ? { compatibleGradeIds: gradeIds } : {},
		compatibleVehicleIds: VEHICLE$2
	};
}
var camryOptions = [
	paint$2("paint-040-super-white", "Super White", "#f2f2ef", ["le", "xle"]),
	paint$2("paint-1g3-underground", "Underground", "#4f545a"),
	paint$2("paint-070-midnight-black", "Midnight Black Metallic", "#101215"),
	paint$2("paint-3u5-barcelona-red", "Barcelona Red Metallic", "#9d1d20", ["xle", "xse"]),
	{
		id: "wheels-sport-machined",
		category: "wheels",
		label: "Sport Machined",
		operation: "material-update",
		targetNodes: WHEEL_NODES,
		targetMaterials: WHEEL_MATERIALS,
		materialConfig: {
			color: "#a7acb3",
			metalness: .9,
			roughness: .18
		},
		compatibleVehicleIds: VEHICLE$2
	},
	{
		id: "wheels-gloss-black",
		category: "wheels",
		label: "Gloss Black",
		operation: "material-update",
		targetNodes: WHEEL_NODES,
		targetMaterials: WHEEL_MATERIALS,
		materialConfig: {
			color: "#0e0f11",
			metalness: .6,
			roughness: .15
		},
		priceDelta: 350,
		compatibleVehicleIds: VEHICLE$2,
		compatibleGradeIds: ["xle", "xse"]
	},
	{
		id: "trim-tire-letters-blackwall",
		category: "trim",
		selectionGroup: "trim-tire-letters",
		label: "Blackwall",
		operation: "material-update",
		targetNodes: TIRE_NODES,
		targetMaterials: ["tire.sidewall"],
		materialConfig: {
			color: "#141414",
			roughness: .94
		},
		compatibleVehicleIds: VEHICLE$2
	},
	{
		id: "trim-tire-letters-raised-white",
		category: "trim",
		selectionGroup: "trim-tire-letters",
		label: "Raised White Letters",
		operation: "material-update",
		targetNodes: TIRE_NODES,
		targetMaterials: ["tire.sidewall"],
		materialConfig: {
			color: "#6f6f6c",
			roughness: .85
		},
		priceDelta: 180,
		compatibleVehicleIds: VEHICLE$2
	}
];
/**
* AE86 customization catalog.
*
* `public/models/toyota-ae86-ivofficial.glb` is a real, minimal FBX2glTF export: 7 nodes total
* (`RootNode`, `Car`, `Wheel1`–`Wheel4`, `Camera`) and exactly **one** material in the whole file,
* named `Body`, reused across the `Car` mesh and all four `Wheel*` meshes (confirmed by parsing the
* GLB's JSON chunk directly — see `lib/tooling/glbInspect.ts`). No separate glass/chrome/trim/tire
* materials, no `MOUNT_*` attachment points.
*
* That single shared material does not block a `Car`-only paint option: `lib/three/materials.ts`'s
* `MaterialWriter` clones per mesh instance (`mesh.uuid:slotIndex`), not by shared material identity,
* so targeting only `Car` leaves `Wheel1`–`Wheel4` untouched — the same guarantee the 4Runner's
* `metal.chrome` (shared by six nodes) already relies on.
*
* Deliberately NOT included here, and why:
* - A "wheel finish" option targeting `Wheel1`–`Wheel4` would be mechanically safe the same way, but
*   each wheel mesh's baked texture region likely covers rim *and* tire together with no material
*   split — tinting the slot would tint the tire rubber too. Skipped until a better-authored asset
*   (or a UV-masked texture swap) makes that separable.
* - The procedural accessories (`lib/three/proceduralParts.ts` — roof rack, light bar, rock sliders)
*   are hand-positioned in local coordinates tuned to the 4Runner/procedural body's proportions; this
*   is a much smaller, differently-shaped 1980s coupe, so attaching them would misplace the geometry,
*   not just look thematically wrong (unlike Camry's purely thematic exclusion of the same options).
* - No separate tire/trim material exists, so no tire-lettering/trim options are possible.
*
* Colours are pulled from `lib/data/vehicles/ae86.ts`'s own `exteriorColors`/`grades`, rather than
* invented, so a paint option's label, hex, and grade gating always match the vehicle's own data.
*/
var VEHICLE$1 = ["ae86"];
var PAINT_NODES$1 = ["Car"];
var PAINT_MATERIALS$1 = ["Body"];
function paint$1(id, label, color, gradeIds) {
	return {
		id,
		category: "paint",
		label,
		operation: "material-update",
		targetNodes: PAINT_NODES$1,
		targetMaterials: PAINT_MATERIALS$1,
		materialConfig: {
			color,
			metalness: .4,
			roughness: .27
		},
		...gradeIds ? { compatibleGradeIds: gradeIds } : {},
		compatibleVehicleIds: VEHICLE$1
	};
}
var ae86Options = [
	paint$1("paint-040-super-white", "Super White", "#f2f2ef"),
	paint$1("paint-202-black", "Black", "#101215"),
	paint$1("paint-3p0-classic-red", "Classic Red", "#b3141c", ["gt-s"])
];
/**
* RAV4 customization catalog.
*
* `public/models/rav4-2024/rav4_2024_limited_decoded.glb` is a body-shell-only capture — see
* `docs/RAV4_PROVENANCE.md` and `lib/data/sceneMap/rav4.ts`'s own header for the full node/material
* inventory (read directly out of the file, not assumed from the 4Runner's naming). `BODY` is the
* only mesh in the asset, carrying ten materials; every `targetNodes`/`targetMaterials` value below
* is one of those ten, confirmed present.
*
* Deliberately NOT included here, and why:
* - No wheel, tire, or interior options: this capture has no wheel/tire/interior geometry at all
*   (only four empty `MOUNT_WHEEL_*` transform nodes — see `lib/data/vehicles/rav4.ts`), so there is
*   nothing for such an option to target. Adding one would either silently fail
*   `verifyNodeContract` or, worse, target the wrong node and appear to work while doing nothing.
* - No grille option: unlike the 4Runner's separate `Tun_GRILLE` node, this capture has no distinct
*   grille geometry — the grille is baked into `BODY`'s `plastik.all` region along with every other
*   black plastic trim panel, so a grille-only finish is not separable from the rest of that slot.
*
* Colours are pulled from `lib/data/vehicles/rav4.ts`'s own `exteriorColors`, rather than invented,
* so a paint option's label, hex, and grade gating always match the vehicle's own data.
*/
var VEHICLE = ["rav4"];
var PAINT_NODES = ["BODY"];
var PAINT_MATERIALS = ["body.carmain"];
var CHROME_TRIM_NODES = ["BODY"];
var CHROME_TRIM_MATERIALS = ["metal.chrome"];
function paint(id, label, color, extra) {
	return {
		id,
		category: "paint",
		label,
		operation: "material-update",
		targetNodes: PAINT_NODES,
		targetMaterials: PAINT_MATERIALS,
		materialConfig: {
			color,
			metalness: .65,
			roughness: .28,
			clearcoat: 1,
			clearcoatRoughness: .06,
			...extra
		},
		compatibleVehicleIds: VEHICLE
	};
}
var rav4Options = [
	paint("paint-040-super-white", "Super White", "#f2f2ef"),
	paint("paint-1g3-underground", "Underground", "#4f545a", {
		roughness: .45,
		clearcoat: .5
	}),
	paint("paint-218-blueprint", "Blueprint", "#1558d6"),
	paint("paint-3u5-barcelona-red", "Barcelona Red Metallic", "#9d1d20"),
	{
		...paint("paint-0r2-solar-octane", "Solar Octane", "#ff6a1a"),
		compatibleGradeIds: ["xle", "limited"]
	},
	{
		id: "trim-chrome-bright",
		category: "trim",
		selectionGroup: "trim-chrome",
		label: "Bright Chrome",
		operation: "material-update",
		targetNodes: CHROME_TRIM_NODES,
		targetMaterials: CHROME_TRIM_MATERIALS,
		materialConfig: {
			color: "#c9ced6",
			metalness: .95,
			roughness: .12
		},
		compatibleVehicleIds: VEHICLE
	},
	{
		id: "trim-chrome-blackout",
		category: "trim",
		selectionGroup: "trim-chrome",
		label: "Blackout Chrome Delete",
		operation: "material-update",
		targetNodes: CHROME_TRIM_NODES,
		targetMaterials: CHROME_TRIM_MATERIALS,
		materialConfig: {
			color: "#0d0f11",
			metalness: .35,
			roughness: .55
		},
		priceDelta: 295,
		compatibleVehicleIds: VEHICLE
	}
];
var options_exports = /* @__PURE__ */ __exportAll$1({
	getOptionById: () => getOptionById,
	getOptionsForVehicle: () => getOptionsForVehicle,
	isOptionAvailableForGrade: () => isOptionAvailableForGrade
});
/**
* Server-side source of truth for customization options. The browser receives these records from
* `GET /api/v1/vehicles/:slug/options`; it never invents them, and it never sends node names,
* material names, or asset paths back — only option ids, which are resolved here.
*/
var OPTIONS_BY_VEHICLE = {
	"4runner": fourRunnerOptions,
	tacoma: tacomaOptions,
	camry: camryOptions,
	ae86: ae86Options,
	rav4: rav4Options
};
Object.values(OPTIONS_BY_VEHICLE).flat();
function getOptionsForVehicle(vehicleId) {
	return OPTIONS_BY_VEHICLE[vehicleId] ?? [];
}
function getOptionById(vehicleId, optionId) {
	return getOptionsForVehicle(vehicleId).find((option) => option.id === optionId);
}
/**
* Options a given grade may select. A grade restriction is expressed on the option
* (`compatibleGradeIds`); absent means "every grade of a compatible vehicle".
*/
function isOptionAvailableForGrade(option, gradeId) {
	return !option.compatibleGradeIds?.length || option.compatibleGradeIds.includes(gradeId);
}
var TOYOTA_COM = "Toyota.com all-vehicles starting MSRP, observed 2026-09-11. Not a Hendrick Toyota Merriam quote.";
var CAMRY_SRC = "Toyota.com cars-under-40000 2026 Camry base MSRP, observed 2026-09-11. Not a Hendrick quote.";
function tabs(body, electrified) {
	const next = [body];
	if (electrified === "hybrid" || electrified === "phev") next.push("hybrid");
	if (electrified === "bev" || electrified === "fcev" || electrified === "phev") next.push("electric");
	return next;
}
function model(partial) {
	return {
		hasCatalog: false,
		has3d: false,
		...partial,
		tabs: partial.tabs ?? tabs(partial.body, partial.electrified),
		msrpSource: partial.startingMsrp ? partial.msrpSource ?? TOYOTA_COM : partial.msrpSource
	};
}
var LINEUP = [
	model({
		slug: "corolla",
		name: "Corolla",
		year: 2026,
		tagline: "A smarter tomorrow, today.",
		body: "car",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/corolla.jpg",
			alt: "White Toyota Corolla on a mountain highway at dusk"
		},
		startingMsrp: 23125
	}),
	model({
		slug: "corolla-hatchback",
		name: "Corolla Hatchback",
		year: 2026,
		tagline: "City-ready. Still a Corolla.",
		body: "car",
		electrified: null,
		image: {
			src: "/images/campaign/corolla-hatchback.jpg",
			alt: "White Toyota Corolla Hatchback on a mountain highway at dusk"
		},
		startingMsrp: 24580
	}),
	model({
		slug: "camry",
		name: "Camry",
		year: 2026,
		tagline: "Confidence in every drive.",
		body: "car",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/camry.jpg",
			alt: "Silver Toyota Camry on a mountain highway at dusk"
		},
		hasCatalog: true,
		has3d: false,
		startingMsrp: 29600,
		msrpSource: CAMRY_SRC,
		featuredRank: 2
	}),
	model({
		slug: "prius",
		name: "Prius",
		year: 2026,
		tagline: "Efficiency, sharpened.",
		body: "car",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/prius.jpg",
			alt: "White Toyota Prius on a mountain highway at dusk"
		},
		startingMsrp: 28550
	}),
	model({
		slug: "crown",
		name: "Crown",
		year: 2026,
		tagline: "Quietly elevated.",
		body: "car",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/crown.jpg",
			alt: "Silver Toyota Crown on a mountain highway at dusk"
		},
		startingMsrp: 41440
	}),
	model({
		slug: "gr86",
		name: "GR86",
		year: 2026,
		tagline: "Built to be driven.",
		body: "car",
		electrified: null,
		image: {
			src: "/images/campaign/gr86.jpg",
			alt: "Red Toyota GR86 on a mountain highway at dusk"
		},
		startingMsrp: 31400
	}),
	model({
		slug: "gr-corolla",
		name: "GR Corolla",
		year: 2026,
		tagline: "Rally DNA. Daily usable.",
		body: "car",
		electrified: null,
		image: {
			src: "/images/campaign/gr-corolla.jpg",
			alt: "White Toyota GR Corolla on a mountain highway at dusk"
		},
		startingMsrp: 40520
	}),
	model({
		slug: "gr-supra",
		name: "GR Supra",
		year: 2026,
		tagline: "Pure GR.",
		body: "car",
		electrified: null,
		image: {
			src: "/images/campaign/gr-supra.jpg",
			alt: "Red Toyota GR Supra on a mountain highway at dusk"
		},
		startingMsrp: 58300
	}),
	model({
		slug: "mirai",
		name: "Mirai",
		year: 2026,
		tagline: "Hydrogen, made quiet.",
		body: "car",
		electrified: "fcev",
		image: {
			src: "/images/campaign/mirai.jpg",
			alt: "White Toyota Mirai on a mountain highway at dusk"
		},
		startingMsrp: 51795
	}),
	model({
		slug: "corolla-cross",
		name: "Corolla Cross",
		year: 2026,
		tagline: "Corolla sense. Crossover space.",
		body: "suv",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/corolla-cross.jpg",
			alt: "Silver Toyota Corolla Cross on a mountain highway at dusk"
		},
		startingMsrp: 25335
	}),
	model({
		slug: "rav4",
		name: "RAV4",
		year: 2026,
		tagline: "Adventure meets innovation.",
		body: "suv",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/rav4.jpg",
			alt: "Silver Toyota RAV4 on a mountain highway at dusk"
		},
		hero: {
			src: "/images/campaign/rav4-hero.jpg",
			mobileSrc: "/images/campaign/rav4-hero-mobile.jpg",
			alt: "Silver Toyota RAV4 under a modern overhang with mountains at dusk"
		},
		hasCatalog: true,
		has3d: true,
		startingMsrp: 31900,
		featuredRank: 1
	}),
	model({
		slug: "c-hr",
		name: "C-HR",
		year: 2026,
		tagline: "Compact. All electric.",
		body: "suv",
		electrified: "bev",
		image: {
			src: "/images/campaign/c-hr.jpg",
			alt: "Silver Toyota C-HR on a mountain highway at dusk"
		},
		startingMsrp: 37e3
	}),
	model({
		slug: "crown-signia",
		name: "Crown Signia",
		year: 2026,
		tagline: "Wagon grace. SUV stance.",
		body: "suv",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/crown-signia.jpg",
			alt: "White Toyota Crown Signia on a mountain highway at dusk"
		},
		startingMsrp: 44690
	}),
	model({
		slug: "highlander",
		name: "Highlander",
		year: 2026,
		tagline: "Three rows. Family first.",
		body: "suv",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/highlander.jpg",
			alt: "Silver Toyota Highlander on a mountain highway at dusk"
		},
		startingMsrp: 46270
	}),
	model({
		slug: "grand-highlander",
		name: "Grand Highlander",
		year: 2026,
		tagline: "Room for the whole crew.",
		body: "suv",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/grand-highlander.jpg",
			alt: "Silver Toyota Grand Highlander on a mountain highway at dusk"
		},
		startingMsrp: 42260
	}),
	model({
		slug: "4runner",
		name: "4Runner",
		year: 2026,
		tagline: "Go further off the map.",
		body: "suv",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/4runner.jpg",
			alt: "Silver Toyota 4Runner on a mountain highway at dusk"
		},
		hero: {
			src: "/images/campaign/4runner-hero.jpg",
			alt: "Silver Toyota 4Runner under a modern overhang with mountains at dusk"
		},
		hasCatalog: true,
		has3d: true,
		startingMsrp: 42270,
		featuredRank: 4
	}),
	model({
		slug: "land-cruiser",
		name: "Land Cruiser",
		year: 2027,
		tagline: "The icon, rewritten.",
		body: "suv",
		electrified: null,
		image: {
			src: "/images/campaign/land-cruiser.jpg",
			alt: "Khaki Toyota Land Cruiser on a mountain highway at dusk"
		},
		startingMsrp: 58080
	}),
	model({
		slug: "sequoia",
		name: "Sequoia",
		year: 2026,
		tagline: "Full-size capability.",
		body: "suv",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/sequoia.jpg",
			alt: "Dark gray Toyota Sequoia on a mountain highway at dusk"
		},
		startingMsrp: 65725
	}),
	model({
		slug: "bz",
		name: "bZ",
		year: 2026,
		tagline: "All electric. A brighter tomorrow.",
		body: "suv",
		electrified: "bev",
		image: {
			src: "/images/campaign/bz.jpg",
			alt: "Silver Toyota bZ electric SUV on a mountain highway at dusk"
		},
		startingMsrp: 34900,
		featuredRank: 5
	}),
	model({
		slug: "bz-woodland",
		name: "bZ Woodland",
		year: 2026,
		tagline: "Electric, with dirt under the fenders.",
		body: "suv",
		electrified: "bev",
		image: {
			src: "/images/campaign/bz-woodland.jpg",
			alt: "Matte gray Toyota bZ Woodland on a mountain highway at dusk"
		},
		startingMsrp: 45300
	}),
	model({
		slug: "tacoma",
		name: "Tacoma",
		year: 2026,
		tagline: "Built for what's next.",
		body: "truck",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/tacoma.jpg",
			alt: "Silver Toyota Tacoma on a mountain highway at dusk"
		},
		hasCatalog: true,
		has3d: false,
		startingMsrp: 32545,
		featuredRank: 3
	}),
	model({
		slug: "tundra",
		name: "Tundra",
		year: 2026,
		tagline: "Full-size, full workday.",
		body: "truck",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/tundra.jpg",
			alt: "Silver Toyota Tundra on a mountain highway at dusk"
		},
		startingMsrp: 41260
	}),
	model({
		slug: "sienna",
		name: "Sienna",
		year: 2026,
		tagline: "Family miles, hybrid quiet.",
		body: "minivan",
		electrified: "hybrid",
		image: {
			src: "/images/campaign/sienna.jpg",
			alt: "White Toyota Sienna on a mountain highway at dusk"
		},
		startingMsrp: 41320
	})
];
var SLUG_ALIASES = {
	bz4x: "bz",
	"bz4x-woodland": "bz-woodland"
};
var LINEUP_TABS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "suv",
		label: "SUV"
	},
	{
		id: "car",
		label: "Car"
	},
	{
		id: "truck",
		label: "Truck"
	},
	{
		id: "minivan",
		label: "Minivan"
	},
	{
		id: "hybrid",
		label: "Hybrid"
	},
	{
		id: "electric",
		label: "Electric"
	}
];
function getLineupBySlug(slug) {
	const canonical = SLUG_ALIASES[slug] ?? slug;
	return LINEUP.find((item) => item.slug === canonical);
}
function filterLineup(tab) {
	if (tab === "all") return [...LINEUP];
	return LINEUP.filter((item) => item.tabs.includes(tab));
}
function featuredLineup() {
	return LINEUP.filter((item) => item.featuredRank != null).sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));
}
function lineupConfigure(model) {
	if (model.has3d) return {
		kind: "3d",
		label: "Open 3D showroom"
	};
	if (model.hasCatalog) return {
		kind: "build",
		label: "Build & Price"
	};
	return {
		kind: "none",
		label: "View details"
	};
}
function electrifiedLabel(value) {
	if (value === "hybrid") return "Hybrid";
	if (value === "phev") return "Plug-in hybrid";
	if (value === "bev") return "Electric";
	if (value === "fcev") return "Hydrogen";
	return null;
}
//#endregion
export { electrifiedLabel as a, getLineupBySlug as c, getVehicleBySlug as d, isOptionAvailableForGrade as f, toVehicleSummary as h, VEHICLE_SCHEMA_VERSION as i, getOptionById as l, lineup_m5PRC25T_exports as m, LINEUP_TABS as n, featuredLineup as o, lineupConfigure as p, VEHICLES as r, filterLineup as s, LINEUP as t, getOptionsForVehicle as u };
