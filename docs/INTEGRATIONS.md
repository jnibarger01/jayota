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

Remaining credentials required to go live with lot inventory / offers / mail:

1. Documented inventory feed URL + auth token + VIN-level JSON contract
2. Documented incentives feed + region/dealer applicability rules
3. Transactional email provider (Resend / SES / SendGrid) API key and from-address
4. Optional: CDK / DealerSocket scheduling API documentation
