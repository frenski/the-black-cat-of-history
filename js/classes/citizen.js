class Citizen {

  constructor(container, canv_data, image_file, level, cit_id) {
    this.id = cit_id
    this.image = image_file;
    this.container = container;
    this.canvasData = canv_data;
    var tex = PIXI.Texture.from(this.image);
		this.sprite = new PIXI.Sprite(tex);
    this.currentTile = null;
    this.nextTile = null;
    this.moveDirection = [0,0,0,0];
    this.moveDirectionId = -1;
    this.sprite.anchor.set(0.5);
    this.pace = 1;
    this.level = level;
    this.allowReturn = false;
  }

  rotateElement(angle) {
    this.sprite.rotation = angle;
  }

  rotateElementByDirId () {
    var angle = (Math.PI*2)*(0.25*this.moveDirectionId);
    this.rotateElement(angle);
  }

  setDir (dirId) {
    for (var i=0; i<this.moveDirection.length; i++) {
      this.moveDirection[i] = 0;
    }
    this.moveDirection[dirId] = 1;
    this.moveDirectionId = dirId;
    this.rotateElementByDirId();

    // Setting next tiel
    var x = this.currentTile.position[0];
    var y = this.currentTile.position[1];

    switch (dirId) {
      case 0:
        y -= 1;
        break;
      case 1:
        x += 1;
        break;
      case 2:
        y += 1;
        break;
      case 3:
        x -= 1;
        break;
    }
    var nextTile = this.level.getTileById (x,y);
    this.nextTile = nextTile;
  }

  setRandomDirByTile (tile) {
    // creating a random orientation form possible directions
    var pos_dir = [];
    for (var i=0; i<tile.directions.length; i++) {
      if (tile.directions[i] == 1) pos_dir.push(i);
    }
    // console.log(pos_dir, tile.position);
    var randDir = pos_dir[Math.floor(Math.random() * (pos_dir.length-1))];
    this.setDir (randDir);
  }

  addToContainer(tile) {
    var tileSize = Math.round (this.canvasData.width/this.canvasData.gridX);
    this.sprite.width = tileSize;
    this.sprite.height = tileSize;
    this.container.addChild(this.sprite);

    // Adding it to the position of the assigned tile
    this.sprite.position.x = tile.position[0] * tileSize + tileSize/2;
    this.sprite.position.y = tile.position[1] * tileSize + tileSize/2;
    this.currentTile = tile;

    this.setRandomDirByTile(tile);

  }

  decideNextMove () {
    if (this.id == 'citizen0') {
      console.log("DECIDING");
    }
    var x = this.currentTile.position[0];
    var y = this.currentTile.position[1];
    if (this.id == 'citizen0') {
      console.log(this.currentTile.directions, this.moveDirectionId);
    }
    if (JSON.stringify(this.currentTile.directions) == JSON.stringify([1, 0, 1, 0])) {
      if (this.id == 'citizen0') {
        console.log("1, 0, 1, 0");
      }
      if (this.moveDirectionId == 0) {
        this.nextTile = this.level.getTileById (x, y-1);
      } else if (this.moveDirectionId == 2) {
        this.nextTile = this.level.getTileById (x, y+1);
      }
    } else if (JSON.stringify(this.currentTile.directions) == JSON.stringify([0, 1, 0, 1])) {
      if (this.id == 'citizen0') {
        console.log("1, 0, 1, 0");
      }
      if (this.moveDirectionId == 1) {
        this.nextTile = this.level.getTileById (x+1, y);
      } else if (this.moveDirectionId == 3) {
        this.nextTile = this.level.getTileById (x-1, y);
      }
    } else {
      if (this.id == 'citizen0') {
        console.log("assigning random");
      }
      this.setRandomDirByTile(this.currentTile);
    }
  }

  detectTileColision () {
    var cT = this.currentTile.sprite;
    var nT = this.nextTile.sprite;
    var e = this.sprite;

    var c_l = cT.position.x - cT.width/2;
    var c_t = cT.position.y - cT.height/2;
    var c_r = cT.position.x + cT.width/2;
    var c_b = cT.position.y + cT.height/2;
    var n_l = nT.position.x - nT.width/2;
    var n_t = nT.position.y - nT.height/2;
    var n_r = nT.position.x + cT.width/2;
    var n_b = nT.position.y + cT.height/2;
    var e_l = e.position.x - e.width/2;
    var e_t = e.position.y - e.height/2;
    var e_r = e.position.x + e.width/2;
    var e_b = e.position.y + e.height/2;

    var curTileOverlap = (Math.max(c_l,e_l) - Math.min(c_r,e_r))*(Math.max(c_t,e_t) - Math.min(c_b,e_b));
    var newTileOverlap = (Math.max(n_l,n_l) - Math.min(n_r,e_r))*(Math.max(n_t,e_t) - Math.min(n_b,e_b));
    if (newTileOverlap > (curTileOverlap * 20)) {
      if (this.id == 'citizen0') {
        console.log(this.currentTile.id, this.nextTile.id);
      }
      this.currentTile = this.nextTile;
      // console.log(this.currentTile.position);
      this.nextTile = null;
      this.decideNextMove();
    }
  }

  moveElement(new_pace) {
    // console.log(pace);
    var p = this.pace;
    if (typeof new_pace !== 'undefined') {
      p = new_pace;
    }

    switch (this.moveDirectionId) {
      case 0:
        this.sprite.position.y -= p;
        break;
      case 1:
        this.sprite.position.x += p;
        break;
      case 2:
        this.sprite.position.y += p;
        break;
      case 3:
        this.sprite.position.x -= p;
        break;
    }

    if (this.nextTile) this.detectTileColision();

  }

}

class Character extends Citizen {

  constructor(container, canv_data, image_file) {
    super (container, canv_data, image_file);
  }

  changeNextMove(direction) {

  }

}
