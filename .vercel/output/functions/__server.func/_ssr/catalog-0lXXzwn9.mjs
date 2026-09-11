import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-0lXXzwn9.js
/**
* Dealership identity — only facts verified from public Toyota / Hendrick sources.
*
* Address + general phone: Toyota.com dealer directory for Hendrick Toyota Merriam
* (https://www.toyota.com/dealers/kansas/merriam/66203/hendrick-toyota-merriam/, observed 2026-09-03).
* Hours: same Toyota.com directory snapshot. Hours change on holidays; always confirm
* with the dealer. Official site: https://www.hendricktoyotamerriam.com
*
* No employee names, inventory counts, offers, or service prices are recorded here.
*/
var DEALER = {
	name: "Hendrick Toyota Merriam",
	legalName: "Hendrick Toyota Merriam",
	group: "Hendrick Automotive Group",
	address: {
		street: "9505 W. 67th Street",
		city: "Merriam",
		state: "KS",
		zip: "66203",
		country: "US"
	},
	geo: {
		lat: 39.0056,
		lng: -94.6925,
		precision: "approximate"
	},
	phone: {
		general: "(913) 831-0800",
		generalTel: "+19138310800"
	},
	website: "https://www.hendricktoyotamerriam.com",
	toyotaDealerDirectory: "https://www.toyota.com/dealers/kansas/merriam/66203/hendrick-toyota-merriam/",
	mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=9505+W+67th+Street+Merriam+KS+66203",
	osmEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=-94.7025%2C38.9956%2C-94.6825%2C39.0156&layer=mapnik&marker=39.0056%2C-94.6925",
	hoursSource: "Toyota.com dealer directory, observed 2026-09-03. Confirm before visiting.",
	hours: {
		sales: [
			{
				day: "Sunday",
				opens: "12:00",
				closes: "18:00"
			},
			{
				day: "Monday",
				opens: "09:00",
				closes: "20:00"
			},
			{
				day: "Tuesday",
				opens: "09:00",
				closes: "20:00"
			},
			{
				day: "Wednesday",
				opens: "09:00",
				closes: "20:00"
			},
			{
				day: "Thursday",
				opens: "09:00",
				closes: "20:00"
			},
			{
				day: "Friday",
				opens: "09:00",
				closes: "20:00"
			},
			{
				day: "Saturday",
				opens: "09:00",
				closes: "19:00"
			}
		],
		service: [
			{
				day: "Sunday",
				opens: null,
				closes: null
			},
			{
				day: "Monday",
				opens: "07:00",
				closes: "18:00"
			},
			{
				day: "Tuesday",
				opens: "07:00",
				closes: "18:00"
			},
			{
				day: "Wednesday",
				opens: "07:00",
				closes: "18:00"
			},
			{
				day: "Thursday",
				opens: "07:00",
				closes: "18:00"
			},
			{
				day: "Friday",
				opens: "07:00",
				closes: "18:00"
			},
			{
				day: "Saturday",
				opens: "07:00",
				closes: "18:00"
			}
		],
		parts: [
			{
				day: "Sunday",
				opens: null,
				closes: null
			},
			{
				day: "Monday",
				opens: "08:00",
				closes: "18:00"
			},
			{
				day: "Tuesday",
				opens: "08:00",
				closes: "18:00"
			},
			{
				day: "Wednesday",
				opens: "08:00",
				closes: "18:00"
			},
			{
				day: "Thursday",
				opens: "08:00",
				closes: "18:00"
			},
			{
				day: "Friday",
				opens: "08:00",
				closes: "18:00"
			},
			{
				day: "Saturday",
				opens: "09:00",
				closes: "18:00"
			}
		]
	}
};
var CATALOG_DISCLAIMER = "Prices, MPG, horsepower, and equipment shown are representative catalog figures from this project’s vehicle database. They are not live Toyota.com quotes, not advertised selling prices, and not a commitment from Hendrick Toyota Merriam. Confirm current MSRP, availability, and incentives with the dealership.";
var FINANCE_DISCLAIMER = "Payment estimates are mathematical illustrations using the numbers you enter. They are not an offer of credit, not a guaranteed payment, and not a Toyota or dealer finance rate. Actual terms depend on credit approval, lender, taxes, fees, and incentives. Hendrick Toyota Merriam will provide a real quote on request.";
var INVENTORY_UNAVAILABLE = "Live new- and used-vehicle inventory is not connected. This site does not display fabricated stock, VINs, or dealer prices. Call Hendrick Toyota Merriam or visit the official dealer website to check what is on the lot.";
var OFFERS_UNAVAILABLE = "Current Toyota and dealer offers are not connected to a live incentives feed. This site will not display expired, guessed, or invented APR, lease, or rebate figures. Ask the dealership for current programs that apply to you.";
function formatHour(opens, closes) {
	if (!opens || !closes) return "Closed";
	return `${to12(opens)} – ${to12(closes)}`;
}
function to12(hhmm) {
	const [hStr, mStr] = hhmm.split(":");
	const h = Number(hStr);
	const m = Number(mStr);
	const ampm = h >= 12 ? "PM" : "AM";
	const hr = h % 12 === 0 ? 12 : h % 12;
	return m === 0 ? `${hr} ${ampm}` : `${hr}:${mStr} ${ampm}`;
}
function formatAddress() {
	const a = DEALER.address;
	return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "GET" }).handler(createSsrRpc("ce378d12d327ce498bfc01e15c9ffec2dd60dbd60d4ff247260c098a929233ef"));
createServerFn({ method: "GET" }).validator((input) => object({ slug: string() }).parse(input)).handler(createSsrRpc("52641cd014b404ebb7da25f2ab45f12592e0e8365e7b83365d725c50bf72245f"));
var searchSite = createServerFn({ method: "GET" }).validator((input) => object({ q: string().trim().max(80) }).parse(input)).handler(createSsrRpc("97170a1dee98c5afeb0b424d6192c16a32242cba0bfbf4536fbd689f201cff4a"));
var getInventoryState = createServerFn({ method: "GET" }).handler(createSsrRpc("e98fd230fc2bdceac680c5b4f01ed2e4312ab70a7e60561a46632186273b76c1"));
var getOffersState = createServerFn({ method: "GET" }).handler(createSsrRpc("24f56f854d39be8ca8dcecf1958adc6147871741e6b963faee5470a32cdfaf1f"));
//#endregion
export { OFFERS_UNAVAILABLE as a, formatHour as c, searchSite as d, INVENTORY_UNAVAILABLE as i, getInventoryState as l, DEALER as n, createSsrRpc as o, FINANCE_DISCLAIMER as r, formatAddress as s, CATALOG_DISCLAIMER as t, getOffersState as u };
