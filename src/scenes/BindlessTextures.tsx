import { makeScene2D, Layout, Txt, Img, Rect, Video, Gradient } from '@motion-canvas/2d';
import { PossibleVector2, Vector2, all, chain, createRef, createRefMap, easeInCubic, easeInExpo, easeInOutCubic, easeInOutExpo, easeInQuad, easeOutCubic, easeOutElastic, easeOutQuad, easeOutQuint, linear, makeRef, range, tween, waitFor, waitUntil } from '@motion-canvas/core';

import { ImageStack } from '../components/ImageStack';
import { OutlinedBox } from '../components/OutlinedBox';
import { YardSick } from '../components/YardStick';

import img_gpu from '../../images/gpu.png';
import img_grass from '../../images/grass.png';
import explode from '../../videos/explosion.webm'

import { shake } from '../Util';

function createHandle() {
	const characters = '0123456789ABCDEF';
	let handle = '0x';
	for (let i = 0; i < 8; i++) {
		handle += characters[Math.floor(Math.random() * characters.length)];
	}
	return handle;
}

export default makeScene2D(function* (view) {
	const layoutRef = createRef<Layout>();

	view.fill('#111');

	{
		const texture = createRef<Img>();
		const arrow1 = createRef<YardSick>();
		const arrow2 = createRef<YardSick>();
		const gpu = createRef<Img>();
		const bindSlotsContainer = createRef<Layout>();
		const bindSlots: OutlinedBox[] = [];
		const bindSlotGap = 16;
		const bindSlotSize = 96;

		view.add(
			<Layout ref={layoutRef} width='100%' height='100%'>
				<Txt text='Bindless Textures' width='100%' height='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>
				<Img
					ref={texture}
					src={img_grass}
					width={256}
					radius={32}
					shadowBlur={32}
					shadowColor='#0009'
					shadowOffsetY={16}
					x={-650}
				/>

				<YardSick
					ref={arrow1}
					start={[ -480, 0 ]}
					end={[ -140, 0 ]}
					stroke='white'
					strokeWidth={8}
					arrowSize={24}
					textTransformer={() => ''}
				/>

				<Img
					ref={gpu}
					src={img_gpu}
					width='25%'
					shadowBlur={32}
					shadowColor='black'
					shadowOffsetY={16}
					x={600}
				/>

				<YardSick
					ref={arrow2}
					start={[ 140, 0 ]}
					end={[ 350, 0 ]}
					stroke='white'
					strokeWidth={8}
					arrowSize={24}
					textTransformer={() => ''}
				/>

				<Layout
					ref={bindSlotsContainer}
					width={(bindSlotSize + bindSlotGap) * 2 - bindSlotGap}
					height={(bindSlotSize + bindSlotGap) * 6 - bindSlotGap}
					y={50}
				>
					<Txt
						text=''
						y={-360}
						width={bindSlotSize * 2 + bindSlotGap}
						padding={48}
						fontSize={36}
						fill='#ccc'
						fontFamily={'Jetbrains Mono'}
						fontWeight={900}
						textAlign='center'
					/>

					{range(12).map(index => {
						return (
							<OutlinedBox
								ref={makeRef(bindSlots, index)}
								x={(bindSlotSize + bindSlotGap) * (index % 2 - 0.5)}
								y={-(bindSlotSize + bindSlotGap) * 3 + (bindSlotSize + bindSlotGap) / 2
									+ (bindSlotSize + bindSlotGap) * Math.floor(index / 2)}
								width={bindSlotSize}
								height={bindSlotSize}
								strokeWidth={4}
								stroke='white'
								fill='#fff1'
							/>
						);
					})}
				</Layout>
			</Layout>
		);

		texture().opacity(0);
		gpu().opacity(0);
		arrow1().opacity(0);
		arrow2().opacity(0);


		yield* waitFor(1);

		yield* all(
			...bindSlots.map((s, i) => waitFor(0.05 * ((i % 2) + Math.floor(i / 2)), s.animateIn(0.2))),
			(bindSlotsContainer().children()[0] as Txt).text('').text('Tex Slots', 0.5)
		);

		yield* waitFor(1);

		yield* all(
			texture().y(texture().y() - 100).y(texture().y() + 100, 0.5, easeOutCubic),
			texture().opacity(1, 0.5, easeOutCubic),
		);

		yield* all(
			gpu().y(gpu().y() - 100).y(gpu().y() + 100, 0.5, easeOutCubic),
			gpu().opacity(1, 0.5, easeOutCubic),
		);

		yield* waitFor(1);

		let arrow1End = new Vector2(arrow1().end());
		let arrow2End = new Vector2(arrow2().end());

		yield* all(
			arrow1().opacity(1, 0.2),
			arrow1().end(arrow1().start()).end(arrow1End, 0.5),
			waitFor(0.3, bindSlots[0].fill('#fff', 0.3)),
			waitFor(0.5, all(
				arrow2().opacity(1, 0.2),
				arrow2().end(arrow2().start()).end(arrow2End, 0.5),
				waitFor(0.3, shake(gpu(), 1.5, 5))
			))
		)

		yield* waitFor(0.2);

		yield* all(
			bindSlotsContainer().position([ 600, 1100 ], 0.9, easeOutCubic),
			bindSlotsContainer().rotation(600, 0.9, easeOutCubic),
			arrow2().start(arrow2().end(), 0.5),
			waitFor(0.25, arrow2().opacity(0, 0.25)),
			waitFor(0.4, arrow1().end(arrow2().end(), 0.7, easeInOutExpo)),
			waitFor(0.8, shake(gpu(), 1.5, 8))
		);

		yield shake(gpu(), 5, 8);
		yield* waitFor(2);

		yield* all(
			texture().y(texture().y() + 100, 0.3, easeInCubic),
			texture().opacity(0, 0.3, easeInCubic),
			waitFor(0.05, arrow1().y(arrow1().y() + 100, 0.3, easeInCubic)),
			waitFor(0.05, arrow1().opacity(0, 0.3, easeInCubic)),
			waitFor(0.1, gpu().y(gpu().y() + 100, 0.3, easeInCubic)),
			waitFor(0.1, gpu().opacity(0, 0.3, easeInCubic))
		)

		texture().remove();
		arrow1().remove();
		arrow2().remove();
		gpu().remove();
		bindSlotsContainer().remove();
	}

	{
		yield* waitUntil('part2');

		const texture = createRef<Img>();
		const gpu = createRef<Img>();
		const handle = createRef<Txt>();
		const video = createRef<Video>();

		yield layoutRef().add(
			<>
				<Txt
					ref={handle}
					text={createHandle()}
					fontSize={32}
					rotation={90}
					textAlign='center'
					fill='#fff'
					fontFamily={'Jetbrains Mono'}
					fontWeight={900}
					zIndex={10}
				/>

				<Img
					ref={texture}
					src={img_grass}
					width={256}
					radius={24}
					shadowBlur={32}
					shadowColor='#0009'
					shadowOffsetY={16}
					y={-250}
				/>

				<Img
					ref={gpu}
					src={img_gpu}
					width='45%'
					shadowBlur={32}
					shadowColor='black'
					shadowOffsetY={16}
					y={400}
					x={-64}
					zIndex={10}
				/>

				<Video
					ref={video}
					src={explode}
					zIndex={30}
					scale={50}
					smoothing={false}
				/>
			</>
		);

		texture().opacity(0);
		handle().opacity(0);
		video().opacity(0);

		yield* all(
			gpu().y(gpu().y() + 100).y(gpu().y() - 100, 0.5, easeOutCubic),
			gpu().opacity(1, 0.5, easeOutCubic),
			waitFor(0.2, all(
				texture().y(texture().y() - 100).y(texture().y() + 100, 0.5, easeOutCubic),
				texture().opacity(1, 0.5, easeOutCubic)
			))
		);

		yield* waitFor(0.2);

		yield* all(
			texture().scale(0.6, 0.5, easeOutCubic),
			waitFor(0.3, shake(texture(), 1.2, 3)),
			waitFor(1.4, texture().scale(1, 0.6, easeOutElastic)),
			waitFor(1.35, handle().opacity(1, 0.3)),
			waitFor(1.35, handle().y(-200).y(500, 1, easeOutCubic)),
			waitFor(1.8, gpu().scale(gpu().scale().mul(1.1), 0.3, easeOutElastic))
		);

		yield* waitUntil('manyStart');

		yield* all(
			texture().y(texture().y() - 50, 0.2, easeInCubic),
			texture().opacity(0, 0.2, easeInCubic),
		);

		yield* waitFor(0.3);

		const interval = 48;
		const padding = 128;
		const delay = 0.3;

		for (let [ k, i ] of range((1920 - padding * 2) / interval)
			.sort(() => Math.random() - 0.5).map((k, i) => [ k, i ])) {
			let x = padding + k * interval;

			const handle = <Txt
				text={createHandle()}
				fontSize={32}
				rotation={90}
				textAlign='center'
				fill='#fff'
				opacity={0}
				fontFamily={'Jetbrains Mono'}
				fontWeight={900}
				x={-1920/2 + x}
				y={-700}
			/> as Txt;

			yield waitFor(i * delay, all(
				waitFor(0.3, handle.opacity(1, 0.5)),
				handle.y(650, 2.3, linear),
				waitFor(1.3, gpu().scale(0.1 + Math.pow(1.06, i), 0.3, easeOutElastic)),
				waitFor(2, shake(gpu(), delay, Math.max(0, i - 4) * 2))
			));

			layoutRef().add(handle)
		}

		yield* waitFor(12);

		video().opacity(1);
		video().play();

		yield* waitFor(1);
		layoutRef().children().slice(1).filter(c => c != video()).map(c => c.remove());




	}

	yield* waitFor(2);
});
