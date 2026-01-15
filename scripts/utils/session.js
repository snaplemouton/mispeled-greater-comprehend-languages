// scripts/utils/session.js
// Session-only cache (resets on refresh/reload)
const warnedMissingCharacterUserIds = new Set();

export function shouldWarnMissingCharacter(userId) {
	if (!userId) return false;
	return !warnedMissingCharacterUserIds.has(userId);
}

export function markMissingCharacterWarned(userId) {
	if (!userId) return;
	warnedMissingCharacterUserIds.add(userId);
}
