export interface Hotspot {
  id: string;
  sceneId: string;
  label: string;
  copy: string;
  cameraPresetHint?: string;
}

const SHARED: Hotspot[] = [
  {
    id: "headlights",
    sceneId: "headlight.assembly",
    label: "Headlights",
    copy: "LED lighting is listed on catalog trims that include it. Geometry here is the headlamp glass in this 3D capture.",
    cameraPresetHint: "front",
  },
  {
    id: "body",
    sceneId: "body.exterior",
    label: "Exterior",
    copy: "Paint is an option in this showroom. Color names come from the project catalog, not a live Toyota configurator.",
  },
  {
    id: "windows",
    sceneId: "glass.windows",
    label: "Glass",
    copy: "Side glass in this capture. No invented acoustic-glass claims.",
  },
];

export const HOTSPOTS: Record<string, Hotspot[]> = {
  rav4: [
    ...SHARED,
    {
      id: "chrome",
      sceneId: "body.trim.chrome",
      label: "Chrome trim",
      copy: "Chrome finish is selectable on this RAV4 capture. Interior, wheels, and cargo volume are not modeled in this GLB.",
    },
    {
      id: "safety",
      sceneId: "body.exterior",
      label: "Safety sensors",
      copy: "Toyota Safety Sense 3.0 is listed on the RAV4 catalog trims in this project. Sensor hardware is not a separate mesh in this capture.",
    },
  ],
  "4runner": [
    ...SHARED,
    {
      id: "wheels",
      sceneId: "wheel.front-left",
      label: "Wheels",
      copy: "Wheel options apply when this capture has wheel geometry. Unsatisfied scene-map entries are not pretended to be present.",
    },
  ],
};

export function hotspotsFor(slug: string): Hotspot[] {
  return HOTSPOTS[slug] ?? SHARED;
}
