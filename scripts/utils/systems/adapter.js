// scripts/utils/systems/adapter.js
import * as PF1 from "./pf1.js";

export function getSystemAdapter() {
	const systemId = game?.system?.id ?? "";

	switch (systemId) {
		case "pf1":
			return PF1;

		default:
			console.warn(`Mispeled's GCL | Unsupported system "${systemId}". Language checks will always return false.`);
			return FALLBACK_ADAPTER;
	}
}

const FALLBACK_ADAPTER = {
	getActorKnownLanguages(actor) {
		return [];
	},

	actorKnowsLanguage(actor, language) {
		return false;
	},

	debugActorLanguages(actor, targetLanguage) {
		return {
			rawLanguages: null,
			knownLanguages: [],
			normalizedKnownLanguages: [],
			targetLanguage: String(targetLanguage ?? "")
		};
	}
};
