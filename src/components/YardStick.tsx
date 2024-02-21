import { CubicBezier, Length, Node, NodeProps, Rect, RectProps, Txt, colorSignal, initial, signal, vector2Signal } from "@motion-canvas/2d";
import { Color, ColorSignal, PossibleColor, PossibleVector2, SignalValue, SimpleSignal, Vector2, Vector2Signal, all, chain, createSignal, loop, waitFor } from "@motion-canvas/core";

export type YardStickProps<T> = {
	zIndex?: number;
	start: SignalValue<PossibleVector2>;
	end: SignalValue<PossibleVector2>;
	stroke?: SignalValue<PossibleColor>;
	strokeWidth?: SignalValue<number>;
	decimals?: SignalValue<number>;
	arrowSize?: SignalValue<number>;
	labelColor?: SignalValue<PossibleColor>;
	labelSize?: SignalValue<number>;
	labelOffset?: SignalValue<PossibleVector2>;
	opacity?: SignalValue<number>;
	textTransformer?: (value: number, ctx: T) => string;
	textContext?: SignalValue<T>
};

export class YardSick<T extends Record<string, any> = {}> extends Node {
	@vector2Signal({x: 'startX', y: 'startY'})
	public declare readonly start: Vector2Signal<this>;
	public get startWidth() { return this.start.x; }
	public get startHeight() { return this.start.y; }

	@vector2Signal({x: 'endX', y: 'endY'})
	public declare readonly end: Vector2Signal<this>;
	public get endWidth() { return this.end.x; }
	public get endHeight() { return this.end.y; }

	@colorSignal()
	public declare readonly stroke: ColorSignal<this>;

	@signal()
	public declare readonly strokeWidth: SimpleSignal<number, this>;

	@signal()
	public declare readonly opacity: SimpleSignal<number, this>;

	@colorSignal()
	public declare readonly labelColor: ColorSignal<this>;

	@signal()
	public declare readonly labelSize: SimpleSignal<number, this>;

	@signal()
	public declare readonly labelOffset: Vector2Signal<this>;

	@signal()
	public declare readonly arrowSize: SimpleSignal<number, this>;

	private readonly textTransformer: (value: number, ctx: T) => string;

	@initial({})
	@signal()
	public declare readonly textContext: SimpleSignal<T, this>;

	readonly bezier: CubicBezier;
	readonly text: Txt;

	public constructor(props: YardStickProps<T> & NodeProps) {
		super({});

		this.zIndex(props.zIndex);
		this.start(props.start);
		this.end(props.end);
		this.opacity(props.opacity ?? 1);
		this.stroke(props.stroke ?? '#fff');
		this.strokeWidth(props.strokeWidth ?? 2);
		this.labelColor(props.labelColor ?? this.stroke);
		this.labelSize(props.labelSize ?? 48);
		this.labelOffset(props.labelOffset ?? [ 0, 0 ]);
		this.arrowSize(props.arrowSize ?? 10);

		this.textTransformer = props.textTransformer ?? (value => value.toFixed(0));
		this.textContext(props.textContext ?? {} as T);

		this.bezier = <CubicBezier
			lineWidth={this.strokeWidth}
			stroke={this.stroke}
			p0={0}
			p1={0}
			p2={() => this.end().sub(this.start())}
			p3={() => this.end().sub(this.start())}
			position={this.start}
			arrowSize={this.arrowSize}
			endArrow
			lineCap={'round'}
			opacity={this.opacity}
		/> as CubicBezier;

		const distanceText = createSignal(() =>
			this.textTransformer(this.start().sub(this.end()).magnitude, this.textContext()));

		this.text = <Txt
			text={distanceText}
			position={() => this.end().add(this.labelOffset())}
			fill={this.labelColor}
			fontSize={this.labelSize}
			fontFamily={'Jetbrains Mono'}
			fontWeight={700}
			opacity={this.opacity}
			offset={[ -1, 0 ]}
		/> as Txt;

		// this.text.offset(new Vector2([ 0, 0 ]));

		this.add(this.bezier);
		this.add(this.text);
	}
}
