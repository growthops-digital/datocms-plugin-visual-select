import {useCallback, useMemo} from 'react';
import type {ChangeEvent} from 'react';
import {Canvas} from 'datocms-react-ui';
import type {RenderFieldExtensionCtx} from 'datocms-plugin-sdk';
import get from 'lodash-es/get';
import type {Collection, Option} from '../lib/types';
import s from '../lib/styles.module.css';

type VisualSelectProps = {
	ctx: RenderFieldExtensionCtx;
};

const EMPTY_LENGTH = 0;

const VisualSelect = ({ctx}: VisualSelectProps): JSX.Element => {
	const options = useMemo(() => {
		const collection = JSON.parse(ctx.parameters.collection as string) as Collection;
		const allPresets = JSON.parse(ctx.plugin.attributes.parameters.presets as string) as Record<string, Option[]>;
		const presetOptions = (collection.extends ?? []).flatMap(key => allPresets[key]);

		return [...presetOptions, ...collection.options ?? []];
	}, [ctx.parameters.collection, ctx.plugin.attributes.parameters.presets]);

	const currentValue = useMemo(() => get(ctx.formValues, ctx.fieldPath) as string, [ctx.formValues, ctx.fieldPath]);

	const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		ctx.setFieldValue(ctx.fieldPath, event.target.value);
	}, []);

	return (
		<Canvas ctx={ctx}>
			{options.length === EMPTY_LENGTH && (
				<div className={s['no-options']}>There are no options available for this field.</div>
			)}
			<fieldset id={ctx.field.id} className={s['fieldset']}>
				{options.map(option => (
					<label key={option.name} className={s['label']} htmlFor={`${option.name}_${ctx.field.id}`}>
						<input
							id={`${option.name}_${ctx.field.id}`}
							className={s['radio']}
							type="radio"
							value={option.value}
							name="options"
							defaultChecked={currentValue == option.value}
							onChange={handleOnChange}
						/>
						<div className={s['mark']}>
							{option.type === 'color' && (
								<div className={s['color-preview']} style={{backgroundColor: option.display}}/>
							)}
							{option.type === 'image' && (
								<div className={s['image-preview-container']}>
									<img src={option.display} alt={option.name} className={s['image-preview']}/>
								</div>
							)}
							<span className={s['name']}>{option.name}</span>
						</div>
					</label>
				))}
			</fieldset>
		</Canvas>
	);
};

export default VisualSelect;
