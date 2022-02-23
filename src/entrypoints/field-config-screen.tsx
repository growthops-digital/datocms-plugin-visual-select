import {useState, useCallback} from 'react';
import {isString} from 'remeda';
import type {RenderManualFieldExtensionConfigScreenCtx} from 'datocms-plugin-sdk';
import {Canvas} from 'datocms-react-ui';
import {validateFieldConfig} from '../lib/validators';
import {JsonTextarea} from '../components';
import type {Result} from '../lib/types';
import {EMPTY_LENGTH, JSON_INDENT_SIZE} from '../constants';

type FieldConfigScreenProps = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type Parameters = {
	collection: string;
};

const createInitialParameters = (
	ctx: RenderManualFieldExtensionConfigScreenCtx,
	parameters: Record<string, unknown>,
): Parameters => {
	if (isString(parameters.collection) && parameters.collection.length > EMPTY_LENGTH) {
		return {
			collection: parameters.collection,
		};
	}

	const initialParameters = {
		collection: JSON.stringify({
			extends: [],
			options: [],
		}, null, JSON_INDENT_SIZE),
	};

	ctx.setParameters(initialParameters);

	return initialParameters;
};

const formatParameters = (parameters: Parameters): Parameters => {
	const rawJson = parameters.collection;

	return {
		collection: JSON.stringify(JSON.parse(rawJson), null, JSON_INDENT_SIZE),
	};
};

const FieldConfigScreen = ({ctx}: FieldConfigScreenProps): JSX.Element => {
	const [state, setState] = useState<Parameters>(createInitialParameters(ctx, ctx.parameters));
	const [lastValidState, setLastValidState] = useState<Parameters>(state);

	const handleOnChange = useCallback((value: string) => {
		const newState = {
			collection: value,
		};

		setState(newState);
		setLastValidState(newState);

		ctx.setParameters(formatParameters(newState));
	}, []);

	const handleOnError = useCallback((_result: Result) => {
		ctx.setParameters(lastValidState);
	}, []);

	return (
		<Canvas ctx={ctx}>
			<JsonTextarea
				label="Field Configuration"
				initialValue={state.collection}
				validate={validateFieldConfig}
				onValidChange={handleOnChange}
				onError={handleOnError}
			/>
		</Canvas>
	);
};

export default FieldConfigScreen;
