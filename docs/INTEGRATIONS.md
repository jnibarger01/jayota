# External integrations

Every third-party data source is behind a typed adapter. Production never silently
falls back to fixture inventory, APR, or trade values.

| Provider | Purpose | Auth | Env | Timeout / retry | Fallback |
|---|---|---|---|---|---|
| Vehicle catalog | Model/trim/spec merchandising | none | in-repo `src/showroom/data/vehicles` | n/a | Catalog figures labeled as project data, not live Toyota quotes |
| InventoryProvider | VIN-level lot inventory | feed token | `INVENTORY_FEED_URL`, `INVENTORY_FEED_TOKEN` | n/a | **Fail closed.** Empty list + truthful copy until a documented feed exists |
| OffersProvider | Regional incentives | feed token | `OFFERS_FEED_URL`, `OFFERS_FEED_TOKEN` | n/a | **Fail closed.** No APR/lease/rebate figures |
| EmailProvider | Lead / appointment receipts | API key | `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM` | n/a | Request is stored; UI reports email was **not** sent |
| Maps | Directions + embed | public OSM/Google Maps URLs | none | n/a | Static address + tel: links |
| Analytics | Typed events, no PII | consent | none | n/a | Dropped until visitor allows analytics |
| Trade-in valuation | Instant cash offer | not present | — | — | Appraisal request stored; **no fabricated value** |
| Service scheduling | DMS appointment book | not present | — | — | Intake stored as `request_received`, not booked |

## Inventory feed contract

Live lot data is parsed only through `parseInventoryFeedResponse` in
`src/lib/providers/inventory.ts`. The frozen Zod schemas are:

| Schema | Role |
|---|---|
| `inventoryVinSchema` | 17-char ISO 3779 VIN (no `I`, `O`, or `Q`) |
| `inventoryFeedLotSchema` | One vehicle / lot row → `InventoryVehicle` fields |
| `inventoryFeedResponseSchema` | Top-level envelope requiring a `lots` array |

### Response mapping

| Feed JSON | App type | Notes |
|---|---|---|
| `lots` | `InventoryFeedLot[]` | Required. Empty array = no vehicles on the lot (valid). Missing `lots` fails the contract. |
| `lots[].vin` | `InventoryVehicle.vin` | Exactly 17 chars; invalid VINs fail contract tests |
| `lots[].stockNumber` | `InventoryVehicle.stockNumber` | Non-empty string |
| `lots[].year` | `InventoryVehicle.year` | Integer 1980–2100 |
| `lots[].make` / `model` / `trim` | same | Non-empty strings |
| `lots[].drivetrain` | `InventoryVehicle.drivetrain` | `string \| null` |
| `lots[].exteriorColor` | `InventoryVehicle.exteriorColor` | `string \| null` |
| `lots[].mileage` | `InventoryVehicle.mileage` | non-negative `number \| null` |
| `lots[].status` | `InventoryVehicle.status` | `in_stock` \| `in_transit` \| `sold` |
| `lots[].price` | `InventoryVehicle.price` | non-negative `number \| null` |
| `lots[].priceProvenance` | `InventoryVehicle.priceProvenance` | `string \| null` (how the figure was sourced) |
| `lots[].imageUrl` | `InventoryVehicle.imageUrl` | `string \| null` |
| `lots[].location` | `InventoryVehicle.location` | Non-empty dealership / lot label |

Contract fixtures (valid + missing `lots` + bad VINs) live under
`src/lib/providers/fixtures/` and are exercised by `src/lib/providers/inventory.test.ts`.
Invalid payloads throw `InventoryFeedContractError` with a message that starts with
`Inventory feed contract violation:` and names the failing path.

Remaining credentials required to go live with lot inventory / offers / mail:

1. Documented inventory feed URL + auth token + VIN-level JSON contract (above)
2. Documented incentives feed + region/dealer applicability rules
3. Transactional email provider (Resend / SES / SendGrid) API key and from-address
4. Optional: CDK / DealerSocket scheduling API documentation
