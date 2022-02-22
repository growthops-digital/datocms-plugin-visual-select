type VisualizationType = 'color' | 'image';

type Result = {
	type: 'error';
	message: string;
} | {
	type: 'success';
};

type Option = {
	name: string;
	type: VisualizationType;
	display: string;
	value: string;
};

type Collection = {
	extends?: string[];
	options?: Option[];
};

export type {
	Result,
	VisualizationType,
	Option,
	Collection,
};
