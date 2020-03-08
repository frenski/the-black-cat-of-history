const canvasSizeRatio = 0.5625;
const tileSize = 72;
const gridSize = [26,15]
const rootUrl = 'http://localhost/hackathon-gamesjs2020/'
const assetsDir = rootUrl + 'assets/';
const assetsTilesDir = assetsDir + 'tiles/';
const assetsCharDir = assetsDir + 'characters/';
const assetsBuildDir = assetsDir + 'buildings/';
const assetsEnvDir = assetsDir + 'env/';
const assetsUiDir = assetsDir + 'ui/';
const dataDir = rootUrl + 'data/';
const dataLevelsDir = rootUrl + 'data/levels/';
const backCol = 0x8fd9ae;
const offsetSize = [25,0];


document.addEventListener("DOMContentLoaded", function() {

  var canvasContainerEl = document.getElementById('canvas-container');
  // var canvasEl = document.getElementById('main-canvas');

  var canvW = canvasContainerEl.offsetWidth  - offsetSize[0];
  var canvH = canvW * canvasSizeRatio  - offsetSize[1];
  canvasContainerEl.style.height = canvH + 'px';

  var pixRatio = window.devicePixelRatio;
  var zoom = 1;

  var levels = [];
  var currentLevel = 1;

  const app = new PIXI.Application({
    backgroundColor: backCol,
    resolution: pixRatio,
    autoResize: true,
    zoom: zoom,
    width: canvW,
    height: canvH
  });
  canvasContainerEl.appendChild(app.view);

  // app.renderer = PIXI.autoDetectRenderer(canvW, canvH, {
  //   view: canvasEl,
  //   resolution: pixRatio,
  //   autoResize: true
  // });

  var canvasData = {
    'width':app.screen.width,
    'height':app.screen.height,
    'gridX': gridSize[0],
    'gridY': gridSize[1],
    'stage': app.stage,
    'dirs': {
      'assetsDir': assetsDir,
      'assetsTilesDir': assetsTilesDir,
      'assetsCharDir': assetsCharDir,
      'assetsBuildDir': assetsBuildDir,
      'assetsEnvDir': assetsEnvDir,
      'assetsUiDir': assetsUiDir
    }
  }

  var resize = function() {
      app.renderer.view.style.width = canvasContainerEl.clientWidth - offsetSize[0] + 'px';
      app.renderer.view.style.height =
      canvasContainerEl.clientWidth * canvasSizeRatio - offsetSize[1] + 'px';
  }
  window.onresize = resize;

  var loadLevelData = function(levelId, callback) {
    var lData = [];
    var xhr = new XMLHttpRequest();
    var url = dataLevelsDir + 'level' + levelId + '.json';
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status !== 200) {
        console.log ('Failed to send ad request '
        + '.  Returned status of '
        + xhr.status);
      } else {
        var lData = JSON.parse(xhr.responseText);
        callback(lData);
      }
    };
    xhr.send(null);
  }


  app.loader
    .add('data/levels/level1.json')
    .load(onAssetsLoaded);

  function onAssetsLoaded() {

    var ui = new GameUI();

    loadLevelData(1, function (ldata){
      // Setting up level 1
      var tiles1 = ldata.tiles;
      var buildings1 = ldata.buildings;
      var citizens1 = ldata.citizens;
      var characters1 = ldata.characters;
      var envelements1 = ldata.env_elements;
      var level1 = new Level(tiles1,
                            buildings1,
                            citizens1,
                            characters1,
                            envelements1,
                            canvasData, ui);
      levels.push (level1);
      level1.load();
      level1.addCitizens();
      level1.addCharacter();
      level1.addBuildings();
      level1.addEnvElements();

      app.ticker.add((delta) => {
        // console.log(delta);
        levels[currentLevel-1].moveElements();
      });

    });


  }


});
