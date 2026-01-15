// scripts/languages/defaultGibberish.js
import { tokenizeWords } from "./common/tokenize.js";
import { makeRng } from "./common/rng.js";
import { isLetter, pick, applyCasingToWord } from "./common/text.js";

const TWO_LETTER_SYLLABLES = ["va", "ta", "na", "en", "il", "ra", "sa", "lo", "vi"];

export function defaultGibberish(text, { seed = "" } = {}) {
	const src = String(text ?? "");
	const tokens = tokenizeWords(src);

	let out = "";
	for (const t of tokens) {
		if (t.type === "word") out += gibberishWord(t.value, seed);
		else out += t.value;
	}

	return out;
}

function gibberishWord(word, seed) {
	const original = String(word ?? "");

	// Build a letter-only base (apostrophes ignored)
	let base = "";
	for (let i = 0; i < original.length; i++) {
		const ch = original[i];
		if (isLetter(ch)) base += ch;
	}

	// 1-letter words: keep as-is
	if (base.length <= 1) return original;

	// 2-letter words: replace with flavored syllable
	if (base.length === 2) return gibberishTwoLetterWord(original, base, seed);

	const rng = makeRng(`${seed}|default|${base.toLowerCase()}`);

	const VOWELS = ["a", "e", "i", "o", "u", "y"];
	const CONS = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z"];
	const CLUSTERS = ["th", "sh", "ch", "ph", "kr", "gr", "dr", "tr", "vr", "zl", "sk", "st", "sp"];

	let built = "";
	let idx = 0;

	while (idx < base.length) {
		const lower = base[idx].toLowerCase();
		const wantVowel = isVowel(lower);

		if (!wantVowel && base.length - idx >= 2 && rng() < 0.18) {
			const cluster = pick(CLUSTERS, rng);
			built += cluster;
			idx += 2;
			continue;
		}

		built += wantVowel ? pick(VOWELS, rng) : pick(CONS, rng);
		idx++;
	}

	built = normalizeLength(built, base.length, rng);

	// Apply original casing/punctuation pattern to the built letters
	return applyCasingToWord(original, built);
}

function gibberishTwoLetterWord(original, base, seed) {
	const rng = makeRng(`${seed}|default|2|${base.toLowerCase()}`);
	const picked = pick(TWO_LETTER_SYLLABLES, rng);
	return applyCasingToWord(original, picked);
}

function normalizeLength(s, targetLen, rng) {
	let out = String(s ?? "");

	if (out.length > targetLen) out = out.slice(0, targetLen);

	const VOWELS = ["a", "e", "i", "o", "u", "y"];
	const CONS = ["l", "n", "r", "s", "t", "v", "m", "k"];

	while (out.length < targetLen) {
		const last = out[out.length - 1] ?? "a";
		const addVowel = !isVowel(String(last).toLowerCase());
		out += addVowel ? pick(VOWELS, rng) : pick(CONS, rng);
	}

	return out;
}

function isVowel(ch) {
	const c = String(ch ?? "").toLowerCase();
	return c === "a" || c === "e" || c === "i" || c === "o" || c === "u" || c === "y";
}
