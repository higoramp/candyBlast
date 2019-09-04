const chokidar = require('chokidar');

const extendConfig = require('./extendConfig');

const readDirectory = require('./readDirectory');

const findRootDirectory = require('./findRootDirectory');


const watch = () => {

  // Watch the .koji directory from a node_modules directory
  configDirectory = findRootDirectory()+'/.koji/customization';
  const files = readDirectory(configDirectory)
    .filter((path) => (path.endsWith('koji.json') || path.includes('.koji')) && !path.includes('.koji-resources'));

  // Note: Polling is used by default in the container via
  // the CHOKIDAR_USEPOLLING=1 env that is set in the container
  const watcher = chokidar.watch(files);
  watcher.add(configDirectory);
  watcher
    .on('error', (error) => console.error(`[@higoramp/extendConfig] Watcher error: ${error}`))
    .on('change', (path) => {
        watcher.unwatch(path);
        console.log("Unwatch: "+path);
      extendConfig(() => {
          console.log("Filed saved. lets watch again");
          watcher.add(path);
      }, path);
    })
    .on('add', (path) => {
      watcher.add(path);
    })
    .on('ready', () => {
      const watched = watcher.getWatched();
      Object.keys(watched).map((path) => watched[path].map((file) => console.log(`[@higoramp/extendConfig] Watching ${path}/${file}`)));
    });
};

module.exports =  watch;