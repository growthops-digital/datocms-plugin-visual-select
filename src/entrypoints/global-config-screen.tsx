import {useCallback, useState} from 'react';
import type {FormEvent} from 'react';
import {Canvas, FieldGroup, Button} from 'datocms-react-ui';
import type {RenderConfigScreenCtx} from 'datocms-plugin-sdk';
import {validatePresetsConfig} from '../lib/validators';
import {JsonTextarea} from '../components';
import type {Result} from '../lib/types';
import s from '../lib/styles.module.css';
import config from '../config';
import {JSON_INDENT_SIZE, MESSAGE_SETTINGS_UPDATED} from '../constants';

type GlobalConfigScreenProps = {
	ctx: RenderConfigScreenCtx;
};

type Parameters = {
	presets: string;
};

type State = {
	parameters: Parameters;
	valid: boolean;
};

const formatParameters = (parameters: Parameters): Parameters => {
	const rawJson = parameters.presets;

	return {
		presets: JSON.stringify(JSON.parse(rawJson), null, JSON_INDENT_SIZE),
	};
};

const GlobalConfigScreen = ({ctx}: GlobalConfigScreenProps): JSX.Element => {
	const [state, setState] = useState<State>({
		parameters: ctx.plugin.attributes.parameters as Parameters,
		valid: false,
	});

	const handleOnSubmit = useCallback(async (event: FormEvent) => {
		event.preventDefault();

		await ctx.updatePluginParameters(formatParameters(state.parameters));
		ctx.notice(MESSAGE_SETTINGS_UPDATED);
	}, [state]);

	const handleOnChange = useCallback((value: string) => {
		setState({
			valid: true,
			parameters: {
				presets: value,
			},
		});
	}, []);

	const handleOnError = useCallback((_result: Result) => {
		setState(current => ({
			...current,
			valid: false,
		}));
	}, []);

	return (
		<Canvas ctx={ctx}>
			<div className={s['preset-help']}>
				<span className={s['preset-help-header']}>Get started:</span>
				<a
					target="_blank"
					rel="noreferrer"
					className={s['preset-help-link']}
					href={config.endpoints.docs}
				>
					Documentation
				</a>
				<a
					target="_blank"
					rel="noreferrer"
					className={s['preset-help-link']}
					href={config.endpoints.issues}
				>
					Issues / Feature Requests
				</a>
				<a
					target="_blank"
					rel="noreferrer"
					className={s['preset-help-link']}
					href={config.endpoints.changelog}
				>
					Changelog
				</a>
			</div>
			<form className={s['presets-config-form']} onSubmit={handleOnSubmit}>
				<FieldGroup>
					<JsonTextarea
						label="Global Presets"
						initialValue={state.parameters.presets}
						validate={validatePresetsConfig}
						onValidChange={handleOnChange}
						onError={handleOnError}
					/>
				</FieldGroup>
				<Button
					fullWidth
					type="submit"
					buttonSize="l"
					buttonType="primary"
					disabled={!state.valid}
				>
					Save settings
				</Button>
			</form>
		</Canvas>
	);
};

export default GlobalConfigScreen;
