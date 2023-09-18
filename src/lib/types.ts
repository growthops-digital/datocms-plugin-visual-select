type VisualizationType = 'color' | 'image';

type Result =
	| {type: 'error';
			message: string; }
	| {type: 'success'};

type Option = {
	name: string;
	type: VisualizationType;
	display: string;
	value: string;
};

type Presentation = {
	type?: 'carousel' | 'grid';
	width?: string;
	columns?: number;
};

type Collection = {
	extends?: string[];
	options?: Option[];
	presentation?: Presentation;
};

export type {Result, VisualizationType, Option, Collection};