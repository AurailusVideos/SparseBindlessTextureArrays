import { makeScene2D, Layout, Txt, Img, Rect, Video, Node } from '@motion-canvas/2d';
import { SimpleSignal, Vector2, Vector2Signal, all, chain, createRef, createRefMap, createSignal, easeInCubic, easeInExpo, easeInQuad, easeOutCubic, easeOutElastic, easeOutExpo, easeOutQuad, easeOutQuint, linear, makeRef, range, waitFor, waitUntil } from '@motion-canvas/core';

import { OutlinedBox } from '../components/OutlinedBox';

export default makeScene2D(function* (view) {
	const layoutRef = createRef<Layout>();

	const varNames = [ 'floatX', 'floatY', 'floatArray', 'floatLayer' ];
	const varNames2 = [ 'zephaX', 'zephaY', 'zephaArray', 'zephaLayer' ];

	const container = createRef<Rect>();
	const container2 = createRef<Rect>();
	const boxes = createRefMap<OutlinedBox>();
	const boxLabels = createRefMap<Txt>();
	const boxValues = createRefMap<Txt>();
	const boxByteLabels = createRefMap<Txt>();

	const boxWidth = createSignal(1400);
	const boxWidth2 = createSignal(1400);
	const boxHeight = createSignal(100);
	const boxSpacing = 40;
	const boxByteLabelSpacing = createSignal(48);

	view.fill('#111');
	view.add(
		<Layout ref={layoutRef} width='100%' height='100%'>
			<Txt text='Vertex Optimization' width='100%' height='100%' padding={48} fontSize={48} textAlign='center' fill='#999' fontFamily={'Jetbrains Mono'} fontWeight={900}/>

			<Layout ref={container} x={() => -boxWidth() / 2 + boxWidth() / 8} width={0}>
				{range(4).map(i => {
					const varName = varNames[i];
					const labelName = [ 'X Position', 'Y Position', 'Texture Array', 'Array Layer' ][i];
					const strValue = [ '0.0342', '0.1024', '0.0000', '3.0000' ][i];

					return <>
						<Txt
							ref={boxLabels[varName]}
							text={labelName}
							fill='#fff'
							fontFamily='Jetbrains Mono'
							fontWeight={900}
							fontSize={32}
							textAlign='left'
							width={() => boxWidth() / 4}
							x={() => (boxWidth() / 4 - 4) * i + 48}
							y={-80}
						/>
						<Txt
							ref={boxByteLabels[varName]}
							text={'32'}
							fill='#fff9'
							fontFamily='Jetbrains Mono'
							fontWeight={900}
							fontSize={24}
							textAlign='left'
							width={() => boxWidth() / 4}
							x={() => (boxWidth() / 4 - 4) * i}
							y={-78}
						/>
						<Txt
							ref={boxValues[varName]}
							text={strValue}
							fill='#999'
							fontFamily='Jetbrains Mono'
							fontWeight={900}
							fontSize={48}
							textAlign='left'
							width={() => boxWidth() / 4}
							x={() => (boxWidth() / 4 - 4) * i + 32}
							y={4}
						/>
						<OutlinedBox
							width={() => boxWidth() / 4}
							x={() => (boxWidth() / 4 - 4) * i}
							height={boxHeight}
							strokeWidth={4}
							ref={boxes[varName]}
						/>
					</>;
				})}
			</Layout>
		</Layout>
	);

	varNames.forEach(name => {
		boxLabels[name]().save();
		boxLabels[name]().text('');
		boxValues[name]().save();
		boxValues[name]().text('');
		boxByteLabels[name]().save();
		boxByteLabels[name]().text('');
	});

	yield* waitFor(1);

	yield* all(
		waitFor(0, boxes.floatX().animateIn(0.4)),
		waitFor(0.1, boxes.floatY().animateIn(0.4)),
		waitFor(0.2, boxes.floatArray().animateIn(0.4)),
		waitFor(0.3, boxes.floatLayer().animateIn(0.4)),
		...varNames.map((name, i) => waitFor(0.4 + i * 0.1, boxByteLabels[name]().restore(0.2))),
		...varNames.map((name, i) => waitFor(0.3 + i * 0.1, boxLabels[name]().restore(0.4))),
		...varNames.map((name, i) => waitFor(0.6 + i * 0.1, boxValues[name]().restore(0.4))),
	);

	yield* waitUntil('dupe');

	let clone1 = container().clone();
	clone1.opacity(0);
	(clone1.children()[2] as any).text('0.4801');
	(clone1.children()[6] as any).text('0.3350');
	(clone1.children()[10] as any).text('2.0000');
	(clone1.children()[14] as any).text('9.0000');
	(clone1.children()[0]).remove();
	(clone1.children()[0]).remove();
	(clone1.children()[2]).remove();
	(clone1.children()[2]).remove();
	(clone1.children()[4]).remove();
	(clone1.children()[4]).remove();
	(clone1.children()[6]).remove();
	(clone1.children()[6]).remove();
	yield* all(...clone1.children().map(c => (c as any).animateIn?.(0.1)));
	layoutRef().add(clone1);

	let clone2 = container().clone();
	clone2.opacity(0);
	(clone2.children()[2] as any).text('0.0010');
	(clone2.children()[6] as any).text('0.8451');
	(clone2.children()[10] as any).text('1.0000');
	(clone2.children()[14] as any).text('0.0000');
	(clone2.children()[0]).remove();
	(clone2.children()[0]).remove();
	(clone2.children()[2]).remove();
	(clone2.children()[2]).remove();
	(clone2.children()[4]).remove();
	(clone2.children()[4]).remove();
	(clone2.children()[6]).remove();
	(clone2.children()[6]).remove();
	yield* all(...clone2.children().map(c => (c as any).animateIn?.(0.1)));
	layoutRef().add(clone2);

	yield* all(
		container().y(-boxHeight() - boxSpacing / 2 + 0, 1),
		clone1.y(boxSpacing / 2 + 0, 1),
		clone2.y(boxHeight() + boxSpacing * 1.5 + 0, 1),
		waitFor(0.3, clone1.opacity(1, 0.7)),
		waitFor(0.3, clone2.opacity(1, 0.7)),
	);

	yield* waitUntil('undupe');

	yield* all(
		container().y(0, 1),
		clone1.y(0, 1),
		clone2.y(0, 1),
		clone1.opacity(0, 0.7),
		clone2.opacity(0, 0.7),
	);

	clone1.remove();
	clone2.remove();

	yield* waitUntil('zephaIn');

	const labelName2 = [ 'X Pos', 'Y Pos', 'Array', 'Layer' ];
	const strValue2 = [ '342', '1024', '0', '3' ];
	const byteLabel2 = [ '21', '21', '11', '11' ];

	const posPortion = createSignal(21/64);
	const byteOffset = createSignal(48);

	layoutRef().add(
		<Layout ref={container2} x={() => -boxWidth2() / 2} y={boxSpacing} width={0}>
			{range(4).map(i => {
				const varName = varNames2[i];

				return <>
					<Txt
						ref={boxLabels[varName]}
						text={''}
						fill='#fff'
						fontFamily='Jetbrains Mono'
						fontWeight={900}
						fontSize={32}
						textAlign='left'
						width={() => boxWidth2() * (i < 2 ? posPortion() : (1 - posPortion() * 2) / 2)}
						x={() => boxWidth2() * (posPortion() * Math.min(i, 2) + (1 - posPortion() * 2) / 2 * Math.max(Math.min(i - 2, 2), 0)) - 4 * i + byteOffset()}
						y={-80}
						offsetX={-1}
					/>
					<Txt
						ref={boxByteLabels[varName]}
						text={''}
						fill='#fff9'
						fontFamily='Jetbrains Mono'
						fontWeight={900}
						fontSize={24}
						textAlign='left'
						width={() => boxWidth2() * (i < 2 ? posPortion() : (1 - posPortion() * 2) / 2)}
						x={() => boxWidth2() * (posPortion() * Math.min(i, 2) + (1 - posPortion() * 2) / 2 * Math.max(Math.min(i - 2, 2), 0)) - 4 * i}
						y={-78}
						offsetX={-1}
					/>
					<Txt
						ref={boxValues[varName]}
						text={''}
						fill='#999'
						fontFamily='Jetbrains Mono'
						fontWeight={900}
						fontSize={48}
						textAlign='left'
						width={() => boxWidth2() * (i < 2 ? posPortion() : (1 - posPortion() * 2) / 2)}
						x={() => boxWidth2() * (posPortion() * Math.min(i, 2) + (1 - posPortion() * 2) / 2 * Math.max(Math.min(i - 2, 2), 0)) - 4 * i + 32}
						y={4}
						offsetX={-1}
					/>
					<OutlinedBox
						width={() => boxWidth2() * (i < 2 ? posPortion() : (1 - posPortion() * 2) / 2)}
						x={() => boxWidth2() * (posPortion() * Math.min(i, 2) + (1 - posPortion() * 2) / 2 * Math.max(Math.min(i - 2, 2), 0)) - 4 * i}
						height={boxHeight}
						strokeWidth={4}
						ref={boxes[varName]}
						offsetX={-1}
					/>
				</>;
			})}
		</Layout>
	);

	varNames2.forEach(name => {
		boxLabels[name]().text('');
		boxValues[name]().text('');
		boxByteLabels[name]().text('');
	});

	yield* all(
		waitFor(0.4, boxes.zephaX().animateIn(0.4)),
		waitFor(0.5, boxes.zephaY().animateIn(0.4)),
		waitFor(0.6, boxes.zephaArray().animateIn(0.4)),
		waitFor(0.7, boxes.zephaLayer().animateIn(0.4)),
		container().y(-boxSpacing * 2.2, 1),
		container2().y(boxSpacing * 3, 1),
		...varNames2.map((name, i) => waitFor(0.7 + i * 0.1, boxByteLabels[name]().text(byteLabel2[i], 0.2))),
		...varNames2.map((name, i) => waitFor(0.7 + i * 0.1, boxLabels[name]().text(labelName2[i], 0.4))),
		...varNames2.map((name, i) => waitFor(1.0 + i * 0.1, boxValues[name]().text(strValue2[i], 0.4))),
	);

	yield* waitUntil('zephaSize');

	yield* all(
		boxWidth2(700, 1),
		byteOffset(0, 1),
		...varNames2.map(name => boxByteLabels[name]().opacity(0, 0.7)),
		boxByteLabelSpacing(32, 1),
		container2().x(-boxWidth() * 0.50, 1)
	)

	yield* waitUntil('shift');

	yield* posPortion(23 / 64, 0.5);
	yield* waitFor(0.2);
	yield* posPortion(16 / 64, 0.5);
	yield* waitFor(0.2);
	yield* posPortion(19 / 64, 0.5);
	yield* waitFor(0.2);
	yield* posPortion(21 / 64, 0.5);

	yield* waitFor(2);
});
