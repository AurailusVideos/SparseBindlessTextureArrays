import { makeScene2D, Layout, Txt, Video } from '@motion-canvas/2d';
import { Vector2, all, chain, createRef, makeRef, range, waitFor } from '@motion-canvas/core';

// import video from '../../videos/gamefootage.mp4'
import { OutlinedBox } from '../components/OutlinedBox';

export default makeScene2D(function* (view) {
	const txtRef = createRef<Txt>();
	const videoRef = createRef<Video>();
	const layoutRef = createRef<Layout>();

	const squares: OutlinedBox[] = [];
	const gap = 32;
	const size = 96;
	const offset = 48;

	view.fill('#111');
	yield view.add(
		<Layout ref={layoutRef} layout={true} width='100%' height='100%'>
			{/* <Video ref={videoRef} src={video}/> */}

			<Txt
				ref={txtRef}
				layout={false}
				fill='white'
				fontSize={36}
				fontFamily={'Jetbrains Mono'}
				fontWeight={900}
				text=''
				x={-500}
				y={-170 + offset}
				textAlign={'left'}
				offsetX={-1}
			/>
			<Layout layout={false} direction='column'>
				{range(16).map(index => {
					return (
						<OutlinedBox
							ref={makeRef(squares, index)}
							x={(size + gap) * (index % 8 - 3.5)}
							y={-(size + gap) / 2 + (size + gap) * Math.floor(index / 8) + offset}
							width={size}
							height={size}
							strokeWidth={4}
							stroke='white'
							fill='#fff1'
						/>
					);
				})}
			</Layout>
		</Layout>
	);


	// videoRef().seek(18);
	// videoRef().play();
	// videoRef().scale(1.1);

	yield* waitFor(10);

	// yield* videoRef().filters.blur(50, 1);

	yield* all(
		chain(waitFor(0.1), txtRef().text('Texture Slots', 0.5)),
		...squares.flatMap((square, i) =>
		chain(waitFor(0.05 * ((i % 8) + Math.floor(i / 8) * 3 )), square.animateIn(0.3)))
	);

	yield* waitFor(0.9);
	// videoRef().pause();

	yield* waitFor(5);

	yield* all(
		chain(waitFor(0.05), txtRef().text('', 0.5)),
		...squares.flatMap((square, i) =>
		chain(waitFor(0.05 * ((i % 8) + Math.floor(i / 8) * 3 )), square.animateOut(0.3)))
	);

	yield* waitFor(1);
});
