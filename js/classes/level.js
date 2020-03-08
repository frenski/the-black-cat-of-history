class Level {

  constructor (tiles, buildings, citizens, characters,
              envelements, scenarios, canv_data, ui) {
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
    this.scenarios = scenarios;
    this.tilesContainer = new PIXI.Container();
    this.canvData.stage.addChild(this.tilesContainer);
    this.character = null;
    this.maxWrongCollisions = 2;
    this.heartsContainer = new PIXI.Container();
    this.hearts = [];
    this.target = null;
    this.ui = ui;
    this.caught = false;
  }

  load (callback) {

        this.ui.showModalBinaryChoice(
          "Well done!",
          "You jinxed Hitler! Choose his bad luch today!",
          '<img src="assets/scenarios/'+this.scenarios[0].icon+'">',
          '<img src="assets/scenarios/'+this.scenarios[1].icon+'">',
          this.scenarios[0].text,
          this.scenarios[1].text);

    // initiating the grid
    for (var i=0; i<this.canvData.gridX; i++) {
      this.tiles[i] = [];
      for (var j=0; j<this.canvData.gridY; j++) {
        this.tiles[i][j] = null;
      }
    }

    // Creating  tile instances
    for (var i=0; i<this.tiles_data.length; i++) {
      let tile = null;
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

    // Creating hearts
    let hSize = Math.round ((this.canvData.width/this.canvData.gridX)*0.7);
    let heart_image =
      this.canvData.dirs.assetsUiDir + 'heart.png';
    let heart_padd_coeff = 1.3;
    for (var i=0; i<this.maxWrongCollisions; i++) {
      let tex = PIXI.Texture.from(heart_image);
      let heart = new PIXI.Sprite(tex);
      this.hearts.push(heart);
      this.heartsContainer.addChild(heart);
      heart.position.x = i*hSize*heart_padd_coeff;
      heart.position.y = hSize*0.25;
      heart.width = hSize;
      heart.height = hSize;
    }
    this.canvData.stage.addChild (this.heartsContainer);
    this.heartsContainer.position.x =
      this.canvData.width - this.maxWrongCollisions * hSize * heart_padd_coeff - heart_padd_coeff;
    this.heartsContainer.position.y = 0;
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
                                'citizen' + i,
                                this.citizens_data[i].target);
      var rand_tid = Math.floor(Math.random() * (this.streetTilesList.length));
      var attach_tile = this.streetTilesList[rand_tid];
      citizen.addToContainer(attach_tile);
      this.citizens.push (citizen);
      if (this.citizens_data[i].target) this.target = this.citizens_data[i];
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
                                [0,1,0,(2+i)%2],0.5);
      let randX = Math.floor(Math.random() * (this.canvData.gridX));
      var position = [randX, (i+1) * Math.round(this.canvData.gridX/(this.envelements_data.length+4.5))];
      cloud.addToContainer(position);
      this.envElements.push(cloud);
    }
  }

  addCharacter() {
    let image_file =
      this.canvData.dirs.assetsCharDir + this.characters_data[0].image;
    this.character = new Character(this.tilesContainer,
                              this.canvData,
                              image_file,
                              this);
    var rand_tid = Math.floor(Math.random() * (this.streetTilesList.length));
    var attach_tile = this.streetTilesList[rand_tid];
    this.character.addToContainer(attach_tile);
  }

  moveElements () {
    // console.log('moving elements');
    for (var i=0; i<this.envElements.length; i++) {
      this.envElements[i].moveElement();
    }

    for (var i=0; i<this.citizens.length; i++) {
      this.citizens[i].moveElement();
    }

    this.character.moveElement()

  }

  levelOver () {
    this.ui.showModalGO('<h1>GAME OVER</h1><h2>You failed to jinx '+this.target.name+'</h2><div class="main-message">History will <br>repeat itself</div><a href="game.html" class="button-playgain">Play agian</a>');
  }

  levelSuccesChoice () {
    console.log("AAAA");
    this.ui.showModalBinaryChoice('You jinxed ' + this.target.name + '!', 'Choose his bad luck today!');
  }

}
