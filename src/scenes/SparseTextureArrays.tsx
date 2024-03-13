import { makeScene2D, Layout, Txt, Img, Rect, Gradient, Video } from '@motion-canvas/2d';
import { PossibleVector2, Vector2, all, chain, createRef, createRefMap, createSignal, easeInCubic, easeInOutCubic, easeInOutQuint, easeInQuint, easeOutCubic, easeOutElastic, easeOutQuad, easeOutQuint, linear, makeRef, range, tween, waitFor, waitUntil } from '@motion-canvas/core';

import img_grass from '../../images/grass.png';
import img_cat from '../../images/rock_cat.png';
import explode from '../../videos/explosionMd.webm'

import tex_cobble from '../../images/cobblestone.png';
import tex_dirt from '../../images/dirt.png';
import tex_leaves from '../../images/leaves_opaque.png';
import tex_planks from '../../images/oak_planks.png';
import tex_light from '../../images/light.png';
import tex_grass from '../../images/grass.png';
import tex_podzol from '../../images/podzol.png';
import tex_stump from '../../images/log_stump_side.png';
import tex_sand from '../../images/sand_edge.png';
import tex_blue from '../../images/tall_blue_far_top.png';
import tex_water from '../../images/water.png';

import { OutlinedBox } from '../components/OutlinedBox';
import { YardSick } from '../components/YardStick';
import { CroppedTexture } from '../components/CroppedTexture';
import { ImageStack } from '../components/ImageStack';
import { shake } from '../Util';

export default makeScene2D(function* (view) {
	const layoutRef = createRef<Layout>();

	{
		const titleRef = createRef<Txt>();
		const invasionRef = createRef<Txt>();
		const videoRef = createRef<Video>();

		view.fill('#111');
		yield view.add(
			<Layout ref={layoutRef} width='100%' height='100%'>
				<Txt ref={titleRef} text='Texture Arrays' width='100%' height='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Txt ref={invasionRef} text='Sparse Textures' width='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Video ref={videoRef} src={explode} scale={15} x={60} y={-450} opacity={0} smoothing={false}/>
			</Layout>
		);

		yield all(
			invasionRef().position([ 900, 200 ]).position([ 0, -480 ], 0.8, linear),
			invasionRef().rotation(750).rotation(0, 0.8, linear)
		);

		yield* waitFor(0.6);

		// videoRef().opacity(1);
		// videoRef().play();

		yield* waitFor(0.3);

		invasionRef().remove();
		titleRef().text('Sparse Texture Arrays');

		yield* waitFor(0.1);

		yield* all(
			titleRef().scale(2, 1),
			titleRef().y(500, 1),
			waitUntil("smallTitle", all(
				titleRef().scale(1, 1),
				titleRef().y(0, 1)
			))
		)

		yield* waitUntil('ramIn');

		// videoRef().remove();
	}

	{

		const physicalContainer = createRef<Layout>();
		const physicalText = createRef<Txt>();
		const physicalBoxes: OutlinedBox[] = [];
		const virtualContainer = createRef<Layout>();
		const virtualBoxes: OutlinedBox[] = [];
		const virtualText = createRef<Txt>();
		const arrayContainer = createRef<Layout>();
		const arrayBoxes: OutlinedBox[] = [];
		const arrayText = createRef<Txt>();
		const unallocatedText = createRef<Txt>();
		const usedText = createRef<Txt>();

		const boxSize = 116;
		const physicalSpanX = 4;
		const physicalSpanY = 7;
		const virtualSpanX = 2;
		const virtualSpanY = 9;
		const arraySpanX = 1;
		const arraySpanY = 9;

		layoutRef().add(
			<>
				<Layout
					zIndex={30}
					ref={physicalContainer}
					width={boxSize * physicalSpanX}
					height={boxSize * physicalSpanY}
					offsetX={1}
					y={-360}
				>
					<Txt
						ref={physicalText}
						layout={false}
						fill='#fffa'
						fontSize={36}
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						text=''
						width={boxSize * physicalSpanX}
						x={0}
						y={-50}
						textAlign='right'
						offsetX={-1}
					/>
					<Layout width={boxSize * physicalSpanX} height={boxSize * physicalSpanY}>
						{range(physicalSpanX * physicalSpanY).map(i => {
							return (
								<OutlinedBox
									ref={makeRef(physicalBoxes, i)}
									x={(i % physicalSpanX) * boxSize}
									y={Math.floor(i / physicalSpanX) * boxSize}
									width={boxSize}
									height={boxSize}
									strokeWidth={[
										4,
										i % physicalSpanX == physicalSpanX - 1 ? 4 : 0,
										Math.floor(i / physicalSpanX) == physicalSpanY - 1 ? 4 : 0,
										4
									]}
									stroke='#fff3'
									offset={-1}
								/>
							);
						})}
					</Layout>
				</Layout>

				<Layout
					zIndex={30}
					ref={virtualContainer}
					width={boxSize * virtualSpanX}
					height={boxSize * virtualSpanY}
					offsetX={1}
					y={-360}
					>
					<Txt
						ref={virtualText}
						layout={false}
						fill='#fffa'
						fontSize={36}
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						text=''
						x={0}
						y={-50}
						textAlign='left'
						offsetX={-1}
					/>
					<Layout width={boxSize * virtualSpanX} height={boxSize * virtualSpanY}>
						{range(virtualSpanX * virtualSpanY).map(i => {
							return (
								<OutlinedBox
									ref={makeRef(virtualBoxes, i)}
									x={(i % virtualSpanX) * boxSize}
									y={Math.floor(i / virtualSpanX) * boxSize}
									width={boxSize}
									height={boxSize}
									strokeWidth={[
										Math.floor(i / virtualSpanX) != virtualSpanY ? 4 : 0,
										i % virtualSpanX == virtualSpanX - 1 ? 4 : 0,
										Math.floor(i / virtualSpanX) == virtualSpanY - 1 ? 4 : 0,
										4
									]}
									stroke='#fff3'
									offset={-1}
								/>
							);
						})}
					</Layout>
				</Layout>

				<Layout
					zIndex={30}
					ref={arrayContainer}
					width={boxSize * arraySpanX}
					height={boxSize * arraySpanY}
					offsetX={1}
					y={-360}
					>
					<Txt
						ref={arrayText}
						layout={false}
						fill='#fffa'
						fontSize={36}
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						text=''
						x={0}
						y={-50}
						textAlign='left'
						offsetX={-1}
					/>
					<Txt
						ref={unallocatedText}
						layout={false}
						fill='#fff6'
						fontSize={32}
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						text=''
						x={boxSize + 24}
						y={boxSize / 2}
						textAlign='left'
						offsetX={-1}
					/>
					<Txt
						ref={usedText}
						layout={false}
						fill='#fff6'
						fontSize={32}
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						text='Used'
						x={boxSize + 24}
						y={boxSize / 2}
						textAlign='left'
						opacity={0}
						offsetX={-1}
					/>
					<Layout width={boxSize * arraySpanX} height={boxSize * arraySpanY}>
						{range(arraySpanX * arraySpanY).map(i => {
							return (
								<OutlinedBox
									ref={makeRef(arrayBoxes, i)}
									x={(i % arraySpanX) * boxSize}
									y={Math.floor(i / arraySpanX) * boxSize}
									width={boxSize}
									height={boxSize}
									strokeWidth={[
										i == 0 ? 4 : 0,
										i % arraySpanX == arraySpanX - 1 ? 4 : 0,
										4,
										4
									]}
									stroke='#fff3'
									offset={-1}
								/>
							);
						})}
					</Layout>
				</Layout>
				<Rect
					fill={new Gradient({
						type: 'linear',
						fromY: -100,
						toY: 100,
						stops: [
							{ color: '#1110', offset: 0 },
							{ color: '#111', offset: 0.3 },
							{ color: '#111', offset: 1 }
						]
					})}
					zIndex={100}
					width='50%'
					height={300}
					y={540}
					x={-600}
				/>
			</>
		);

		yield* all(
			physicalContainer().x(900).x(630, 0.5),
			virtualContainer().x(-1000).x(-750, 0.5),
			arrayContainer().x(-800).x(-520, 0.5),

			chain(waitFor(0.1), virtualText().text('Virtual Mem', 0.5)),
			chain(waitFor(0.1), physicalText().text('Physical Mem', 0.5)),

			...physicalBoxes.flatMap((box, i) =>
				chain(waitFor(0.05 * ((i % physicalSpanX) + Math.floor(i / physicalSpanX))), box.animateIn(0.3))),
			...virtualBoxes.slice(0, physicalSpanX * physicalSpanY).flatMap((box, i) =>
				chain(waitFor(0.05 * ((i % virtualSpanX) + Math.floor(i / virtualSpanX))), box.animateIn(0.3))),
		);

		yield* waitUntil('addArray');

		yield* all(
			chain(waitFor(0.1), arrayText().text('Array', 0.5)),
			...arrayBoxes.flatMap((box, i) =>
				chain(waitFor(0.6 * Math.min(i, 4) + 0.3 * Math.max(i - 4, 0)), box.animateIn(0.3))),
			...virtualBoxes.flatMap((box, i) =>
				chain(waitFor(0.05 * (i % 4) + 0.6 * Math.floor(i / 4)), box.fill('#396ae618', 0.3))),
			chain(waitFor(0.2), unallocatedText().text('Unallocated', 0.5)),
		)

		yield* waitUntil('startInsert');

		const images = [
			tex_grass,
			tex_leaves,
			tex_blue,
			tex_podzol,
			tex_water,
			tex_sand
		];

		for (let i = 0; i < images.length; i++) {
			let image = <Img
				src={images[i]}
				width={boxSize * 2}
				height={boxSize * 2}
				smoothing={false}
				radius={24}
			/> as Img;

			let arrayImage = <Img
				src={images[i]}
				width={boxSize - 8}
				height={boxSize - 4}
				smoothing={false}
				opacity={0}
				x={-520}
				y={-304 + boxSize * i}
			/> as Img;

			let arrow = <YardSick
				zIndex={100}
				start={[ -750, -242 ]}
				end={[ 520, -245 ]}
				stroke='#396ae6'
				strokeWidth={8}
				arrowSize={24}
				textTransformer={() => ''}
				opacity={0}
			/> as YardSick;

			layoutRef().add(image);
			layoutRef().add(arrayImage);
			layoutRef().add(arrow);

			yield* all(
				image.y(-300).y(0, 0.5, easeOutCubic),
				image.opacity(0).opacity(1, 0.3, easeInCubic)
			);

			yield* waitFor(0.2);

			let physCellOffset = new Vector2((boxSize * 2) * (i % 2), (boxSize * 2) * Math.floor(i / 2));
			let virtCellOffset = new Vector2(0, (boxSize * 2) * i);

			const arrowStart = new Vector2(arrow.start().add(virtCellOffset));
			const arrowEnd = new Vector2(arrow.end().add(physCellOffset));

			yield* all(
				waitFor(0.2, image.opacity(0.85, 0.2)),
				waitFor(0.3, image.radius(0, 0.1)),
				tween(0.6, value => image.position(Vector2.arcLerp(
					new Vector2(image.position()),
					new Vector2(514, -244).add(physCellOffset),
					easeInOutCubic(value),
					true,
					0
				))),

				waitFor(0.3, all(
					arrayImage.opacity(1, 0.25, easeOutCubic),
					arrayImage.scale(0.5).scale(1, 0.25, easeOutCubic),
					unallocatedText().y((1 + i + 0.5) * boxSize, 0.25),
					usedText().opacity(1, 0.5)
				)),

				waitFor(0.3, all(...virtualBoxes.slice(i * 4, i * 4 + 4).map(
					(cell, i) => waitFor(i * 0.05, cell.fill('#396ae633', 0.2))))),

				waitFor(0.1, all(
					arrow.opacity(1, 0.2),
					arrow.start(arrowStart).end(arrowStart).end(arrowEnd, 0.6),
					waitFor(0.5, arrow.start(arrowEnd.sub([ 1, 1 ]), 0.6)),
					waitFor(0.8, arrow.opacity(0, 0.2))
				))
			);

			yield* waitFor(0.5);
		}

		yield* waitUntil('textureSlots');

		yield* all(
			...layoutRef().children().slice(1).flatMap(node => [
				node.y(node.y() + 100, 0.3, easeOutCubic),
				node.opacity(0, 0.15, easeOutCubic),
			])
		);
	}

	{
		const bindSlotsContainer = createRef<Layout>();
		const bindSlots: OutlinedBox[] = [];
		const bindSlotGap = 16;
		const bindSlotSize = 96;

		const stackContainer = createRef<Layout>();
		const stackContainers: Layout[] = [];
		const stackContainerStrings = [ '32x', '64x', '128x', '256x', '512x', '1024x', '2048x', '4096x' ];
		const stackContainerSizes = [ 100, 110, 120, 130, 140, 150, 160, 170 ];
		const stackContainerGap = 80;

		yield layoutRef().add(
			<>
				<Layout
					ref={stackContainer}
					x={-750}
					y={-210}
				>
					{range(8).map(i => {
						let list: string[] = [
							[ tex_dirt, tex_grass, tex_cobble ],
							[ tex_podzol, tex_dirt, tex_grass ],
							[ tex_cobble, tex_dirt, tex_sand ],
							[ tex_leaves, tex_dirt, tex_stump ],
							[ tex_planks, tex_leaves, tex_light ],
							[ tex_cobble, tex_light, tex_water ],
							[ tex_blue, tex_dirt, tex_leaves ],
							[ tex_planks, tex_stump, tex_grass ],
						][i];

						return (
							<Layout
								ref={makeRef(stackContainers, i)}
								x={() => range(i).map(i => stackContainerSizes[i]).reduce((a, b) => a + b + stackContainerGap, 0)}
							>
								<ImageStack
									size={stackContainerSizes[i]}
									y={-stackContainerSizes[i] / 2}
									radius={16}
									antialiased={false}
									images={list.slice(0, 3)}
								/>

								<Txt
									text={stackContainerStrings[i]}
									width={stackContainerSizes[i]}
									x={8}
									y={50}
									padding={48}
									fontSize={36}
									textAlign='center'
									fill='#999'
									fontFamily={'Jetbrains Mono'}
									fontWeight={900}
								/>
							</Layout>
						);
					})}
				</Layout>

				<Layout
					ref={bindSlotsContainer}
					offset={[ -1, -1 ]}
					width={(bindSlotSize + bindSlotGap) * 8 - bindSlotGap}
					height={(bindSlotSize + bindSlotGap) * 2 - bindSlotGap}
					x={-(bindSlotSize + bindSlotGap) * 4}
					y={280}
				>
					<Txt
						text={'Texture Bind Slots'}
						x={-340}
						y={-150}
						padding={48}
						fontSize={36}
						width={300}
						fill='#ccc'
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						textAlign='left'
					/>

					{range(16).map(index => {
						return (
							<OutlinedBox
								ref={makeRef(bindSlots, index)}
								x={(bindSlotSize + bindSlotGap) * (index % 8 - 3.5)}
								y={-(bindSlotSize + bindSlotGap) / 2 + (bindSlotSize + bindSlotGap) * Math.floor(index / 8)}
								width={bindSlotSize}
								height={bindSlotSize}
								strokeWidth={4}
								stroke='white'
								fill='#fff1'
							/>
						);
					})}
				</Layout>
			</>
		);

		stackContainers.map(i => i.opacity(0));
		yield* all(...stackContainers.map(i => (i.children()[0] as ImageStack).spread(8, 0)));

		yield* all(
			...bindSlots.map((s, i) => waitFor(0.05 * ((i % 8) + Math.floor(i / 8)), s.animateIn(0.2))),
			(bindSlotsContainer().children()[0] as Txt).text('').text('Texture Bind Slots', 0.5)
		);

		yield* waitUntil('initial8');

		for (let i = 0; i < stackContainers.length; i++) {
			const stack = stackContainers[i];

			yield* all(
				stack.opacity(0).opacity(1, 0.5, easeOutCubic),
				stack.y(stack.y() - 100).y(stack.y() + 100, 0.5, easeOutCubic),
				bindSlots[i].fill('white', 0.5)
			);
		}

		yield* waitUntil('next8');

		for (let i = 0; i < 8; i++) {
			const stack = stackContainers[i];

			const stack2 = stack.clone();
			stack.parent().add(stack2);
			stack2.opacity(0);
			stack2.y(stack2.y() + 180);
			const images = stack2.children()[0] as ImageStack;
			images.images([...images.images()].reverse());
			stackContainers.push(stack2);

			yield* all(
				stack2.opacity(1, 0.5, easeOutCubic),
				stack2.y(stack2.y() + 100, 0.5, easeOutCubic),
				bindSlots[i + 8].fill('white', 0.5),
				shake(bindSlotsContainer(), 1, Math.pow(i, 2))
			);
		}

		// yield shake(bindSlotsContainer(), 0.5, 64);
		yield* bindSlotsContainer().rotation(100, 2, easeOutElastic);
		yield* all(
			bindSlotsContainer().y(1000, 0.2, easeInCubic),
			bindSlotsContainer().rotation(130, 0.15, easeInCubic)
		);

		for (let [ k, i ] of range(16).sort(() => Math.random() - 0.5).map((k, i) => [ k, i ])) {
			let container = stackContainers[k];
			yield waitFor(0.1 * i, all(
				container.y(container.y() + 100, 0.3, easeInCubic),
				container.opacity(0, 0.3, easeInCubic)
			));
		}
		yield* waitFor(2);


		// yield* all(
		// 	...layoutRef().children().slice(1).flatMap(node => [
		// 		node.y(node.y() + 100).y(node.y() - 100, 0.3, easeOutCubic),
		// 		node.opacity(0).opacity(1, 0.15, easeOutCubic),
		// 	])
		// );

		// const sizes = [ 200, 250, 300 ];

		// const images: [ string, number ][] = [
		// 	[ cat0, 0 ],
		// 	[ cat1, 1 ],
		// 	[ cat2, 2 ],
		// 	[ cat3, 0 ],
		// 	[ cat4, 2 ],
		// 	[ cat5, 1 ],
		// 	[ cat6, 0 ]
		// ];

		// yield* waitUntil('startAdd');

		// for (let [ src, index ] of images) {
		// 	const image =
		// 		<Img
		// 			src={src}
		// 			size={sizes[index] * 1.2}
		// 			shadowColor='black'
		// 			shadowBlur={32}
		// 			shadowOffsetY={16}
		// 			radius={32}
		// 			y={-200}
		// 		/>;

		// 	layoutRef().add(image);

		// 	yield* all(
		// 		image.y(image.y() - 100).y(image.y() + 100, 0.3, easeOutCubic),
		// 		image.opacity(0).opacity(1, 0.15, easeOutCubic),
		// 	);

		// 	yield* waitFor(0.5);

		// 	yield* all(
		// 		image.scale(0.7, 0.4),
		// 		tween(0.4, value => image.position(Vector2.arcLerp(
		// 			new Vector2(image.position()),
		// 			new Vector2(stacks[index].position()),
		// 			easeInOutCubic(value),
		// 			false,
		// 			0
		// 		))),
		// 		waitFor(0.2, stacks[index].scale(stacks[index].scale().mul(1.1), 0.3, easeOutElastic))
		// 	);

		// 	image.remove();
		// }

		// yield* waitUntil('gpuExplode');

		// yield* all(
		// 	...layoutRef().children().slice(1).flatMap(node => [
		// 		node.y(node.y() + 100, 0.3, easeOutCubic),
		// 		node.opacity(0, 0.15, easeOutCubic),
		// 	])
		// );

		// layoutRef().children().slice(1).forEach(c => c.remove());
		// yield* waitFor(0.2);

	}

	yield* waitFor(2);
});
