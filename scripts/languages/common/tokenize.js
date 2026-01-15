// scripts/languages/common/tokenize.js
import { isLetter } from "./text.js";

export function tokenizeWords(str) {
	const s = String(str ?? "");
	const tokens = [];
	let i = 0;

	while (i < s.length) {
		const ch = s[i];

		if (isLetter(ch)) {
			let j = i + 1;

			while (j < s.length) {
				const c = s[j];
				if (isLetter(c) || c === "'") {
					j++;
					continue;
				}
				break;
			}

			tokens.push({ type: "word", value: s.slice(i, j) });
			i = j;
			continue;
		}

		tokens.push({ type: "other", value: ch });
		i++;
	}

	return tokens;
}
