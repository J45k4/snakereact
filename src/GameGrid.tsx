import * as React from "react";

export class GameGridCol extends React.PureComponent<{
	selected: boolean;
	isFood: boolean;
}> {
	render() {
		return (
			<td
				style={{
					height: "20px",
					width: "20px",
					backgroundColor: this.props.isFood
						? "red"
						: this.props.selected
						? "green"
						: "white"
				}}
			/>
		);
	}
}

interface GameGridRowProps {
	width: number;
	selected: number[];
	foods: number[];
}

export class GameGridRow extends React.Component<GameGridRowProps> {
	shouldComponentUpdate(nextProps: GameGridRowProps) {
		if (this.props.width !== nextProps.width) {
			return true;
		}

		if (this.props.selected.length !== nextProps.selected.length) {
			return true;
		}

		if (this.props.foods.length !== nextProps.foods.length) {
			return true;
		}

		for (let i = 0; i < nextProps.selected.length; i++) {
			if (this.props.selected[i] !== nextProps.selected[i]) {
				return true;
			}
		}

		for (let i = 0; i < nextProps.foods.length; i++) {
			if (this.props.foods[i] !== nextProps.foods[i]) {
				return true;
			}
		}

		return false;
	}

	render() {
		const cols = [];
		for (let i = 0; i < this.props.width; i++) {
			cols.push(
				<GameGridCol
					key={i}
					isFood={this.props.foods.some(e => e === i)}
					selected={this.props.selected.some(p => p === i)}
				/>
			);
		}

		return <tr>{cols}</tr>;
	}
}

export class GameGrid extends React.Component<{
	width: number;
	height: number;
	selected: number[];
	foods: number[];
}> {
	render() {
		const rows = [];
		for (let i = 0; i < this.props.height; i++) {
			rows.push(
				<GameGridRow
					key={i}
					width={this.props.width}
					selected={this.props.selected
						.filter(p => {
							//console.log("p", p, this.props.width * i);
							return (
								p >= this.props.width * i &&
								p < this.props.width * i + this.props.width
							);
						})
						.map(e => e - this.props.width * i)}
					foods={this.props.foods
						.filter(p => {
							return (
								p >= this.props.width * i &&
								p < this.props.width * i + this.props.width
							);
						})
						.map(e => e - this.props.width * i)}
				/>
			);
		}
		return (
			<table
				style={{
					border: "solid 4px grey"
				}}
			>
				<tbody>{rows}</tbody>
			</table>
		);
	}
}
