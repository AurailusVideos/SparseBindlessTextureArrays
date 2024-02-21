import { makeScene2D, Layout, Txt, Video } from '@motion-canvas/2d';
import { Vector2, all, chain, createRef, createRefMap, easeOutQuad, easeOutQuint, makeRef, range, waitFor } from '@motion-canvas/core';

import video from '../../videos/sbtas_lines2.mp4'
import { OutlinedBox } from '../components/OutlinedBox';

export default makeScene2D(function* (view) {
	const txtRefs = createRefMap<Txt>();
	const videoRef = createRef<Video>();
	const layoutRef = createRef<Layout>();

	const subtitle = 'Sparse Bindless';
	const subtitle2 = 'Texture Arrays';

	view.fill('#111');
	yield view.add(
		<Layout ref={layoutRef} layout={true} width='100%' height='100%' cache>
			<Video
				ref={videoRef}
				src={video}
				width='100%'
				height='100%'
			/>
			<Txt
				ref={txtRefs.title11}
				layout={false}
				fill='#fffb'
				opacity={1}
				fontSize={225}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle}
				x={-1920/2}
				y={50 + 180}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
				compositeOperation='overlay'
			/>
			<Txt
				ref={txtRefs.title12}
				layout={false}
				fill='#fff8'
				opacity={1}
				fontSize={225}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle}
				x={-1920/2}
				y={50 + 180}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
			/>
			<Txt
				ref={txtRefs.title21}
				layout={false}
				fill='#fff'
				fontSize={225}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle2}
				x={-1920/2}
				y={159 + 180}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
				compositeOperation='overlay'
			/>
			<Txt
				ref={txtRefs.title22}
				layout={false}
				fill='#fff'
				opacity={1}
				fontSize={225}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle2}
				x={-1920/2}
				y={159 + 180}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
			/>
		</Layout>
	);

	videoRef().play();
	// videoRef().seek(0);
	// videoRef().scale(1.1);

	txtRefs.title11().opacity(0);
	txtRefs.title12().opacity(0);
	txtRefs.title21().opacity(0);
	txtRefs.title22().opacity(0);

	txtRefs.title11().letterSpacing(-32);
	txtRefs.title12().letterSpacing(-32);
	txtRefs.title21().letterSpacing(-32);
	txtRefs.title22().letterSpacing(-32);

	yield* waitFor(2.8);
	// yield* videoRef().filters.blur(50, 1);

	yield* all(
		chain(waitFor(1), all(
			txtRefs.title11().opacity(1, 1, easeOutQuint),
			txtRefs.title11().letterSpacing(-4, 1.5, easeOutQuint),
			txtRefs.title12().opacity(1, 1, easeOutQuint),
			txtRefs.title12().letterSpacing(-4, 1.5, easeOutQuint),
		)),
		chain(waitFor(1.8), all(
			txtRefs.title21().opacity(1, 0.9, easeOutQuint),
			txtRefs.title21().letterSpacing(-4, 1.4, easeOutQuint),
			txtRefs.title22().opacity(1, 0.9, easeOutQuint),
			txtRefs.title22().letterSpacing(-4, 1.4, easeOutQuint),
		))
	);
	yield* waitFor(15);
});
