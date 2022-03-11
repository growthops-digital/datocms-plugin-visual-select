import {useCallback, useState} from 'react';
import type {FormEvent} from 'react';
import {Canvas, FieldGroup, Button} from 'datocms-react-ui';
import type {RenderConfigScreenCtx} from 'datocms-plugin-sdk';
import {validatePresetsConfig} from '../lib/validators';
import {JsonTextarea} from '../components';
import type {Result} from '../lib/types';
import s from '../lib/styles.module.css';
import config from '../config';
import {JSON_INDENT_SIZE} from '../constants';
import lang, {
	EN_CHANGELOG, EN_DOCUMENTATION, EN_GET_STARTED,
	EN_ISSUES_FEATURES, EN_SAVE_SETTINGS, EN_SETTINGS_UPDATED,
} from '../lang';

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

const gettingStartedLinks = [
	{url: config.endpoints.docs, label: lang(EN_DOCUMENTATION)},
	{url: config.endpoints.issues, label: lang(EN_ISSUES_FEATURES)},
	{url: config.endpoints.changelog, label: lang(EN_CHANGELOG)},
];

const GlobalConfigScreen = ({ctx}: GlobalConfigScreenProps): JSX.Element => {
	const [state, setState] = useState<State>({
		parameters: ctx.plugin.attributes.parameters as Parameters,
		valid: false,
	});

	const handleOnSubmit = useCallback(async (event: FormEvent) => {
		event.preventDefault();

		await ctx.updatePluginParameters(formatParameters(state.parameters));
		ctx.notice(lang(EN_SETTINGS_UPDATED));
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
				<span className={s['preset-help-header']}>{lang(EN_GET_STARTED)}</span>
				{gettingStartedLinks.map(entry => (
					<a
						key={entry.label}
						target="_blank"
						rel="noreferrer"
						className={s['preset-help-link']}
						href={entry.url}
					>
						{entry.label}
					</a>
				))}
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
					className={s['space-top']}
				>
					{lang(EN_SAVE_SETTINGS)}
				</Button>
			</form>
		</Canvas>
	);
};

export default GlobalConfigScreen;
