import {isArray, isObject, isString, keys} from 'remeda';
import lang, {
	EN_DATA_NOT_OBJECT, EN_FIELD_IS_NOT_ARRAY,
	EN_FIELD_IS_NOT_STRING_ARRAY, EN_OPTION_INVALID_TYPE,
	EN_OPTION_MISSING_FIELD, EN_OPTION_NON_STRING_FIELD,
	EN_PRESET_NOT_ARRAY, EN_OPTION_DATA_NOT_OBJECT,
} from '../lang';
import type {Result} from './types';

const VALID_OPTION_KEYS = ['name', 'type', 'display', 'value'];
const VALID_OPTION_TYPES = ['color', 'image'];

const error = (message: string): Result => ({
	type: 'error',
	message,
});

const validateOption = (data: unknown, index: number): Result => {
	if (!isObject(data)) {
		return error(lang(EN_OPTION_DATA_NOT_OBJECT, {index: `${index}`}));
	}

	for (let i = 0; i < VALID_OPTION_KEYS.length; i++) {
		const value = data[VALID_OPTION_KEYS[i]];

		if (value === undefined) {
			return error(lang(EN_OPTION_MISSING_FIELD, {index: `${index}`, field: VALID_OPTION_KEYS[i]}));
		}

		if (!isString(value)) {
			return error(lang(EN_OPTION_NON_STRING_FIELD, {index: `${index}`, field: VALID_OPTION_KEYS[i]}));
		}
	}

	if (isString(data.type) && !VALID_OPTION_TYPES.includes(data.type)) {
		return error(lang(EN_OPTION_INVALID_TYPE, {index: `${index}`, type: data.type}));
	}

	return {
		type: 'success',
	};
};

const validatePresetsConfig = (data: unknown): Result => {
	if (!isObject(data)) {
		return error(lang(EN_DATA_NOT_OBJECT, {field: 'Preset'}));
	}

	const presets = keys(data);

	for (let i = 0; i < presets.length; i++) {
		const preset = data[presets[i]];

		if (!isArray(preset)) {
			return error(lang(EN_PRESET_NOT_ARRAY, {index: `${i}`}));
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
		return error(lang(EN_DATA_NOT_OBJECT, {field: 'Config'}));
	}

	if (data.extends !== undefined && !isArray(data.extends)) {
		return error(lang(EN_FIELD_IS_NOT_ARRAY, {field: 'Extends'}));
	}

	if (data.extends !== undefined && isArray(data.extends) && !data.extends.every(isString)) {
		return error(lang(EN_FIELD_IS_NOT_STRING_ARRAY, {field: 'Extends'}));
	}

	if (data.options !== undefined && !isArray(data.options)) {
		return error(lang(EN_FIELD_IS_NOT_ARRAY, {field: 'Options'}));
	}

	if (data.options !== undefined && isArray(data.options)) {
		for (let i = 0; i < data.options.length; i++) {
			const element = data.options[i];
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
