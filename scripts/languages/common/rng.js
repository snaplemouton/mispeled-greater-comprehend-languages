// scripts/languages/common/rng.js
export function makeRng(seedStr) {
	let h = fnv1a(String(seedStr ?? "")) >>> 0;

	return () => {
		h ^= h << 13;
		h ^= h >>> 17;
		h ^= h << 5;
		return ((h >>> 0) / 4294967296);
	};
}

function fnv1a(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}