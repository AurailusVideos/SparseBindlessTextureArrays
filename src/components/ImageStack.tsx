import { LayoutProps, Layout, Img, initial, signal, vector2Signal } from '@motion-canvas/2d';
import { Color, SignalValue, SimpleSignal, Vector2Signal, all } from '@motion-canvas/core';

interface ImageStackProps {
	images: string[];
	spread?: SignalValue<number>;
	antialiased?: SignalValue<boolean>;
	radius?: SignalValue<number>;
}

export class ImageStack extends Layout {
	private imageElements: Img[] = [];

	@initial({ x: 0, y: 0 })
  @vector2Signal({x: 'spreadX', y: 'spreadY'})
  public declare readonly spread: Vector2Signal<this>;
  public get spreadX() { return this.spread.x; }
  public get spreadY() { return this.spread.y; }

	@initial(false)
	@signal()
	public declare readonly antialiased: SimpleSignal<boolean, this>;

	@initial(0)
	@signal()
	public declare readonly radius: SimpleSignal<number, this>;

	@initial([])
	@signal()
	public declare readonly images: SimpleSignal<string[], this>;

	constructor(props: LayoutProps & ImageStackProps) {
		super({
			...props
		});

		if (props.spread) this.spread(props.spread);
		if (props.antialiased) this.antialiased(props.antialiased);
		if (props.radius) this.radius(props.radius);
		if (props.images) this.images(props.images);
		if (props.opacity) this.opacity(props.opacity);

		this.images().map((_, i, arr) => {
			let img = <Img
				src={() => this.images()[i]}
				layout={false}
				width={this.width}
				height={this.height}
				shadowBlur={() => this.spread().magnitude * 2}
				shadowColor={() => new Color('#000f').alpha(this.spread().magnitude / 32)}
				shadowOffsetY={() => this.spread().magnitude / 3}
				shadowOffsetX={() => -this.spread().magnitude / 2}
				smoothing={() => !this.antialiased}
				radius={this.radius}
				x={() => (i - arr.length / 2) * this.spread.x()}
				y={() => (i - arr.length / 2) * this.spread.y()}
			/> as Img;

			this.imageElements.push(img);
			this.add(img);
		});
	}
}
