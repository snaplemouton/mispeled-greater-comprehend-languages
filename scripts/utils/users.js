// scripts/utils/users.js
export function getNonGmUsers() {
	return (game.users?.contents ?? []).filter((u) => !u.isGM);
}

export function getGmUsers() {
	return (game.users?.contents ?? []).filter((u) => u.isGM);
}

export function getPlayerCharacterActor(user) {
	return user?.character ?? null;
}
