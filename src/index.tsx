import {connect} from 'datocms-plugin-sdk';
import type {
	IntentCtx, RenderManualFieldExtensionConfigScreenCtx,
	RenderFieldExtensionCtx, RenderConfigScreenCtx,
} from 'datocms-plugin-sdk';
import 'datocms-react-ui/styles.css';
import {render} from './utils/render';
import FieldConfigScreen from './entrypoints/field-config-screen';
import VisualSelect from './entrypoints/visual-select';
import GlobalConfigScreen from './entrypoints/global-config-screen';

connect({
	renderConfigScreen(ctx: RenderConfigScreenCtx) {
		render(<GlobalConfigScreen ctx={ctx}/>);
	},
	manualFieldExtensions(_ctx: IntentCtx) {
		return [
			{
				id: 'visualSelect',
				name: 'Visual Select',
				type: 'editor',
				fieldTypes: ['text', 'string'],
				configurable: true,
			},
		];
	},
	renderFieldExtension(
		_fieldExtensionId: string,
		ctx: RenderFieldExtensionCtx,
	) {
		render(<VisualSelect ctx={ctx}/>);
	},
	renderManualFieldExtensionConfigScreen(
		_fieldExtensionId: string,
		ctx: RenderManualFieldExtensionConfigScreenCtx,
	) {
		render(<FieldConfigScreen ctx={ctx}/>);
	},
});
