class Level {

  constructor (tiles, buildings, citizens, characters, envelements, canv_data) {
    this.tiles_data = tiles;
    this.tiles = [];
    this.streetTilesList = [];
    this.citizens_data = citizens;
    this.citizens = []
    this.characters_data = characters;
    this.characters = [];
    this.envelements_data = envelements;
    this.envElements = [];
    this.buildings_data = buildings;
    this.canvData = canv_data;
    this.tilesContainer = new PIXI.Container();
    this.canvData.stage.addChild(this.tilesContainer);
  }

  load (callback) {

    // initiating the grid
    for (var i=0; i<this.canvData.gridX; i++) {
      this.tiles[i] = [];
      for (var j=0; j<this.canvData.gridY; j++) {
        this.tiles[i][j] = null;
      }
    }

    // Creating  tile instances
    for (var i=0; i<this.tiles_data.length; i++) {
      var tile = null;
      let t = this.tiles_data[i];
      if (t.type == 'g') {
        let image_file =
          this.canvData.dirs.assetsTilesDir + 'tile-green' + t.dirs.join('') + '.png';
        tile = new Tile(
            this.tilesContainer,
            this.canvData,
            image_file,
            t.position,
            'tile' + i
        )
      } else if (t.type == 's') {
        let image_file =
          this.canvData.dirs.assetsTilesDir + 'tile-street' + t.dirs.join('') + '.png';
        tile = new StreetTile(
            this.tilesContainer,
            this.canvData,
            image_file,
            t.position,
            t.dirs,
            'tile' + i
        )
        this.streetTilesList.push(tile);
      }

      if (tile) {
        this.tiles[tile.position[0]][tile.position[1]] = tile;
        tile.addToContainer();
      }
    }

  }

  getTileById (x,y) {
    if (typeof this.tiles[x][y] !== 'undefined') return this.tiles[x][y];
    return null;
  }

  addCitizens() {
    for (var i=0; i<this.citizens_data.length; i++) {
      let image_file =
        this.canvData.dirs.assetsCharDir + this.citizens_data[i].image;
      var citizen = new Citizen(this.tilesContainer,
                                this.canvData,
                                image_file,
                                this,
                                'citizen' + i);
      var rand_tid = Math.floor(Math.random() * (this.streetTilesList.length-1));
      var attach_tile = this.streetTilesList[rand_tid];
      citizen.addToContainer(attach_tile);
      this.citizens.push (citizen);
    }
  }

  addBuildings () {
    for (var i=0; i<this.buildings_data.length; i++) {
      let image_file =
        this.canvData.dirs.assetsBuildDir + this.buildings_data[i].image;
      var building = new Building(this.tilesContainer,
                                this.canvData,
                                image_file,
                                this.buildings_data[i].position,
                                this.buildings_data[i].size);
      building.addToContainer();
    }
  }

  addEnvElements () {
    for (var i=0; i<this.envelements_data.length; i++) {
      let image_file =
        this.canvData.dirs.assetsEnvDir + this.envelements_data[i].image;
      var cloud = new Cloud(this.tilesContainer,
                                this.canvData,
                                image_file,
                                [0,1,0,(2+i)%2],
                                0.5);

      let randX = Math.floor(Math.random() * (this.canvData.gridX-1));
      var position = [randX, (i+1) * Math.round(this.canvData.gridX/(this.envelements_data.length+3))];
      cloud.addToContainer(position);
      this.envElements.push(cloud);
    }
  }

  moveElements () {
    // console.log('moving elements');
    for (var i=0; i<this.envElements.length; i++) {
      this.envElements[i].moveElement();
    }

    for (var i=0; i<this.citizens.length; i++) {
      this.citizens[i].moveElement();
    }

  }

}
