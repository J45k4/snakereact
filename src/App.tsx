import * as React from "react";

import { GameGrid } from "./GameGrid";

enum Direction {
	Up = 1,
	Right = 2,
	Down = 3,
	Left = 4
}

function getRandomArbitrary(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min);
}

class App extends React.Component {
	state = {
		selected: {
			direction: Direction.Left,
			coordinates: [10, 11, 12, 13, 14, 15]
		},
		foods: [80, 170, 250],
		width: 70,
		heigth: 20
	};

	reset() {
		this.setState({
			foods: [],
			selected: {
				direction: Direction.Right,
				coordinates: [1, 2, 3, 4]
			}
		});
	}

	foodTick() {
		const potentialFoods = [];

		for (let i = 0; i < this.state.width * this.state.heigth; i++) {
			if (
				!this.state.foods.some(e => e === i) &&
				!this.state.selected.coordinates.some(e => e === i)
			) {
				potentialFoods.push(i);
			}
		}
		const randomValue = getRandomArbitrary(0, potentialFoods.length);
		this.setState({
			foods: [...this.state.foods, potentialFoods[randomValue]]
		});
		setTimeout(() => {
			this.foodTick();
		}, 2000);
	}

	tick() {
		const length = this.state.selected.coordinates.length;

		let createNew = false;
		let reset = false;

		const coordinates = this.state.selected.coordinates.map((p, index) => {
			if (length === index + 1) {
				let nextCoordinate = 0;
				switch (this.state.selected.direction) {
					case Direction.Up:
						nextCoordinate = p - this.state.width;
						if (nextCoordinate < 0) {
							nextCoordinate =
								this.state.heigth * this.state.width +
								nextCoordinate;
						}
						break;
					case Direction.Right:
						nextCoordinate = p + 1;
						if (nextCoordinate % this.state.width === 0) {
							nextCoordinate = p - this.state.width + 1;
						}
						break;
					case Direction.Down:
						nextCoordinate = p + this.state.width;
						if (
							nextCoordinate >
							this.state.heigth * this.state.width
						) {
							nextCoordinate =
								nextCoordinate -
								this.state.heigth * this.state.width;
						}
						break;
					case Direction.Left:
						nextCoordinate = p - 1;
						if (p % this.state.width === 0) {
							nextCoordinate = p + this.state.width - 1;
						}
						break;
					default:
				}
				if (this.state.foods.some(e => e === nextCoordinate)) {
					createNew = true;
					this.state.selected.coordinates = [
						...this.state.selected.coordinates
					];
				}
				if (
					this.state.selected.coordinates.some(
						e => e === nextCoordinate
					)
				) {
					reset = true;
				}
				this.state.foods = this.state.foods.filter(
					e => e !== nextCoordinate
				);
				return nextCoordinate;
			} else {
				return this.state.selected.coordinates[index + 1];
			}
		});

		this.setState({
			selected: {
				direction: this.state.selected.direction,
				coordinates: createNew
					? [this.state.selected.coordinates[0] - 1, ...coordinates]
					: coordinates
			}
		});
		if (reset) {
			this.reset();
		}
		setTimeout(() => {
			this.tick();
		}, 40);
	}

	componentWillMount() {
		this.tick();
		this.foodTick();
		document.addEventListener("keydown", e => {
			switch (e.keyCode) {
				case 37:
					if (this.state.selected.direction !== Direction.Right) {
						this.setState({
							selected: {
								coordinates: this.state.selected.coordinates,
								direction: Direction.Left
							}
						});
					}
					break;
				case 38:
					if (this.state.selected.direction !== Direction.Down) {
						this.setState({
							selected: {
								coordinates: this.state.selected.coordinates,
								direction: Direction.Up
							}
						});
					}
					break;
				case 39:
					if (this.state.selected.direction !== Direction.Left) {
						this.setState({
							selected: {
								coordinates: this.state.selected.coordinates,
								direction: Direction.Right
							}
						});
					}
					break;
				case 40:
					if (this.state.selected.direction !== Direction.Up) {
						this.setState({
							selected: {
								coordinates: this.state.selected.coordinates,
								direction: Direction.Down
							}
						});
					}
					break;
				default:
			}
		});
	}

	render() {
		return (
			<div>
				<GameGrid
					width={this.state.width}
					height={this.state.heigth}
					selected={this.state.selected.coordinates}
					foods={this.state.foods}
				/>
			</div>
		);
	}
}

export default App;
