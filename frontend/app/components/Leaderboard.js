import { h, Component } from 'preact';
import Koji from '@withkoji/vcc';

class Leaderboard extends Component {
  state = {
    scores: [],
    dataIsLoaded: false,
    error: false,
  };

  componentDidMount() {
    fetch(`${Koji.config.serviceMap.backend}/leaderboard`)
      .then((response) => response.json())
      .then(({ scores }) => {
        this.setState({ dataIsLoaded: true, scores });
      })
      .catch(err => {
        console.log('Fetch Error: ', err);
        this.setState({ error: true });
      });
  }

  render() {
    if (this.state.error) {
      return (
        <div id={'leaderboard'} style={{ backgroundColor: Koji.config.colors.backgroundColor, color: Koji.config.colors.titleColor }}>
          <div className={'leaderboard-loading'}>
            <div>{'Error!'}</div>
            <button onClick={() => window.setAppView('game')}>
              {'Back to Game'}
            </button>
          </div>
        </div>
      );
    }

    if (!this.state.dataIsLoaded) {
      return (
        <div id={'leaderboard'} style={{ backgroundColor: Koji.config.colors.backgroundColor }}>
          <div className={'leaderboard-loading'}>
            <div style="display: flex; margin-top: 20vh; justify-content: center; text-align: center; animation-name: logo; animation-duration: 2s; animation-iteration-count: infinite; animation-timing-function: ease-out;">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id={'leaderboard'} style={{ backgroundColor: Koji.config.colors.backgroundColor }}>
        <div className={'leaderboard-container'}>
          <div class={'leaderboard-title'}>
            <div class={'leaderboard-title-text'} style={{ color: Koji.config.colors.titleColor }}>{"Top Scores"}</div>
            <div
              class={'leaderboard-close-button'}
              onClick={() => { window.setAppView('game'); }}
              style={{ color: Koji.config.colors.titleColor }}
            >
              {"Close"}
            </div>
          </div>
          <div className={'leaderboard-contents'}>
            {
              this.state.scores.slice(0, 100).map((score, index) => (
                <div
                  className={'score-row'}
                  key={index}
                  style={{ backgroundColor: Koji.config.colors.buttonColor }}
                >
                  <div className={'name'} style={{ color: Koji.config.colors.buttonTextColor }}>
                    {`${index + 1}. ${score.name}`}
                  </div>
                  <div className={'score'} style={{ color: Koji.config.colors.buttonTextColor }}>
                    {score.score}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
