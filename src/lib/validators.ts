import {isArray, isObject, isString, keys} from 'remeda';
import type {Result} from './types';

const VALID_PREFAB_KEYS = ['name', 'type', 'display', 'value'];
const VALID_PREFAB_TYPES = ['color', 'image'];

const error = (message: string): Result => ({
	type: 'error',
	message,
});

const validateOption = (data: unknown, index: number): Result => {
	if (!isObject(data)) {
		return error('Option data is not an object');
	}

	for (let i = 0; i < VALID_PREFAB_KEYS.length; i++) {
		const value = data[VALID_PREFAB_KEYS[i]];

		if (value === undefined) {
			return error(`Option at position ${index} is missing the [${VALID_PREFAB_KEYS[i]}] field`);
		}

		if (!isString(value)) {
			return error(`Option at position ${index} has a non-string [${VALID_PREFAB_KEYS[i]}] field`);
		}
	}

	if (!VALID_PREFAB_TYPES.includes(data.type as string)) {
		return error(`Option at position ${index} has an invalid type of "${data.type as string}"`);
	}

	return {
		type: 'success',
	};
};

const validatePresetsConfig = (data: unknown): Result => {
	if (!isObject(data)) {
		return error('Presets data is not an object');
	}

	const presets = keys(data);

	for (let i = 0; i < presets.length; i++) {
		const preset = data[presets[i]];

		if (!isArray(preset)) {
			return error(`Preset at position ${i} is not an array`);
		}

		for (let j = 0; j < preset.length; j++) {
			const element = preset[j];

			const result = validateOption(element, j);

			if (result.type === 'error') {
				return result;
			}
		}
	}

	return {
		type: 'success',
	};
};

const validateFieldConfig = (data: unknown): Result => {
	if (!isObject(data)) {
		return error('Config data is not an object');
	}

	if (data.extends !== undefined && !isArray(data.extends)) {
		return error('[Extends] is not an array');
	}

	if (data.extends !== undefined && isArray(data.extends) && !data.extends.every(isString)) {
		return error('[Extends] is not an array of strings');
	}

	if (data.prefabs !== undefined && !isArray(data.prefabs)) {
		return error('[Options] is not an array');
	}

	if (data.prefabs !== undefined && isArray(data.prefabs)) {
		for (let i = 0; i < data.prefabs.length; i++) {
			const element = data.prefabs[i];
			const result = validateOption(element, i);

			if (result.type === 'error') {
				return result;
			}
		}
	}

	return {
		type: 'success',
	};
};

export {
	validatePresetsConfig,
	validateOption,
	validateFieldConfig,
};
