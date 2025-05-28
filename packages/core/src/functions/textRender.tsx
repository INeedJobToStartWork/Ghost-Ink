/* eslint-disable complexity */
import React, { ComponentProps, ElementType } from "react";

//----------------------
// Types
//----------------------

/** @internal @dontexport */
type TTextStyles<T extends ElementType> = {
	/**
	 * Index of the first tag placement in the text.
	 */
	start: number;

	/**
	 * Index of the last tag placement in the text.
	 */
	end: number;

	/**
	 * Props passed to the `tag` component.
	 */
	props: ComponentProps<T>;

	/**
	 * The tag/component to be rendered (e.g. 'span', 'strong', or a React component).
	 */
	tag: T;

	/**
	 * If true, the tag will be applied to a separated character
	 * or replace the current one.
	 * @default false
	 */
	separated?: boolean;
};

/** @internal @dontexport */
type TTextRenderProps<T extends ElementType = ElementType> = {
	text: string;
	styles: TTextStyles<T>[];
};

//----------------------
// Functions
//----------------------

/**
 * Renders a string of text with dynamic styling and component wrapping.
 *
 * Useful for advanced text rendering scenarios like custom highlighting or cursor,
 *
 * @example
 * ```ts
 * const text = "Hello world";
 * const styles = [
 *   { start: 0, end: 5, tag: 'strong', props: { className: 'highlight' } },
 *   { start: 6, end: 11, tag: 'span', props: { style: { color: 'red' } } }
 * ];
 *
 * const rendered = textRender({ text, styles });
 * ```
 *
 */
export function textRender<T extends ElementType>(props: TTextRenderProps<T>) {
	const { text, styles } = props;
	if (!text) return;

	const chars = Array.from(text, (char, index) => ({
		index,
		content: char,
		tags: [] as TTextStyles<T>[]
	}));

	const inserts: { index: number; element: React.ReactNode }[] = [];

	for (const style of styles) {
		const { start, end, tag: Tag, props, separated } = style;

		if (separated && props?.children !== undefined) {
			inserts.push({
				index: start,
				element: (
					<Tag key={`insert-${start}-${Math.random()}`} {...(props as any)}>
						{props.children}
					</Tag>
				)
			});
			continue;
		}

		for (let i = start; i < end && i < chars.length; i++) {
			chars[i].tags.push(style);
		}
	}

	const output: React.ReactNode[] = [];

	for (let i = 0; i <= chars.length; i++) {
		while (inserts.length && inserts[0].index === i) {
			output.push(inserts.shift()!.element);
		}

		if (i >= chars.length) break;

		let node: React.ReactNode = chars[i].content;

		for (const { tag: Tag, props = {} } of chars[i].tags) {
			node = (
				<Tag key={`wrap-${i}`} {...(props as any)}>
					{node}
				</Tag>
			);
		}

		output.push(<React.Fragment key={`char-${i}`}>{node}</React.Fragment>);
	}

	return output;
}
