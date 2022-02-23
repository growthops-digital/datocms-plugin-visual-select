import React, {useCallback, useMemo, useState} from 'react';
import type {ChangeEvent} from 'react';
import cn from 'classnames';
import type {Result} from '../lib/types';
import {Success, Error, Question} from '../svgs';
import s from '../lib/styles.module.css';
import config from '../config';

type JsonTextareaProps = {
	label?: string;
	initialValue: string;
	onValidChange: (value: string) => void;
	onError?: (result: Result) => void;
	validate: (value: unknown) => Result;
};

type State = {
	value: string;
	status?: 'error' | 'success';
	message?: string;
};

const MESSAGE_VALID = 'Valid configuration detected';
const MESSAGE_PARSE_ERROR = 'Could not parse JSON data';

const statusIconMap: Record<string, React.ElementType> = {
	success: Success,
	error: Error,
};

const JsonTextarea = ({label, initialValue, onValidChange, onError, validate}: JsonTextareaProps): JSX.Element => {
	const [state, setState] = useState<State>({
		value: initialValue,
	});

	const handleOnChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.currentTarget.value;

		try {
			const json = JSON.parse(value) as unknown;
			const result = validate(json);

			if (result.type === 'success') {
				setState({
					value,
					status: 'success',
					message: MESSAGE_VALID,
				});

				onValidChange(value);
			} else {
				setState({
					value,
					status: 'error',
					message: result.message,
				});

				onError?.({
					type: 'error',
					message: result.message,
				});
			}
		} catch (e) {
			setState({
				value,
				status: 'error',
				message: MESSAGE_PARSE_ERROR,
			});

			onError?.({
				type: 'error',
				message: MESSAGE_PARSE_ERROR,
			});
		}
	}, []);

	const StatusIcon = useMemo<React.ElementType>(
		() => statusIconMap[state.status ?? 'success'],
		[state.status],
	);

	const statusBarClasses = cn({
		[s['status-bar']]: true,
		[s['has-error']]: state.status === 'error',
	});

	return (
		<React.Fragment>
			<div className={s['textarea-bar']}>
				{label !== undefined && (
					<span className={s['text-label']}>{label}</span>
				)}
				<a href={config.endpoints.docs} className={s['docs-container']}>
					<Question className={s['docs-icon']}/>
					<span className={s['docs-label']}>View Documentation</span>
				</a>
			</div>
			<textarea
				rows={10}
				className={s['textarea']}
				value={state.value}
				onChange={handleOnChange}
			/>
			{state.status && (
				<div className={statusBarClasses}>
					<StatusIcon className={s['status-icon']}/>
					<span className={s['status-message']}>{state.message}</span>
				</div>
			)}
		</React.Fragment>
	);
};

export default JsonTextarea;
