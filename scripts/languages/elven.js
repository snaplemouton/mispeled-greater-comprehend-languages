// scripts/languages/elven.js
import { tokenizeWords } from "./common/tokenize.js";
import { makeRng } from "./common/rng.js";
import { pick, clamp, countLetters, applyCasingToWord, isLetter } from "./common/text.js";

const ELVEN_TWO_LETTER_SYLLABLES = [
	"ae", "ia", "li", "na", "va", "re", "sa", "el", "il", "fa"
];

export function elvenGibberish(text, { seed = "" } = {}) {
	const src = String(text ?? "");
	const tokens = tokenizeWords(src);

	let out = "";
	for (const t of tokens) {
		if (t.type === "word") out += elvenWord(t.value, seed);
		else out += t.value;
	}

	return out;
}

function elvenWord(word, seed) {
	const original = String(word ?? "");

	// Letter-only base for seed + size decisions
	let base = "";
	for (let i = 0; i < original.length; i++) {
		if (isLetter(original[i])) base += original[i];
	}

	// 1-letter words: keep as-is
	if (base.length <= 1) return original;

	// 2-letter words: elven-flavored syllable
	if (base.length === 2) return elvenTwoLetterWord(original, base, seed);

	const rng = makeRng(`${seed}|elven|${base.toLowerCase()}`);

	const ONSETS = ["l", "v", "s", "n", "r", "m", "th", "sh", "h", "f"];
	const VOWELS = ["a", "e", "i", "o", "u", "y", "ae", "ia", "ui", "ei"];
	const CODAS = ["l", "n", "r", "s", "th", "sh", "m", "n", "l", "r"];

	const syllables = clamp(Math.round(base.length / 3), 2, 5);

	let built = "";
	for (let s = 0; s < syllables; s++) {
		const onset = pick(ONSETS, rng);
		const vowel = pick(VOWELS, rng);
		const coda = (rng() < (s >= syllables - 2 ? 0.65 : 0.35)) ? pick(CODAS, rng) : "";

		built += onset + vowel + coda;

		// Occasional apostrophe (never at the ends)
		if (rng() < 0.22 && s < syllables - 1) built += "'";
	}

	const targetLen = countLetters(original);
	built = normalizeLetterLength(built, targetLen, rng);

	return applyCasingToWord(original, built);
}

function elvenTwoLetterWord(original, base, seed) {
	const rng = makeRng(`${seed}|elven|2|${base.toLowerCase()}`);
	const picked = pick(ELVEN_TWO_LETTER_SYLLABLES, rng);
	return applyCasingToWord(original, picked);
}

function normalizeLetterLength(s, targetLetters, rng) {
	const source = String(s ?? "");
	const chars = [];

	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		if (isLetter(ch) || ch === "'") chars.push(ch);
	}

	let letterCount = 0;
	for (const ch of chars) {
		if (isLetter(ch)) letterCount++;
	}

	while (letterCount > targetLetters) {
		for (let i = chars.length - 1; i >= 0 && letterCount > targetLetters; i--) {
			if (!isLetter(chars[i])) continue;
			chars.splice(i, 1);
			letterCount--;
		}
	}

	const PAD = ["a", "e", "i", "l", "n", "r", "s", "v", "h"];
	while (letterCount < targetLetters) {
		chars.push(pick(PAD, rng));
		letterCount++;
	}

	return chars.join("");
}