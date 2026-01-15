// scripts/commands/bcl.js
import { MODULE_ID, STATUS_EFFECT_IDS } from "../constants.js";
import { isBclEffect, buildBclEffectData } from "../effects/comprehendLanguagesEffect.js";

export async function handleBclCommand({ raw, args, chatLog, chatData }) {
	const token = canvas?.tokens?.controlled?.[0];
	if (!token) {
		ui.notifications?.warn("Select a token first to toggle Comprehend Languages.");
		return;
	}

	const actor = token.actor;
	if (!actor) {
		ui.notifications?.error("Selected token has no actor.");
		return;
	}

	if (!actor.isOwner) {
		ui.notifications?.warn("You don't have permission to modify this actor.");
		return;
	}

	const existing = actor.statuses?.has(STATUS_EFFECT_IDS.BCL);

	if (existing) {
		await actor.toggleStatusEffect(STATUS_EFFECT_IDS.BCL, { active: false });

		ui.notifications?.info(`Comprehend Languages removed from: ${actor.name}`);
		console.log(`${MODULE_ID} | /bcl OFF for actor: ${actor.name}`);
		return;
	}

	await actor.toggleStatusEffect(STATUS_EFFECT_IDS.BCL, { active: true });

	ui.notifications?.info(`Comprehend Languages applied to: ${actor.name}`);
	console.log(`${MODULE_ID} | /bcl ON for actor: ${actor.name}`);
}
