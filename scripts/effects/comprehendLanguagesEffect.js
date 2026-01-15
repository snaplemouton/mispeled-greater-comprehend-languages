// scripts/effects/comprehendLanguagesEffect.js
import { MODULE_ID, MODULE_PATH } from "../constants.js";

export const BCL_EFFECT_KEY = "bcl";

export function isBclEffect(effect) {
	return effect?.flags?.[MODULE_ID]?.key === BCL_EFFECT_KEY;
}

export function buildBclEffectData({ iconPath } = {}) {
    const icon = iconPath || `${MODULE_PATH}/icons/comprehend-languages.png`;

	return {
        name: "Comprehend Languages",
		label: "Comprehend Languages",
		icon,
		disabled: false,
		origin: "",
		duration: {},
		changes: [],
		flags: {
			[MODULE_ID]: {
				key: BCL_EFFECT_KEY
			}
		}
	};
}