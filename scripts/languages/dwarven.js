// scripts/languages/dwarven.js
import { tokenizeWords } from "./common/tokenize.js";
import { makeRng } from "./common/rng.js";
import { pick, clamp, countLetters, applyCasingToWord, isLetter } from "./common/text.js";

const DWARVEN_TWO_LETTER_SYLLABLES = [
	"kh", "gr", "kr", "dr", "br", "th", "ga", "ka", "du", "or"
];

export function dwarvenGibberish(text, { seed = "" } = {}) {
	const src = String(text ?? "");
	const tokens = tokenizeWords(src);

	let out = "";
	for (const t of tokens) {
		if (t.type === "word") out += dwarvenWord(t.value, seed);
		else out += t.value;
	}

	return out;
}

function dwarvenWord(word, seed) {
	const original = String(word ?? "");

	let base = "";
	for (let i = 0; i < original.length; i++) {
		if (isLetter(original[i])) base += original[i];
	}

	// 1-letter words: keep as-is
	if (base.length <= 1) return original;

	// 2-letter words: dwarven-flavored syllable
	if (base.length === 2) return dwarvenTwoLetterWord(original, base, seed);

	const rng = makeRng(`${seed}|dwarven|${base.toLowerCase()}`);

	// Dwarven feel: hard consonants, clustered starts, rolled r, lots of k/g/d/th/gr/kh
	const ONSETS = ["b", "d", "g", "k", "m", "n", "r", "t", "v", "z", "th", "kh", "gr", "kr", "dr", "br", "st", "sk"];
	const VOWELS = ["a", "o", "u", "e", "i", "aa", "oo"];
	const CODAS = ["k", "g", "d", "n", "r", "m", "t", "z", "th", "rk", "rg", "nd", "mt", "sk"];

	const syllables = clamp(Math.round(base.length / 3.2), 2, 5);

	let built = "";
	for (let s = 0; s < syllables; s++) {
		const onset = pick(ONSETS, rng);
		const vowel = pick(VOWELS, rng);

		const codaChance = (s >= syllables - 2) ? 0.75 : 0.45;
		const coda = (rng() < codaChance) ? pick(CODAS, rng) : "";

		built += onset + vowel + coda;

		// Rare separators (dwarven prefers solidity over flow)
		if (rng() < 0.06 && s < syllables - 1) built += "-";
	}

	// Normalize letters to match original letter count (ignore '-' in count)
	const targetLen = countLetters(original);
	built = normalizeLetterLength(built, targetLen, rng);

	return applyCasingToWord(original, built);
}

function dwarvenTwoLetterWord(original, base, seed) {
	const rng = makeRng(`${seed}|dwarven|2|${base.toLowerCase()}`);
	const picked = pick(DWARVEN_TWO_LETTER_SYLLABLES, rng);
	return applyCasingToWord(original, picked);
}

function normalizeLetterLength(s, targetLetters, rng) {
	const source = String(s ?? "");
	const chars = [];

	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		// Keep hyphens as separators; keep letters for sizing
		if (isLetter(ch) || ch === "-") chars.push(ch);
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

	const PAD = ["a", "o", "u", "e", "i", "k", "g", "d", "r", "n", "t"];
	while (letterCount < targetLetters) {
		chars.push(pick(PAD, rng));
		letterCount++;
	}

	return chars.join("");
}