import { createFileRoute, notFound } from "@tanstack/react-router";
import { BuilderApp } from "@/components/showroom/BuilderApp";
import { getVehicleBySlug } from "@/showroom/data/vehicles";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/vehicles/$slug/configure")({
  loader: ({ params }) => {
    const vehicle = getVehicleBySlug(params.slug);
    if (!vehicle) throw notFound();
    return { slug: params.slug, hasModel: vehicle.threeDConfig.hasModel };
  },
  head: ({ params }) => {
    const vehicle = getVehicleBySlug(params.slug);
    const name = vehicle ? `${vehicle.year} ${vehicle.model}` : "your Toyota";
    return pageHead(`Build ${name}`, `Configure ${name} in 3D: grade, colors, packages, and accessories.`);
  },
  component: ConfigurePage,
});

function ConfigurePage() {
  const { slug } = Route.useLoaderData();
  return (
    <div className="min-h-dvh bg-bg">
      <BuilderApp vehicleSlug={slug} />
    </div>
  );
}
