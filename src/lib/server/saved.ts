import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { newId } from "@/showroom/shared/id";
import { z } from "zod";

const slugSchema = z.object({ slug: z.string().trim().min(1).max(40) });

export const listSavedVehicles = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ vehicle_slug: string; created_at: string }>`
      select vehicle_slug, created_at from saved_vehicles
      where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const toggleSavedVehicle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string }) => slugSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ id: string }>`
      select id from saved_vehicles where user_id = ${context.userId} and vehicle_slug = ${data.slug} limit 1
    `;
    if (existing[0]) {
      await sql`delete from saved_vehicles where id = ${existing[0].id} and user_id = ${context.userId}`;
      return { saved: false as const, slug: data.slug };
    }
    await sql`
      insert into saved_vehicles (id, user_id, vehicle_slug)
      values (${newId("fav")}, ${context.userId}, ${data.slug})
    `;
    return { saved: true as const, slug: data.slug };
  });

export const listSavedConfigurations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ id: string; configuration_id: string; vehicle_slug: string; label: string | null; created_at: string }>`
      select id, configuration_id, vehicle_slug, label, created_at
      from saved_configurations
      where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const pinConfiguration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { configurationId: string; vehicleSlug: string; label?: string }) =>
    z
      .object({
        configurationId: z.string().trim().min(3).max(80),
        vehicleSlug: z.string().trim().min(1).max(40),
        label: z.string().trim().max(80).optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = newId("pin");
    await sql`
      insert into saved_configurations (id, user_id, configuration_id, vehicle_slug, label)
      values (${id}, ${context.userId}, ${data.configurationId}, ${data.vehicleSlug}, ${data.label ?? null})
    `;
    return { id };
  });
