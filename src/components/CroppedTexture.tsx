import { Img, Rect, RectProps } from '@motion-canvas/2d';

interface Props {
	src: string;
	crop: [ number, number, number, number ];
}

export class CroppedTexture extends Rect {
	constructor(props: RectProps & Props) {
		super({
			...props,
			clip: true
		});

		const image = <Img
			src={props.src}
			width={() => this.width() / (props.crop[2] - props.crop[0])}
			height={() => this.height() / (props.crop[3] - props.crop[1])}
			x={() => -this.width() / 2 - props.crop[0] / (props.crop[2] - props.crop[0]) * this.width()}
			y={() => -this.width() / 2 - props.crop[1] / (props.crop[3] - props.crop[1]) * this.width()}
			offset={-1}
		/>;

		this.add(image);
	}
}
