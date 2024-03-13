import { makeScene2D, Layout, Txt, Img, Rect, Video, Gradient } from '@motion-canvas/2d';
import { PossibleVector2, Vector2, all, chain, createRef, createRefMap, easeInCubic, easeInOutCubic, easeInQuad, easeOutCubic, easeOutElastic, easeOutQuad, easeOutQuint, linear, makeRef, range, tween, waitFor, waitUntil } from '@motion-canvas/core';

import { ImageStack } from '../components/ImageStack';
import { OutlinedBox } from '../components/OutlinedBox';

import pam from '../../images/pam.jpg';
import gpu from '../../images/gpu.png';
import explode from '../../videos/explosion.webm'

import tex0 from '../../images/cobblestone.png';
import tex1 from '../../images/dirt.png';
import tex2 from '../../images/leaves_opaque.png';
import tex3 from '../../images/oak_planks.png';
import tex4 from '../../images/light.png';
import tex5 from '../../images/grass.png';
import tex6 from '../../images/podzol.png';

import cat0 from '../../images/cat-0.jpg';
import cat1 from '../../images/cat-1.jpg';
import cat2 from '../../images/cat-2.jpg';
import cat3 from '../../images/cat-3.jpg';
import cat4 from '../../images/cat-4.jpg';
import cat5 from '../../images/cat-5.jpg';
import cat6 from '../../images/cat-6.jpg';

import { shake } from '../Util';

export default makeScene2D(function* (view) {
	const layoutRef = createRef<Layout>();

	view.fill('#111');

	{
		const imageStackRef = createRef<ImageStack>();
		const imageRef = createRef<Img>();
		const gpuRef = createRef<Img>();

		view.add(
			<Layout ref={layoutRef} width='100%' height='100%'>
				<Txt text='Texture Arrays' width='100%' height='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<ImageStack
					ref={imageStackRef}
					size={600}
					y={48}
					radius={32}

					antialiased={false}
					images={[ tex0, tex1, tex2, tex3, tex4, tex6, tex5 ]}
				/>
			</Layout>
		);

		yield* waitFor(2);

		yield* all(
			imageStackRef().spread([ 64, 48 ], 0.5),
			imageStackRef().scale([ 0.95, 1 ], 0.5),
			imageStackRef().size(500, 0.5)
		);

		yield* waitUntil('pam');

		yield* all(
			imageStackRef().y(imageStackRef().y() + 100, 0.2, easeInCubic),
			imageStackRef().opacity(0, 0.2, easeInCubic),
			waitFor(0.5)
		)

		layoutRef().add(
			<>
				<Img src={pam} width='72%' height='85%' y={48} radius={32} shadowColor='black' shadowBlur={32} shadowOffsetY={16}/>
				<Img ref={imageRef} src={tex5} width={180} smoothing={false} radius={16} shadowBlur={32} shadowColor='black' shadowOffset={[ -8, 16 ]}/>
				<Img ref={gpuRef} src={gpu} width='35%' position={[ 200, 200 ]}/>
			</>
		);

		imageStackRef().zIndex(1);
		imageStackRef().scale([ 0.95 * 0.3, 0.3 ]);
		imageStackRef().position([ 440, -180 ]);
		imageRef().position([ -330, -245 ]);
		gpuRef().shadowBlur(64);
		gpuRef().shadowColor('white');

		yield* all(
			...layoutRef().children().slice(1).flatMap(node => [
				node.y(node.y() + 100).y(node.y() - 100, 0.3, easeOutCubic),
				node.opacity(0).opacity(1, 0.15, easeOutCubic),
			])
		);

		yield* waitUntil('sizes');

		yield* all(
			...layoutRef().children().slice(1).flatMap(node => [
				node.y(node.y() + 100, 0.3, easeOutCubic),
				node.opacity(0, 0.15, easeOutCubic),
			])
		);

		layoutRef().children().slice(1).forEach(c => c.remove());
		yield* waitFor(0.2);
	}

	{
		const stacks: ImageStack[] = [];

		yield layoutRef().add(
			<>
				<ImageStack
					ref={makeRef(stacks, 0)}
					size={200}
					y={260}
					radius={32}
					x={-580}
					zIndex={10}

					antialiased={false}
					images={[ cat0, cat4, cat3 ]}
				/>

				<Txt
					text='256x'
					width='100%'
					height='100%'
					x={-580}
					y={920}
					padding={48}
					fontSize={40}
					textAlign='center'
					fill='#999'
					fontFamily={'Jetbrains Mono'}
					fontWeight={900}
				/>

				<ImageStack
					ref={makeRef(stacks, 1)}
					size={250}
					y={260 - 28}
					radius={32}
					x={-40}
					zIndex={10}

					antialiased={false}
					images={[ cat3, cat4, cat5 ]}
				/>

				<Txt
					text='512x'
					width='100%'
					height='100%'
					x={-45}
					y={920}
					padding={48}
					fontSize={40}
					textAlign='center'
					fill='#999'
					fontFamily={'Jetbrains Mono'}
					fontWeight={900}
				/>

				<ImageStack
					ref={makeRef(stacks, 2)}
					size={300}
					y={260 - 60}
					radius={32}
					x={550}
					zIndex={10}

					antialiased={false}
					images={[ cat6, cat0, cat2 ]}
				/>

				<Txt
					text='1024x'
					width='100%'
					height='100%'
					x={560}
					y={920}
					padding={48}
					fontSize={40}
					textAlign='center'
					fill='#999'
					fontFamily={'Jetbrains Mono'}
					fontWeight={900}
				/>
			</>
		);

		yield stacks[0].spread([ 12, 12 ], 0);
		yield stacks[1].spread([ 16, 16 ], 0);
		yield stacks[2].spread([ 24, 24 ], 0);

		yield* all(
			...layoutRef().children().slice(1).flatMap(node => [
				node.y(node.y() + 100).y(node.y() - 100, 0.3, easeOutCubic),
				node.opacity(0).opacity(1, 0.15, easeOutCubic),
			])
		);

		const sizes = [ 200, 250, 300 ];

		const images: [ string, number ][] = [
			[ cat0, 0 ],
			[ cat1, 1 ],
			[ cat2, 2 ],
			[ cat3, 0 ],
			[ cat4, 2 ],
			[ cat5, 1 ],
			[ cat6, 0 ]
		];

		yield* waitUntil('startAdd');

		for (let [ src, index ] of images) {
			const image =
				<Img
					src={src}
					size={sizes[index] * 1.2}
					shadowColor='black'
					shadowBlur={32}
					shadowOffsetY={16}
					radius={32}
					y={-200}
				/>;

			layoutRef().add(image);

			yield* all(
				image.y(image.y() - 100).y(image.y() + 100, 0.3, easeOutCubic),
				image.opacity(0).opacity(1, 0.15, easeOutCubic),
			);

			yield* waitFor(0.5);

			yield* all(
				image.scale(0.7, 0.4),
				tween(0.4, value => image.position(Vector2.arcLerp(
					new Vector2(image.position()),
					new Vector2(stacks[index].position()),
					easeInOutCubic(value),
					false,
					0
				))),
				waitFor(0.2, stacks[index].scale(stacks[index].scale().mul(1.1), 0.3, easeOutElastic))
			);

			image.remove();
		}

		yield* waitUntil('gpuExplode');

		yield* all(
			...layoutRef().children().slice(1).flatMap(node => [
				node.y(node.y() + 100, 0.3, easeOutCubic),
				node.opacity(0, 0.15, easeOutCubic),
			])
		);

		layoutRef().children().slice(1).forEach(c => c.remove());
		yield* waitFor(0.2);
	}

	{
		const imageRef = createRef<Img>();
		const layoutRef = createRef<Layout>();
		const videoRef = createRef<Video>();

		view.fill('#111');
		view.add(
			<Layout ref={layoutRef} width='100%' height='100%'>
				<Img ref={imageRef} src={gpu} width='65%'/>
				<Video ref={videoRef} src={explode} scale={28} x={60} opacity={0} smoothing={false}/>
			</Layout>
		);

		yield* all(
			imageRef().y(imageRef().y() + 100).y(imageRef().y() - 100, 0.3, easeOutCubic),
			imageRef().opacity(0).opacity(1, 0.15, easeOutCubic)
		);

		yield* shake(imageRef(), 0.5, 10);
		yield* shake(imageRef(), 0.5, 20);
		yield* shake(imageRef(), 0.5, 40);

		// videoRef().opacity(1);
		// videoRef().play();

		yield* shake(imageRef(), 0.83, 200);
		imageRef().opacity(0);

		yield* waitFor(1);
		yield* waitUntil('sizeIssue');
	}

	{
		const imageStackRef = createRef<ImageStack>();
		const slotContainer = createRef<Layout>();
		const slotBoxes: OutlinedBox[] = [];
		const textUsed = createRef<Txt>();
		const textWasted = createRef<Txt>();

		const slotSize = 100;
		const slotSpanX = 11;
		const slotSpanY = 6;
		const slotSpacing = 8;

		layoutRef().add(
			<>
				<ImageStack
					ref={imageStackRef}
					size={200}
					y={-150}
					x={-670}
					radius={24}
					opacity={0}

					antialiased={false}
					images={[ tex0, tex1, tex2, tex3, tex4, tex6, tex5 ]}
				/>
				<Layout
					width={(slotSize + slotSpacing) * slotSpanX}
					height={(slotSize + slotSpacing) * slotSpanY}
					x={-410}
					y={-280}
				>
					{range(slotSpanX * slotSpanY).map(i => {
						return (
							<OutlinedBox
								ref={makeRef(slotBoxes, i)}
								x={(i % slotSpanX) * (slotSize + slotSpacing)}
								y={Math.floor(i / slotSpanX) * (slotSize + slotSpacing)}
								width={slotSize}
								height={slotSize}
								strokeWidth={4}
								stroke='#fff6'
								offset={-1}
							/>
						);
					})}
				</Layout>
				<Txt ref={textUsed} text='Used' width='100%' height='100%' x={550} y={200} fontSize={40} textAlign='left' fill='white' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Txt ref={textWasted} text='Unused' width='100%' height='100%' x={1320} y={200} fontSize={40} textAlign='left' fill='white' fontFamily={'Jetbrains Mono'} fontWeight={900}/>

				<Rect
					fill={new Gradient({
						type: 'linear',
						fromY: -100,
						toY: 100,
						stops: [
							{ color: '#1110', offset: 0 },
							{ color: '#111', offset: 0.5 },
							{ color: '#111', offset: 1 }
						]
					})}
					width='100%'
					height={300}
					y={330}
					zIndex={10}
				/>
			</>
		);

		textUsed().save();
		textUsed().text('');
		textWasted().save();
		textWasted().text('');

		yield imageStackRef().spread([ 8, 8 ], 0);

		yield all(
			...layoutRef().children().slice(1).flatMap(node => [
				node.y(node.y() + 100).y(node.y() - 100, 0.3, easeOutCubic),
				node.opacity(0).opacity(1, 0.15, easeOutCubic),
			])
		);

		yield* all(
			...slotBoxes.flatMap((box, i) =>
				chain(waitFor(0.03 * ((i % slotSpanX) + Math.floor(i / slotSpanX) * 2)), box.animateIn(0.3))),
			...slotBoxes.slice(0, 7).flatMap((box, i) =>
				chain(waitFor(0.6 + 0.05 * (i % slotSpanX), box.fill('white', 0.3)))),
			waitFor(0.8, textUsed().restore(1)),
			waitFor(1.5, textWasted().restore(1)),
		);

		yield* waitUntil('removeUnused');

		yield* all(
			...slotBoxes.slice(11).flatMap((box, i) =>
				chain(waitFor(0.03 * ((i % slotSpanX) + Math.floor(i / slotSpanX) * 2)), box.animateOut(0.3))),
		);

		yield* waitUntil('reAddUnused');

		yield* all(
			...slotBoxes.slice(11).flatMap((box, i) =>
				chain(waitFor(0.03 * ((i % slotSpanX) + Math.floor(i / slotSpanX) * 2)), box.animateIn(0.3))),
		);

		const randomPos: PossibleVector2[] = [
			[ -400, -200 ],
			[ 100, 250 ],
			[ 500, 50 ]
		]

		for (let i = 0; i < randomPos.length; i++) {
			let txt = <Txt
				text='?'
				fontFamily='Montserrat Black'
				fontWeight={900}
				fontSize={600}
				fill='white'
				position={randomPos[i]}
				zIndex={200}
				opacity={0}
			/>;

			layoutRef().add(txt);

			yield all(
				waitFor(0.2 + 0.1 * i, txt.opacity(0.3, 0.6, easeOutQuad)),
				waitFor(0.2 + 0.6 + 0.1 * i, txt.opacity(0, 0.6, easeInQuad)),
				waitFor(0.2 + 0.1 * i, txt.position(txt.position().add(new Vector2(0, 100))).position(txt.position().add(new Vector2(0, -200)), 1.2, linear)),
			)
		}
	}

	yield* waitFor(3);

	yield* all(
		...layoutRef().children().slice(1).flatMap(node => [
			node.y(node.y() + 100, 0.6, easeOutCubic),
			node.opacity(0, 0.3, easeOutCubic),
		])
	);
});
