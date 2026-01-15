// scripts/utils/systems/pf1.js
import { normalizeLanguageName } from "../strings.js";

export function getActorKnownLanguages(actor) {
	const raw = actor?.system?.traits?.languages?.total;

	// PF1 stores languages as a Set<string>
	if (raw instanceof Set) {
		return Array.from(raw)
			.map((x) => String(x ?? "").trim())
			.filter((x) => x.length > 0);
	}

	// Unexpected shape: warn loudly, then do minimal fallback
	console.warn(
		"Mispeled's GCL | PF1 expected actor.system.traits.languages.total to be a Set, got:",
		raw
	);

	if (Array.isArray(raw)) {
		return raw
			.map((x) => String(x ?? "").trim())
			.filter((x) => x.length > 0);
	}

	if (typeof raw === "string") {
		return raw
			.split(",")
			.map((x) => x.trim())
			.filter((x) => x.length > 0);
	}

	return [];
}

export function actorKnowsLanguage(actor, language) {
	const target = normalizeLanguageName(language);
	if (!target) return false;

	const known = getActorKnownLanguages(actor);

	for (const k of known) {
		const canon = normalizeLanguageName(k);
		if (!canon) continue;

		if (canon.toLowerCase() === target.toLowerCase()) return true;
	}

	return false;
}

export function debugActorLanguages(actor, targetLanguage) {
	const raw = actor?.system?.traits?.languages?.total;
	const known = getActorKnownLanguages(actor);
	const normalized = known
		.map((l) => normalizeLanguageName(l))
		.filter((x) => !!x);

	return {
		rawLanguages: raw,
		knownLanguages: known,
		normalizedKnownLanguages: normalized,
		targetLanguage: normalizeLanguageName(targetLanguage)
	};
}
