import { h, render } from 'preact';
import Koji from 'koji-tools';
import './leaderboardStyles.css';
import './index.css';

window.Koji = Koji;

Koji.pageLoad();

let root;
function init() {
	let App = require('../app/components/App').default;
	root = render(<App />, document.body, root);
}

// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('../app/components/App', () => requestAnimationFrame(init) );
}

init();
