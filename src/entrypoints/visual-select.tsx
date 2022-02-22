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

const VisualSelect = ({ctx}: VisualSelectProps): JSX.Element => {
	const resolvedState = useMemo(() => {
		const collection = JSON.parse(ctx.parameters.collection as string) as Collection;
		const allPresets = JSON.parse(ctx.plugin.attributes.parameters.presets as string) as Record<string, Option[]>;
		const selectedPresets = (collection.extends ?? []).flatMap(key => allPresets[key]);

		return [...selectedPresets, ...collection.options ?? []];
	}, [ctx.parameters.collection]);

	const currentValue = useMemo(() => get(ctx.formValues, ctx.fieldPath) as string, [ctx.formValues, ctx.fieldPath]);

	const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		ctx.setFieldValue(ctx.fieldPath, event.target.value);
	}, []);

	return (
		<Canvas ctx={ctx}>
			<fieldset id={ctx.field.id} className={s['fieldset']}>
				{resolvedState.map(prefab => (
					<label key={prefab.name} className={s['label']} htmlFor={`${prefab.name}_${ctx.field.id}`}>
						<input
							id={`${prefab.name}_${ctx.field.id}`}
							className={s['radio']}
							type="radio"
							value={prefab.value}
							name="prefabs"
							defaultChecked={currentValue == prefab.value}
							onChange={handleOnChange}
						/>
						<div className={s['mark']}>
							{prefab.type === 'color' && (
								<div className={s['color-preview']} style={{backgroundColor: prefab.display}}/>
							)}
							{prefab.type === 'image' && (
								<div className={s['image-preview-container']}>
									<img src={prefab.display} alt={prefab.name} className={s['image-preview']}/>
								</div>
							)}
							<span className={s['name']}>{prefab.name}</span>
						</div>
					</label>
				))}
			</fieldset>
		</Canvas>
	);
};

export default VisualSelect;
