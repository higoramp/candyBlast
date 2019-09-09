import { h, Component } from 'preact';
import PropTypes from 'prop-types';

// Note: If you are using p5, you can uncomment all of the p5 lines
// and things should just work =)

const { p5 } = window;


class GameContainer extends Component {
  componentDidMount() {
    require('script-loader!app/index.js');
    require('script-loader!app/entities.js');
    require('script-loader!app/utilities.js');
    require('script-loader!app/clickable.js');
    require('script-loader!app/p5.min.js');
    require('script-loader!app/p5.sound.min.js');
    this.p5Game = new p5(null, document.getElementById('game-container'));
  }

  componentWillUnmount() {
      if(sndMusic){
          sndMusic.dispose();
      }
    this.p5Game.remove();
  }

  render() {
    return (
      <div id={'game-container'} />
    );
  }
}

export default GameContainer;
