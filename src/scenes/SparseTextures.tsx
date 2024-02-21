import { makeScene2D, Layout, Txt, Img, Rect, Gradient } from '@motion-canvas/2d';
import { PossibleVector2, Vector2, all, chain, createRef, createRefMap, easeInCubic, easeInOutCubic, easeInOutQuint, easeInQuint, easeOutCubic, easeOutQuad, easeOutQuint, linear, makeRef, range, tween, waitFor, waitUntil } from '@motion-canvas/core';

import img_gpu from '../../images/gpu.png'
import img_grass from '../../images/grass.png';
import img_cat from '../../images/rock_cat.png';

import { OutlinedBox } from '../components/OutlinedBox';
import { YardSick } from '../components/YardStick';
import { CroppedTexture } from '../components/CroppedTexture';

export default makeScene2D(function* (view) {
	const layoutRef = createRef<Layout>();

	{
		const txtRef = createRef<Txt>();
		const imageRef = createRef<Img>();
		const rectRef = createRef<Rect>();

		view.fill('#111');
		view.add(
			<Layout ref={layoutRef} width='100%' height='100%'>
				<Txt text='Sparse Textures' width='100%' height='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Txt
					ref={txtRef}
					layout={false}
					fill='#fff'
					opacity={0.8}
					fontSize={70}
					fontFamily={'Jetbrains Mono'}
					fontWeight={900}
					text={'Nvidia GTX 3080'}
					width='42%'
					y={5}
					textAlign={'left'}
					// offsetX={-1}
					// compositeOperation={'soft-light'}
				/>
				<Img src={img_gpu} width={800} ref={imageRef}/>
				<Rect ref={rectRef} width='9%' offsetX={-1} height='9%' x={245} opacity={0} fill='yellow' compositeOperation={'soft-light'}/>
			</Layout>
		);

		yield* all(
			imageRef().y(-200).y(100, 3, linear),
			imageRef().x(-1400).x(1400, 3, linear),
			imageRef().rotation(1000, 3, linear),
			chain(waitFor(1.1), txtRef().text('').text('Nvidia GTX 1060 6GB', 1, linear)),
		);

		yield* waitUntil('highlight');

		yield* all(
			rectRef().opacity(1, 0.5, easeOutQuad),
			rectRef().width('0%').width('9%', 0.5)
		);

		yield* waitUntil('cardOut');

		yield* all(
			txtRef().y(txtRef().y() + 50, 0.5, easeInQuint),
			txtRef().opacity(0, 0.5, easeInCubic),
			rectRef().y(txtRef().y() + 50, 0.5, easeInQuint),
			rectRef().opacity(0, 0.5, easeInCubic),
		);

		txtRef().remove();
		rectRef().remove();
		imageRef().remove();
	}

	{
		yield* waitUntil('physRamIn');

		const physicalContainer = createRef<Layout>();
		const physicalText = createRef<Txt>();
		const physicalBoxes: OutlinedBox[] = [];
		const virtualContainer = createRef<Layout>();
		const virtualBoxes: OutlinedBox[] = [];
		const virtualText = createRef<Txt>();

		const boxSize = 116;
		const boxSpanX = 5;
		const boxSpanY = 6;
		const boxSpanYVirt = 9;

		layoutRef().add(
			<>
				<Layout
					zIndex={30}
					ref={physicalContainer}
					width={boxSize * boxSpanX}
					height={boxSize * boxSpanY}
					offsetX={1}
					y={-320}
				>
					<Txt
						ref={physicalText}
						layout={false}
						fill='#fffa'
						fontSize={36}
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						text=''
						width={boxSize * boxSpanX}
						x={0}
						y={-50}
						textAlign='right'
						offsetX={-1}
					/>
					<Layout width={boxSize * boxSpanX} height={boxSize * boxSpanY}>
						{range(boxSpanX * boxSpanY).map(i => {
							return (
								<OutlinedBox
									ref={makeRef(physicalBoxes, i)}
									x={(i % boxSpanX) * boxSize}
									y={Math.floor(i / boxSpanX) * boxSize}
									width={boxSize}
									height={boxSize}
									strokeWidth={[
										4,
										i % boxSpanX == boxSpanX - 1 ? 4 : 0,
										Math.floor(i / boxSpanX) == boxSpanY - 1 ? 4 : 0,
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
					width={boxSize * boxSpanX}
					height={boxSize * boxSpanY}
					offsetX={1}
					x={-580}
					y={-320}
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
					<Layout width={boxSize * boxSpanX} height={boxSize * boxSpanY}>
						{range(boxSpanX * boxSpanYVirt).map(i => {
							return (
								<OutlinedBox
									ref={makeRef(virtualBoxes, i)}
									x={(i % boxSpanX) * boxSize}
									y={Math.floor(i / boxSpanX) * boxSize}
									width={boxSize}
									height={boxSize}
									strokeWidth={[
										Math.floor(i / boxSpanX) != boxSpanY ? 4 : 0,
										i % boxSpanX == boxSpanX - 1 ? 4 : 0,
										Math.floor(i / boxSpanX) == boxSpanY - 1 ? 4 : 0,
										4
									]}
									stroke='#fff3'
									offset={-1}
								/>
							);
						})}
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
						width={boxSize * boxSpanX}
						height={300}
						offset={-1}
						y={770}
					/>
				</Layout>
			</>
		);

		physicalContainer().x(0);
		physicalText().textAlign('left');

		yield* all(
			physicalContainer().y(physicalContainer().y() - 300).y(physicalContainer().y() + 300, 0.5, easeOutQuint),
			chain(waitFor(0.1), physicalText().text('Physical Memory', 0.5)),
			...physicalBoxes.flatMap((box, i) =>
			chain(waitFor(0.05 * ((i % boxSpanX) + Math.floor(i / boxSpanX))), box.animateIn(0.3)))
		);

		yield* waitUntil('virtRamIn');

		yield* all(
			physicalContainer().x(580, 0.5),
			physicalText().offset.x(-1.85, 0.5),

			virtualContainer().x(virtualContainer().x() - 300).x(virtualContainer().x() + 300, 0.5),
			chain(waitFor(0.1), virtualText().text('Virtual Memory', 0.5)),
			...virtualBoxes.slice(0, boxSpanX * boxSpanY).flatMap((box, i) =>
			chain(waitFor(0.05 * ((i % boxSpanX) + Math.floor(i / boxSpanX))), box.animateIn(0.3)))
		);

		yield* waitUntil('virtRamMany');

		yield* all(
			...virtualBoxes.slice(boxSpanX * boxSpanY).flatMap((box, i) =>
			chain(waitFor(0.05 * ((i % boxSpanX) + Math.floor(i / boxSpanX))), box.animateIn(0.3))),
			virtualContainer().y(virtualContainer().y() - 90, 0.5, easeOutQuint)
		)

		yield* waitUntil('imgDemo');

		const grass = createRef<Img>();
		const arrow = createRef<YardSick>();

		layoutRef().add(
			<>
				<Img
					ref={grass}
					width={boxSize * 2 + 4}
					src={img_grass}
					radius={16}
				/>
				<YardSick
					ref={arrow}
					zIndex={100}
					start={[ -750, -290 ]}
					end={[ 410, -200 ]}
					stroke='#396ae6'
					strokeWidth={8}
					arrowSize={24}
					textTransformer={() => ''}
					opacity={0}
				/>
			</>
		);

		yield* all(
			grass().y(-300).y(0, 0.5, easeOutCubic),
			grass().opacity(0).opacity(1, 0.3, easeInCubic)
		);

		yield* waitFor(0.2);

		yield* grass().x(-193, 0.2, easeInCubic);
		yield* grass().x(-80, 0.4, easeOutQuint);

		yield* waitFor(0.5);

		const arrowStart = new Vector2(arrow().start());
		const arrowEnd = new Vector2(arrow().end());

		yield* all(
			waitFor(0.2, grass().opacity(0.85, 0.2)),
			waitFor(0.3, grass().radius(0, 0.1)),
			tween(0.4, value => grass().position(Vector2.arcLerp(
				new Vector2(-80, 0),
				new Vector2(408, -202),
				easeInOutCubic(value),
				true,
				0
			))),

			...virtualBoxes.filter((_, i) => Math.floor(i / boxSpanX) < 2 && i % boxSpanX < 2).flatMap((box, i) =>
				waitFor(0.3 + (i % 2) * 0.05 + Math.floor(i / 2) * 0.05, box.fill('#396ae618', 0.2))
			),

			waitUntil('arrowGo', all(
				arrow().opacity(1, 0.2),
				arrow().end(arrowStart).end(arrowEnd, 0.6),
				waitFor(0.5, arrow().start(arrowEnd.sub([ 1, 1 ]), 0.6)),
				waitFor(0.8, arrow().opacity(0, 0.2))
			))
		);

		yield* waitUntil('catAppear');

		const cats: CroppedTexture[] = [];
		layoutRef().add(
			<>
				{range(4).flatMap(y => range(4).map(x =>
					<CroppedTexture
						ref={makeRef(cats, y * 4 + x)}
						x={boxSize * (x - 2 + 0.5)}
						y={boxSize * (y - 2 + 0.5)}
						radius={[
							x == 0 && y == 0 ? 32 : 0,
							x == 3 && y == 0 ? 32 : 0,
							x == 3 && y == 3 ? 32 : 0,
							x == 0 && y == 3 ? 32 : 0,
						]}

						src={img_cat}
						crop={[ x / 4, y / 4, (x + 1) / 4, (y + 1) / 4 ]}
						width={boxSize}
						height={boxSize}
					/>
				))}
			</>
		)

		yield* all(
			...cats.flatMap(p => [
				p.y(p.y() - 300).y(p.y() + 300, 0.5, easeOutCubic),
				p.opacity(0).opacity(1, 0.3, easeInCubic)
			])
		);

		yield* waitUntil('catSplit');

		cats.forEach(c => c.save());
		yield* all(...cats.map((p) => p.position(p.position().mul(1.2), 0.5)));

		yield* waitFor(0.5);
		yield* all(...cats.map((p) => p.restore(0.5)));

		const imagePositions = [
			...range(3).map(i => [ i + 2, 0 ] as PossibleVector2),
			...range(3).map(i => [ i + 2, 1 ] as PossibleVector2),
			...range(5).map(i => [ i, 2 ] as PossibleVector2),
			...range(5).map(i => [ i, 3 ] as PossibleVector2),
			...range(5).map(i => [ i, 4 ] as PossibleVector2)
		] as [ number, number ][];

		yield* waitUntil('catMove');

		yield* all(
			...virtualBoxes.filter((_, i) => Math.floor(i / boxSpanX) > 1 &&
				Math.floor(i / boxSpanX) < 6 && i % boxSpanX < 4).flatMap((box, i) =>
				waitFor(0.3 + (i % 4) * 0.05 + (Math.floor(i / 4) - 2) * 0.05, box.fill('#34eb6411', 0.2)))
		);

		arrow().stroke('#7df09b');
		for (let i = 0; i < cats.length; i++) {
			const cat = cats[i];
			cat.save();
			cat.zIndex(10);

			const cell = virtualBoxes[2 * 5 + i % 4 + Math.floor(i / 4) * boxSpanX];

			const catEnd = new Vector2(348, -262).add(new Vector2((boxSize) * imagePositions[i][0],
			(boxSize) * imagePositions[i][1]));

			const arrowStart = new Vector2(-810, -boxSize).add([ (i % 4) * boxSize, Math.floor(i / 4) * boxSize ]);
			const arrowEnd = new Vector2(catEnd).add([ 10, 0 ]);

			yield* all(
				waitFor(0.3, cat.opacity(0.85, 0.3)),
				waitFor(0.3, cat.radius(0, 0.15)),
				tween(0.6, value => cat.position(Vector2.arcLerp(
					new Vector2(cat.position()),
					catEnd,
					easeInOutCubic(value),
					true,
					0
				))),

				waitFor(0.1, cell.fill('#33f5662c', 0.5)),
				waitFor(0.1, all(
					arrow().opacity(1, 0.2),
					arrow().start(arrowStart).end(arrowStart).end(arrowEnd, 0.4),
					waitFor(0.3, arrow().start(arrowEnd.sub([ 1, 1 ]), 0.4)),
					waitFor(0.4, arrow().opacity(0, 0.3))
				))
			);

			cat.zIndex(0);
		}

		yield* waitUntil('catRemove');

		for (let i of [ 14, 12, 6, 3, 8, 7, 1 ]) {
			const cat = cats[i];

			const cell = virtualBoxes[2 * 5 + i % 4 + Math.floor(i / 4) * boxSpanX];

			const catEnd = new Vector2(348, -262).add(new Vector2((boxSize) * imagePositions[i][0],
			(boxSize) * imagePositions[i][1]));
			const arrowEnd = new Vector2(-810, -boxSize).add([ (i % 4) * boxSize, Math.floor(i / 4) * boxSize ]);
			const arrowStart = new Vector2(catEnd).add([ 10, 0 ]);

			yield* all(
				cat.opacity(0, 0.4, easeInCubic),
				cat.scale(0.5, 0.4, easeInCubic),

				waitFor(0.3, cell.fill('#34eb6411', 0.5)),
				waitFor(0.1, all(
					arrow().opacity(1, 0.2),
					arrow().start(arrowStart).end(arrowStart).end(arrowEnd, 0.4),
					waitFor(0.3, arrow().start(arrowEnd.sub([ 1, 1 ]), 0.4)),
					waitFor(0.4, arrow().opacity(0, 0.3))
				))
			);

			cat.zIndex(0);
		}
	}

	yield* waitFor(2);
});
