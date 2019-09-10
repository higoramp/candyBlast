import { h, Component } from 'preact';
import PropTypes from 'prop-types';




class GameContainer extends Component {
  componentDidMount() {
    require('script-loader!app/p5.min.js');1
    require('script-loader!app/p5.sound.min.js');
    require('script-loader!app/index.js');
    require('script-loader!app/entities.js');
    require('script-loader!app/utilities.js');
    require('script-loader!app/clickable.js');
    new p5(null, 'game-container');

  }

  componentWillUnmount() {
      if(sndMusic){
          sndMusic.dispose();
      }
  }

  render() {
    return (
      <div id={'game-container'} />
    );
  }
}

export default GameContainer;
