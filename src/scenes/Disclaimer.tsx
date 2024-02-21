import { makeScene2D, Layout, Txt, Img, Rect, Gradient, Video } from '@motion-canvas/2d';
import { PossibleVector2, Vector2, all, chain, createRef, createRefMap, easeInCubic, easeInOutCubic, easeInOutQuint, easeInQuint, easeOutCubic, easeOutQuad, easeOutQuint, linear, makeRef, range, tween, waitFor, waitUntil } from '@motion-canvas/core';

import img_gpu from '../../images/gpu.png'
import img_genesis from '../../images/genesis.png'
import img_switch from '../../images/switch.webp'
import img_gamecube from '../../images/gamecube.png'
import img_cellphone from '../../images/cellphone.png'

import video from '../../videos/returnalfootage.mp4'

export default makeScene2D(function* (view) {
	const layoutRef = createRef<Layout>();
	const videoRef = createRef<Video>();

	{
		const imageRefs: Img[] = [];

		view.fill('#111');
		yield view.add(
			<Layout ref={layoutRef} width='100%' height='100%'>
				<Video ref={videoRef} src={video} width='100%' height='100%'/>
				{[ img_gpu, img_genesis, img_switch, img_gamecube, img_cellphone ].map((img, i) => {
					return <Img
						src={img}
						width={i === 4 ? 400 : 800}
						ref={makeRef(imageRefs, i)}
						x={2000}
					/>;
				})}
			</Layout>
		);

		videoRef().seek(6 * 60);
		videoRef().play();

		yield all(
			imageRefs[0].y(-200).y(100, 3, linear),
			imageRefs[0].x(-1400).x(1400, 3, linear),
			imageRefs[0].rotation(1000, 3, linear),
		);

		yield* waitFor(1);

		yield all(
			imageRefs[1].y(500).y(-500, 3, linear),
			imageRefs[1].x(1400).x(-1400, 3, linear),
			imageRefs[1].rotation(-1000, 3, linear),
		);

		yield* waitFor(1);

		yield all(
			imageRefs[2].y(1400).y(-1400, 3, linear),
			imageRefs[2].x(500).x(-500, 3, linear),
			imageRefs[2].rotation(-1000, 3, linear),
		);

		yield* waitFor(1);

		yield all(
			imageRefs[3].y(-1400).y(1400, 3, linear),
			imageRefs[3].x(-500).x(500, 3, linear),
			imageRefs[3].rotation(1000, 3, linear),
		);

		yield* waitFor(1);

		yield all(
			imageRefs[4].y(-1000).y(1000, 3, linear),
			imageRefs[4].x(800).x(-600, 3, linear),
			imageRefs[4].rotation(1000, 3, linear),
		);

		yield* waitFor(1);

		yield* waitFor(5);
	}

});
