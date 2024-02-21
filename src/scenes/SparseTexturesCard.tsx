import { makeScene2D, Layout, Txt, Video } from '@motion-canvas/2d';
import { Vector2, all, chain, createRef, createRefMap, easeOutQuad, easeOutQuint, makeRef, range, waitFor } from '@motion-canvas/core';

import video from '../../videos/gamefootage.mp4'
import { OutlinedBox } from '../components/OutlinedBox';

export default makeScene2D(function* (view) {
	const txtRefs = createRefMap<Txt>();
	const videoRef = createRef<Video>();
	const layoutRef = createRef<Layout>();

	const title = 'Sparse Bindless Texture Arrays';
	const subtitle = 'Sparse';
	const subtitle2 = 'Textures';

	view.fill('#111');
	yield view.add(
		<Layout ref={layoutRef} layout={true} width='100%' height='100%' cache>
			<Video
				ref={videoRef}
				src={video}
			/>
			<Txt
				ref={txtRefs.sub1}
				layout={false}
				fill='#fff'
				opacity={0.8}
				fontSize={70}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				text={title}
				x={-1920/2}
				y={-210}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
				compositeOperation={'soft-light'}
			/>
			<Txt
				ref={txtRefs.sub2}
				layout={false}
				fill='#fff'
				opacity={1}
				fontSize={70}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				text={title}
				x={-1920/2}
				y={-210}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
				compositeOperation={'soft-light'}
			/>
			<Txt
				ref={txtRefs.title11}
				layout={false}
				fill='#fff'
				opacity={1}
				fontSize={240}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle}
				x={-1920/2}
				y={30 - 60}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
				compositeOperation='soft-light'
			/>
			<Txt
				ref={txtRefs.title12}
				layout={false}
				fill='#fff'
				opacity={1}
				fontSize={240}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle}
				x={-1920/2}
				y={30 - 60}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
				compositeOperation='soft-light'
			/>
			<Txt
				ref={txtRefs.title21}
				layout={false}
				fill='#fff'
				fontSize={240}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle2}
				x={-1920/2}
				y={159 - 60}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
				compositeOperation='soft-light'
			/>
			<Txt
				ref={txtRefs.title22}
				layout={false}
				fill='#fff'
				opacity={1}
				fontSize={240}
				fontFamily={'Montserrat Black'}
				fontWeight={900}
				padding={64}
				text={subtitle2}
				x={-1920/2}
				y={159 - 60}
				width='100%'
				textAlign={'center'}
				offsetX={-1}
			/>
		</Layout>
	);


	videoRef().seek(2*60 + 28);
	videoRef().play();
	videoRef().scale(1.1);

	txtRefs.sub1().opacity(0);
	txtRefs.sub2().opacity(0);
	txtRefs.title11().opacity(0);
	txtRefs.title12().opacity(0);
	txtRefs.title21().opacity(0);
	txtRefs.title22().opacity(0);

	txtRefs.sub1().letterSpacing(-8);
	txtRefs.sub2().letterSpacing(-8);
	txtRefs.title11().letterSpacing(-32);
	txtRefs.title12().letterSpacing(-32);
	txtRefs.title21().letterSpacing(-32);
	txtRefs.title22().letterSpacing(-32);

	yield* waitFor(5);
	yield* videoRef().filters.blur(50, 1);

	yield* all(
		txtRefs.sub1().opacity(1, 1, easeOutQuint),
		txtRefs.sub1().letterSpacing(-4, 1, easeOutQuint),
		txtRefs.sub2().opacity(1, 1, easeOutQuint),
		txtRefs.sub2().letterSpacing(-4, 1, easeOutQuint),
		chain(waitFor(1), all(
			txtRefs.title11().opacity(1, 1, easeOutQuint),
			txtRefs.title11().letterSpacing(-4, 1.5, easeOutQuint),
			txtRefs.title12().opacity(1, 1, easeOutQuint),
			txtRefs.title12().letterSpacing(-4, 1.5, easeOutQuint),
		)),
		chain(waitFor(1.1), all(
			txtRefs.title21().opacity(1, 0.9, easeOutQuint),
			txtRefs.title21().letterSpacing(-4, 1.4, easeOutQuint),
			txtRefs.title22().opacity(1, 0.9, easeOutQuint),
			txtRefs.title22().letterSpacing(-4, 1.4, easeOutQuint),
		))
	);
	yield* waitFor(5);
});
