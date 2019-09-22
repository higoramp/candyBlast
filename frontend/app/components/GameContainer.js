import { h, Component } from 'preact';
import PropTypes from 'prop-types';




class GameContainer extends Component {
  componentDidMount() {
    require('script-loader!@higoramp/p5/lib/p5.min.js');1
    require('script-loader!@higoramp/p5/lib/addons/p5.sound.min.js');
    require('script-loader!app/index.js');
    require('script-loader!app/entities.js');
    require('script-loader!app/utilities.js');
    require('script-loader!app/clickable.js');
    console.log("DID MOUNT");

  }

  componentWillUnmount() {
      if(sndMusic){
          //sndMusic.dispose();
      }
  }

  render() {
    return (
      <div id={'game-container'} />
    );
  }
}

export default GameContainer;
