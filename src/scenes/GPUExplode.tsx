import { makeScene2D, Layout, Txt, Img, Rect, Video, Node } from '@motion-canvas/2d';
import { Vector2, all, chain, createRef, createRefMap, easeOutQuad, easeOutQuint, linear, makeRef, range, waitFor, waitUntil } from '@motion-canvas/core';

import { ImageStack } from '../components/ImageStack';

import gpu from '../../images/gpu.png';
import explode from '../../videos/explosion.webm'

import { shake } from '../Util';

export default makeScene2D(function* (view) {
	const imageStackRef = createRef<ImageStack>();
	const imageRef = createRef<Img>();
	const layoutRef = createRef<Layout>();
	const videoRef = createRef<Video>();

	view.fill('#111');
	view.add(
		<Layout ref={layoutRef} width='100%' height='100%'>
			<Txt text='Live GPU Reaction' width='100%' height='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
			<Img ref={imageRef} src={gpu} width='65%'/>
			<Video ref={videoRef} src={explode} scale={25} x={60} opacity={0} smoothing={false}/>
		</Layout>
	);

	yield* shake(imageRef(), 0.5, 10);
	yield* shake(imageRef(), 0.5, 20);
	yield* shake(imageRef(), 0.5, 40);

	// yield* waitFor(2);


	// videoRef().opacity(1);
	// videoRef().play();

	yield* shake(imageRef(), 0.83, 200);
	imageRef().opacity(0);

	yield* waitFor(2);
});
