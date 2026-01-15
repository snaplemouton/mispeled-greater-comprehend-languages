// scripts/commands/gcl.js
import { MODULE_ID, STATUS_EFFECT_IDS } from "../constants.js";
import { normalizeLanguageName } from "../utils/strings.js";
import { getSystemAdapter } from "../utils/systems/adapter.js";
import { shouldWarnMissingCharacter, markMissingCharacterWarned } from "../utils/session.js";
import { getNonGmUsers, getGmUsers, getPlayerCharacterActor } from "../utils/users.js";

import { defaultGibberish } from "../languages/default.js";
import { elvenGibberish } from "../languages/elven.js";
import { dwarvenGibberish } from "../languages/dwarven.js";

export async function handleGclCommand({ raw, args, chatLog, chatData }) {
	const parsed = parseGclRaw(raw);

	if (!parsed) {
		ui.notifications?.warn("Usage: /gcl <language> <message...>  OR  /gcl <language> :: <message...>  OR  /gcl \"multi word language\" <message...>");
		return;
	}

	const { languageRaw, messageRaw } = parsed;
	const language = normalizeLanguageName(languageRaw);
	const adapter = getSystemAdapter();

	const { text: messageForGibberish, restore } = extractProtectedSegments(messageRaw);

	const seed = `${game.userId}|${language.toLowerCase()}`;

	let gibbered;
	switch (language) {
		case "Elven":
			gibbered = elvenGibberish(messageForGibberish, { seed });
			break;

		case "Dwarven":
			gibbered = dwarvenGibberish(messageForGibberish, { seed });
			break;

		default:
			gibbered = defaultGibberish(messageForGibberish, { seed });
			break;
	}

	const publicContent = restore(gibbered);

	// Post public gibberish message
	await ChatMessage.create({
		content: publicContent,
		speaker: ChatMessage.getSpeaker()
	});

	// Build whisper recipients and send cleartext whispers
	await whisperCleartextToEligibleUsers({
		adapter,
		language,
		originalMessage: messageRaw
	});

	console.log(`${MODULE_ID} | /gcl posted public + whispers in "${language}"`);
}

async function whisperCleartextToEligibleUsers({ adapter, language, originalMessage }) {
	const gmUsers = getGmUsers();
	const nonGmUsers = getNonGmUsers();

	const whisperUserIds = [];

	// GMs always receive the cleartext
	for (const u of gmUsers) {
		whisperUserIds.push(u.id);
	}

	// Non-GMs only if they have a character AND (know language OR have BCL)
	for (const u of nonGmUsers) {
		const actor = getPlayerCharacterActor(u);

		if (!actor) {
			if (shouldWarnMissingCharacter(u.id)) {
				markMissingCharacterWarned(u.id);
				notifyGmsMissingCharacter(u);
			}
			continue;
		}

        const hasBcl = actor.statuses?.has(STATUS_EFFECT_IDS.BCL);
		const knows = adapter.actorKnowsLanguage(actor, language);

		if (hasBcl || knows) {
			whisperUserIds.push(u.id);
		}
	}

	if (whisperUserIds.length === 0) return;

	const content = `[${language}] ${escapeHtml(originalMessage)}`;

	await ChatMessage.create({
		content,
		whisper: whisperUserIds,
		speaker: ChatMessage.getSpeaker()
	});
}

function notifyGmsMissingCharacter(user) {
	const gmUsers = getGmUsers();
	const gmIds = gmUsers.map((u) => u.id).filter((x) => !!x);
	if (gmIds.length === 0) return;

	const name = user?.name ?? "Unknown User";
	const content = `${MODULE_ID}: User "${escapeHtml(name)}" has no assigned character (User Configuration → Character).`;

	ChatMessage.create({
		content,
		whisper: gmIds,
		speaker: ChatMessage.getSpeaker()
	}).catch((err) => console.error(`${MODULE_ID} | missing character notify failed`, err));
}

function escapeHtml(str) {
	return String(str ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll("\"", "&quot;")
		.replaceAll("'", "&#039;");
}

function parseGclRaw(raw) {
	const text = (raw ?? "").trim();
	if (!text.toLowerCase().startsWith("/gcl")) return null;

	const after = text.slice(4).trim();
	if (!after.length) return null;

	const delimIndex = after.indexOf("::");
	if (delimIndex !== -1) {
		const languageRaw = after.slice(0, delimIndex).trim();
		const messageRaw = after.slice(delimIndex + 2).trim();
		if (!languageRaw || !messageRaw) return null;
		return { languageRaw, messageRaw };
	}

	if (after.startsWith("\"")) {
		const endQuote = findClosingQuote(after, 0);
		if (endQuote === -1) return null;

		const languageRaw = after.slice(1, endQuote).trim();
		const messageRaw = after.slice(endQuote + 1).trim();

		if (!languageRaw || !messageRaw) return null;
		return { languageRaw, messageRaw };
	}

	const parts = after.split(/\s+/);
	if (parts.length < 2) return null;

	const languageRaw = parts[0];
	const messageRaw = parts.slice(1).join(" ").trim();

	if (!languageRaw || !messageRaw) return null;
	return { languageRaw, messageRaw };
}

function findClosingQuote(str, startIndex) {
	for (let i = startIndex + 1; i < str.length; i++) {
		if (str[i] === "\"" && str[i - 1] !== "\\") return i;
	}
	return -1;
}

function extractProtectedSegments(text) {
	const source = text ?? "";
	const replacements = [];
	let idx = 0;

	const replaced = source.replace(/\{([^{}]+)\}/g, (match, inner) => {
		const key = `\uE000${idx}\uE001`;
		replacements.push([key, String(inner)]);
		idx++;
		return key;
	});

	return {
		text: replaced,
		restore: (outputText) => {
			let out = outputText ?? "";
			for (const [key, original] of replacements) {
				out = out.split(key).join(original);
			}
			return out;
		}
	};
}