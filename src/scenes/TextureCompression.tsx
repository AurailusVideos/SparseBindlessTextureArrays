import { makeScene2D, Layout, Txt, Img, Rect, Video, Node } from '@motion-canvas/2d';
import { SimpleSignal, Vector2, Vector2Signal, all, chain, createRef, createRefMap, easeInCubic, easeInExpo, easeInQuad, easeOutCubic, easeOutElastic, easeOutExpo, easeOutQuad, easeOutQuint, linear, makeRef, range, waitFor, waitUntil } from '@motion-canvas/core';

import { ImageStack } from '../components/ImageStack';

import grass_good from '../../images/grass.png';
import grass_bad from '../../images/grass.jpg';
import hd_good from '../../images/hd-high.jpg';
import hd_bad from '../../images/hd-low.jpg';
import machine from '../../images/machine.png';
import machine2 from '../../images/machine_2.png';

import { shake, hop } from '../Util';

export default makeScene2D(function* (view) {
	// const imageStackRef = createRef<ImageStack>();
	const machineRef = createRef<Img>();
	const layoutRef = createRef<Layout>();
	const labelRef = createRef<Txt>();
	const label2Ref = createRef<Txt>();
	// const videoRef = createRef<Video>();

	view.fill('#111');
	view.add(
		<Layout ref={layoutRef} width='100%' height='100%'>
			<Txt text='Texture Compression' width='100%' height='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>

			<Img ref={machineRef} src={machine} width='20%' zIndex={10}/>
			<Txt text='&nbsp;&nbsp;JPEG Compression' ref={labelRef} width='100%' x={1920 / 2 - 335} height='25%' y={320} padding={48} fontSize={48} textAlign='left' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
			<Txt text='' ref={label2Ref} width='100%' height='25%' y={320} padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900} opacity={0}/>
		</Layout>
	);

	machineRef().filters.brightness(0.6);
	machineRef().filters.contrast(1.2);

	let grass = <Img
		src={grass_good}
		x={-580}
		y={-600}
		scale={1.55}
		width={300}
		radius={16}
		opacity={0}
	/> as Img;

	layoutRef().add(grass);

	yield* waitUntil('grassEnter');

	yield* all(
		grass.y(0, 0.6),
		grass.scale(1.6, 0.6),
		grass.opacity(1, 0.6)
	);

	yield* waitFor(1);

	yield* all(
		grass.scale(0.5, 0.5),
		grass.x(0, 0.5),
		grass.y(50, 0.5),
		waitFor(0.4, shake(machineRef(), 0.5, 10))
	);

	yield* waitFor(0.3);

	yield* hop(machineRef(), 0.3, 50);

	grass.src(grass_bad);

	yield* all(
		grass.scale(1.6, 0.5),
		grass.x(580, 0.5),
		grass.y(0, 0.5)
	);

	yield* waitUntil('grassExit');

	yield* all(
		grass.y(600, 0.6),
		grass.scale(1.55, 0.6),
		grass.opacity(0, 0.6)
	);

	yield* waitUntil('rename');

	yield* labelRef().text(labelRef().text() + '\n- Compression Ratio', 0.5);
	yield* waitFor(0.1);
	yield* labelRef().text(labelRef().text() + '\n+ Fast Texture Reads', 0.5);
	yield* waitFor(0.3);
	yield* labelRef().text(labelRef().text() + '\n= GPU Compression', 0.5);

	label2Ref().text('GPU Compression');

	label2Ref().y(491);
	label2Ref().x(-14)

	yield* all(
		waitFor(0.1, labelRef().opacity(0, 0.4)),
		label2Ref().opacity(1, 0.4),
	);

	yield all(
		label2Ref().position([ 0, 320 ], 0.5),
		label2Ref().fill('#00E5E5', 0.5)
	);

	yield* waitFor(0.4);
	yield hop(machineRef(), 0.3, 50);
	yield* waitFor(0.15);
	machineRef().src(machine2);
	machineRef().filters.brightness(0.75);
	machineRef().filters.contrast(4);
	yield* waitFor(0.15);

	yield* waitUntil('hdEnter');

	grass.src(hd_good);
	grass.y(-600);
	grass.scale(1.55);
	grass.opacity(0);
	grass.x(-580);

	yield* all(
		grass.y(0, 0.6),
		grass.scale(1.6, 0.6),
		grass.opacity(1, 0.6)
	);

	yield* waitFor(1);

	yield* all(
		grass.scale(0.5, 0.5),
		grass.x(0, 0.5),
		grass.y(50, 0.5),
		waitFor(0.4, shake(machineRef(), 0.8, 20))
	);

	yield* waitFor(0.3);

	yield* hop(machineRef(), 0.3, 50);

	grass.src(hd_bad);

	yield* all(
		grass.scale(1.6, 0.5),
		grass.x(580, 0.5),
		grass.y(0, 0.5)
	);

	yield* waitUntil('hdExit');

	yield* all(
		grass.y(800, 0.6),
		grass.scale(1.55, 0.6),
		grass.opacity(0, 0.6)
	);

	yield* waitUntil('comparisonAppear');

	yield* all(
		machineRef().y(800, 0.6),
		machineRef().scale(0.7, 0.6),
		machineRef().opacity(0, 0.3),
		label2Ref().y(900, 0.6),
		label2Ref().scale(0.7, 0.6),
		label2Ref().opacity(0, 0.3),
	);


	let block1 = createRef<Layout>();
	let block2 = createRef<Layout>();
	let block3 = createRef<Layout>();

	view.add(
		<>
			<Layout ref={block1}>
				<Txt text='1.' width='100%' height='100%' y={80 + 180} x={128} padding={48} fontSize={300} textAlign='left' fill='#ff85a922' fontFamily={'Montserrat Black'} fontWeight={900}/>
				<Txt text='DXT1' width='100%' height='100%' y={240 + 180} x={128} padding={48} fontSize={48} textAlign='left' fill='#ff85a9' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Txt text={'- 6x Compression Ratio\n- One Bit Alpha (on/off)\n- Most Compact'} width='100%' height='100%' y={320 + 180} lineHeight={50} x={128} padding={48} fontSize={32} textAlign='left' fill='#fff8' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
			</Layout>
			<Layout ref={block2} x={600}>
				<Txt text='2.' width='100%' height='100%' y={80 + 180} x={128} padding={48} fontSize={300} textAlign='left' fill='#99ff7d22' fontFamily={'Montserrat Black'} fontWeight={900}/>
				<Txt text='DXT3' width='100%' height='100%' y={240 + 180} x={128} padding={48} fontSize={48} textAlign='left' fill='#99ff7d' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Txt text={'- 4x Compression Ratio\n- More Precise Alpha\n- For High Freq. Alpha'} width='100%' height='100%' y={320 + 180} lineHeight={50} x={128} padding={48} fontSize={32} textAlign='left' fill='#fff8' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
			</Layout>
			<Layout ref={block3} x={1200}>
				<Txt text='3.' width='100%' height='100%' y={80 + 180} x={128} padding={48} fontSize={300} textAlign='left' fill='#80bfff22' fontFamily={'Montserrat Black'} fontWeight={900}/>
				<Txt text='DXT5' width='100%' height='100%' y={240 + 180} x={128} padding={48} fontSize={48} textAlign='left' fill='#80bfff' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Txt text={'- 4x Compression Ratio\n- Smoother Alpha\n- For Low Freq. Alpha'} width='100%' height='100%' y={320 + 180} lineHeight={50} x={128} padding={48} fontSize={32} textAlign='left' fill='#fff8' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
			</Layout>
		</>
	);

	block1().children().map(child => child.opacity(0));
	block2().children().map(child => child.opacity(0));
	block3().children().map(child => child.opacity(0));

	yield* all(...block1().children().map((child, i) => chain(waitFor(0.1 * i + (i >= 1 ? 0.3 : 0)), all(
		child.y(child.y() + 50).y(child.y() - 50, 0.5, easeOutCubic),
		child.opacity(1, 0.5, easeOutCubic)
	))));

	yield* waitFor(0.2);

	yield* all(...block2().children().map((child, i) => chain(waitFor(0.1 * i + (i >= 1 ? 0.3 : 0)), all(
		child.y(child.y() + 50).y(child.y() - 50, 0.5, easeOutCubic),
		child.opacity(1, 0.5, easeOutCubic)
	))));

	yield* waitFor(0.2);

	yield* all(...block3().children().map((child, i) => chain(waitFor(0.1 * i + (i >= 1 ? 0.3 : 0)), all(
		child.y(child.y() + 50).y(child.y() - 50, 0.5, easeOutCubic),
		child.opacity(1, 0.5, easeOutCubic)
	))));


	yield* waitUntil('comparisonExit');

	yield* all(

		...block1().children().reverse().map((child, i) => chain(waitFor(0.05 * i + (i >= 1 ? 0.1 : 0)), all(
			child.y(child.y() + 400, 0.5, easeInCubic),
			child.opacity(0, 0.5, easeInCubic)
		))),

		...block2().children().reverse().map((child, i) => chain(waitFor(0.1 + 0.05 * i + (i >= 1 ? 0.1 : 0)), all(
			child.y(child.y() + 400, 0.5, easeInCubic),
			child.opacity(0, 0.5, easeInCubic)
		))),

		...block3().children().reverse().map((child, i) => chain(waitFor(0.2 + 0.05 * i + (i >= 1 ? 0.1 : 0)), all(
			child.y(child.y() + 400, 0.5, easeInCubic),
			child.opacity(0, 0.5, easeInCubic)
		)))
	)

	yield* waitFor(2);
});
