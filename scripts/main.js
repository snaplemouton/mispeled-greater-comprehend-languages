// scripts/main.js
import { MODULE_ID, MODULE_PATH, STATUS_EFFECT_IDS } from "./constants.js";
import { handleBclCommand } from "./commands/bcl.js";
import { handleGclCommand } from "./commands/gcl.js";

Hooks.once("init", () => {
	console.log(`${MODULE_ID} | Initializing`);

	const bclStatus = {
		id: STATUS_EFFECT_IDS.BCL,
		name: "Comprehend Languages",
		icon: `${MODULE_PATH}/icons/comprehend-languages.png`
	};

	CONFIG.statusEffects = [...(CONFIG.statusEffects ?? []), bclStatus];
});

Hooks.on("chatMessage", (chatLog, messageText, chatData) => {
	const text = (messageText ?? "").trim();
	if (!text.startsWith("/")) return;

	const [command, ...args] = text.slice(1).split(/\s+/);
	const cmd = command.toLowerCase();

	switch (cmd) {
		case "bcl":
			handleBclCommand({ raw: text, args, chatLog, chatData }).catch(handleCommandError("bcl"));
			return false;

		case "gcl":
			handleGclCommand({ raw: text, args, chatLog, chatData }).catch(handleCommandError("gcl"));
			return false;

		default:
			return;
	}
});

function handleCommandError(command) {
	return (err) => {
		console.error(`${MODULE_ID} | /${command} failed`, err);
	};
}
