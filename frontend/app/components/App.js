import { h, Component } from 'preact';
import GameContainer from './GameContainer';
import Leaderboard from './Leaderboard';
import SetScore from './SetScore';
import ChooseLevel from './ChooseLevel';

export default class App extends Component {
	state = {
		score: 0,
		view: 'game',
	};

	componentDidMount() {
		window.setAppView = view => { this.setState({ view }); }
		window.setScore = score => { this.setState({ score }); }
	}

	render() {
		if (this.state.view === 'game') {
			return (
				<div>
					<GameContainer />
				</div>
			)
		}
		if (this.state.view === 'setScore') {
			return (
				<div>
					<SetScore score={this.state.score} />
				</div>
			)
		}
    if (this.state.view === 'chooselevel') {
			return (
				<div>
					<ChooseLevel />
				</div>
			)
		}
		if (this.state.view === 'leaderboard') {
			return (
				<div>
					<Leaderboard />
				</div>
			)
		}
		return null;
	}
}
