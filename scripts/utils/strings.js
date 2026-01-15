// scripts/utils/strings.js
const LANGUAGE_ALIASES = new Map([
	["abyss", "Abyssal"],
	["aqua", "Aquan"],
	["aura", "Auran"],
	["dark", "Dark Folk"],
	["dragon", "Draconic"],
	["drow sign", "Drow Sign Language"],
	["druid", "Druidic"],
	["dwarf", "Dwarven"],
	["dwarvish", "Dwarven"],
	["elf", "Elven"],
	["elvish", "Elven"],
	["gnomish", "Gnome"],
	["devil", "Infernal"],
	["undead", "Necril"],
	["orcish", "Orc"],
	["fey", "Sylvan"],
	["terra", "Terran"],
	["under", "Undercommon"]
]);

export function normalizeLanguageName(input) {
	const raw = String(input ?? "").trim();
	if (!raw.length) return "";

	// Normalize whitespace + case for lookup only
	const key = toLookupKey(raw);

	// Apply alias if present, otherwise title-case the original-ish input
	const mapped = LANGUAGE_ALIASES.get(key);
	if (mapped) return mapped;

	// If user typed the full language already (any casing), keep it but clean spacing
	return normalizeSpacing(raw);
}

function toLookupKey(str) {
	return normalizeSpacing(str).toLowerCase();
}

function normalizeSpacing(str) {
	return String(str ?? "").trim().replace(/\s+/g, " ");
}
