import {useState, useCallback} from 'react';
import type {RenderManualFieldExtensionConfigScreenCtx} from 'datocms-plugin-sdk';
import {Canvas} from 'datocms-react-ui';
import {validateFieldConfig} from '../lib/validators';
import {JsonTextarea} from '../components';
import type {Result} from '../lib/types';

type FieldConfigScreenProps = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type Parameters = {
	collection: string;
};

const FieldConfigScreen = ({ctx}: FieldConfigScreenProps): JSX.Element => {
	const [state, setState] = useState<Parameters>(ctx.parameters as Parameters);
	const [lastValidState, setLastValidState] = useState<Parameters>(ctx.parameters as Parameters);

	const handleOnChange = useCallback((value: string) => {
		const newState = {
			collection: value,
		};

		setState(newState);
		setLastValidState(newState);

		ctx.setParameters(newState);
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
