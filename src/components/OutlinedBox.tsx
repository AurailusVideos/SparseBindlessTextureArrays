import { Node, NodeProps, Rect, RectProps, } from '@motion-canvas/2d';
import { chain, waitFor, PossibleColor, all, easeInCubic, easeOutCubic, easeInQuad, easeOutQuad, linear } from '@motion-canvas/core';

interface Props {
	strokeWidth?: number | [ number, number, number, number ];
	stroke?: PossibleColor;
}

export class OutlinedBox extends Rect {

	private rects: [ Rect, Rect, Rect, Rect ] = [] as any;
	private strokeWidth: [ number, number, number, number ];

	public constructor(props: RectProps & Props) {
		super({
			...props,
			opacity: 0,
		});

		this.strokeWidth = Array.isArray(props.strokeWidth) ? props.strokeWidth :
			props.strokeWidth ? [ props.strokeWidth, props.strokeWidth, props.strokeWidth, props.strokeWidth ]
			: [ 4, 4, 4, 4 ];
		const stroke = props.stroke ?? '#fff';

		this.rects[0] = new Rect({
			fill: stroke,
			width: '0%',
			height: this.strokeWidth[0],
			x: () => -this.width() / 2,
			y: () => -this.height() / 2,
			offset: [ -1, -1 ]
		});

		this.rects[3] = new Rect({
			fill: stroke,
			width: this.strokeWidth[3],
			height: '0%',
			x: () => -this.width() / 2,
			y: () => -this.height() / 2,
			offset: [ -1, -1 ]
		});

		this.rects[2] = new Rect({
			fill: stroke,
			width: '0%',
			height: this.strokeWidth[2],
			x: () => -this.width() / 2,
			y: () => this.height() / 2 - this.strokeWidth[2],
			offset: [ -1, -1 ]
		});

		this.rects[1] = new Rect({
			fill: stroke,
			width: this.strokeWidth[1],
			height: '0%',
			x: () => this.width() / 2 - this.strokeWidth[1],
			y: () => -this.height() / 2,
			offset: [ -1, -1 ]
		});

		this.add(this.rects[0]);
		this.add(this.rects[1]);
		this.add(this.rects[2]);
		this.add(this.rects[3]);
	}

	*animateIn(duration: number) {
		this.rects[0].x(() => -this.width() / 2 + this.strokeWidth[3]);
		this.rects[3].y(() => -this.height() / 2);
		this.rects[2].x(() => -this.width() / 2);
		this.rects[1].y(() => -this.height() / 2);

		return yield* all(
			this.opacity(1, duration / 2),
			this.rects[0].width(() => this.width() - this.strokeWidth[3] - this.strokeWidth[1], duration / 2, linear),
			this.rects[3].height(() => this.height() - this.strokeWidth[2], duration / 2, linear),
			chain(waitFor(duration / 2.2), this.rects[2].width(this.width, duration / 1.5, easeOutQuad)),
			chain(waitFor(duration / 2.2), this.rects[1].height(() => this.height() - this.strokeWidth[2], duration / 1.5, easeOutQuad))
		);
	}

	*animateOut(duration: number) {
		return yield* all(
			chain(waitFor(duration / 2.5), this.opacity(0, duration / 1.5)),
			chain(waitFor(duration / 2.2), this.rects[2].width('0%', duration / 2, linear)),
			chain(waitFor(duration / 2.2), this.rects[1].height('0%', duration / 2, linear)),
			chain(waitFor(duration / 2.2), this.rects[2].x(() => this.width() / 2, duration / 2, linear)),
			chain(waitFor(duration / 2.2), this.rects[1].y(() => this.height() / 2, duration / 2, linear)),
			this.rects[0].width('0%', duration / 1.5, easeOutQuad),
			this.rects[3].height('0%', duration / 1.5, easeOutQuad),
			this.rects[0].x(() => this.width() / 2, duration / 1.5, easeOutQuad),
			this.rects[3].y(() => this.height() / 2, duration / 1.5, easeOutQuad)
		);
	}
}
