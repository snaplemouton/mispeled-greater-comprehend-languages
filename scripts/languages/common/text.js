// scripts/languages/common/text.js
export function isLetter(ch) {
	const c = ch?.charCodeAt?.(0);
	return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
}

export function isUpper(ch) {
	const c = ch?.charCodeAt?.(0);
	return c >= 65 && c <= 90;
}

export function countLetters(str) {
	let n = 0;
	const s = String(str ?? "");
	for (let i = 0; i < s.length; i++) {
		if (isLetter(s[i])) n++;
	}
	return n;
}

export function pick(arr, rng) {
	return arr[Math.floor(rng() * arr.length)];
}

export function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}

export function applyCasingToWord(original, builtLetters) {
	// Applies original casing to built letters, skipping apostrophes in builtLetters.
	const resultChars = String(original ?? "").split("");
	let ptr = 0;

	for (let i = 0; i < resultChars.length; i++) {
		const ch = resultChars[i];
		if (!isLetter(ch)) continue;

		while (builtLetters[ptr] === "'") ptr++;

		const repl = builtLetters[ptr] ?? ch;
		resultChars[i] = isUpper(ch) ? repl.toUpperCase() : repl.toLowerCase();
		ptr++;
	}

	return resultChars.join("");
}
