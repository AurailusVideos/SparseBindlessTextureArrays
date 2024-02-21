import { Node } from '@motion-canvas/2d';
import { all, loop, chain, range, sequence, waitFor, Vector2, easeOutCubic, easeInCubic } from "@motion-canvas/core";

export function* shake(elem: Node, duration: number, magnitude: number) {
	const initialPos = new Vector2(elem.position());

	yield* loop(
		Math.ceil(duration * 30),
		(i) => {
			let random = Math.pow(i + initialPos.x + initialPos.y + magnitude, 2) * 1.84333213123561237812;
			let randX = Math.sin(random) * magnitude;
			let randY = Math.cos(random) * magnitude;

			return all(
				elem.position(initialPos.add([ randX, randY ]), 0.01),
				waitFor(1 / 30)
			);
		}
	);

	yield* elem.position(initialPos, 0.01);
}
export function* hop(elem: Node, time = 0.15, height = 25) {
	let initial = new Vector2(elem.position());

	yield* elem.position(new Vector2([ initial.x, initial.y - height ]), time/2, easeOutCubic);
	yield* elem.position(new Vector2([ initial.x, initial.y ]), time/2, easeInCubic);
}
