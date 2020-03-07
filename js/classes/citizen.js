class Citizen {

  constructor(container, canv_data, image_file, level, cit_id, target=false) {
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
    this.target = target;
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
    var randDir = pos_dir[Math.floor(Math.random() * (pos_dir.length))];
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
    this.currentTile = this.nextTile;
    this.nextTile = null;
    var x = this.currentTile.position[0];
    var y = this.currentTile.position[1];
    if (JSON.stringify(this.currentTile.directions) == JSON.stringify([1, 0, 1, 0])) {
      if (this.moveDirectionId == 0) {
        this.nextTile = this.level.getTileById (x, y-1);
      } else if (this.moveDirectionId == 2) {
        this.nextTile = this.level.getTileById (x, y+1);
      }
    } else if (JSON.stringify(this.currentTile.directions) == JSON.stringify([0, 1, 0, 1])) {
      if (this.moveDirectionId == 1) {
        this.nextTile = this.level.getTileById (x+1, y);
      } else if (this.moveDirectionId == 3) {
        this.nextTile = this.level.getTileById (x-1, y);
      }
    } else {
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
      this.decideNextMove();
    }
  }

  setPosition(new_pace) {

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

  }

  moveElement(new_pace) {

    this.setPosition(new_pace)
    if (this.nextTile) this.detectTileColision();

  }

}

class Character extends Citizen {

  constructor(container, canv_data, image_file, level) {
    super (container, canv_data, image_file, level, 'player', false);

    this.pkeys = -1;
    this.collisions = [];

    var self = this;

    window.onkeydown = function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      self.pkeys = code;
      return false;
    }
    window.onkeyup = function (e) {
      self.pkeys = -1;
      return false;
    };

  }

  // override
  decideNextMove() {
    this.currentTile = this.nextTile;
    this.nextTile = null;
  }

  // detect citizen collition
  detectCitizenCollision () {
    var citizens = this.level.citizens;
    for (var i=0; i<citizens.length; i++) {
      if (this.currentTile === citizens[i].currentTile) {
        if (citizens[i].target) {
          console.log("WELL DONE");
        } else {
          if (this.collisions.indexOf(citizens[i]) === -1) {
            this.collisions.push (citizens[i]);
            citizens[i].sprite.alpha = 0.5;
            if (this.collisions.length >= this.level.maxWrongCollisions) {
              console.log("GAME OVER");
            }
          }
        }
      }
    }
  }

  // override
  moveElement() {

    var self = this;

    var setNextTile = function (x, y) {
      self.nextTile = self.level.getTileById(x, y)
    }

    var x = this.currentTile.position[0];
    var y = this.currentTile.position[1];

    if (this.pkeys == 37 || this.pkeys == 38 || this.pkeys == 39 || this.pkeys == 40) {
      if (this.pkeys == 38) {
        if (this.currentTile.directions[0]) {
          this.moveDirectionId = 0;
          setNextTile (x, y-1);
        }
        // console.log("UP");
      }
      if (this.pkeys == 40) {
        if (this.currentTile.directions[2]) {
          this.moveDirectionId = 2;
          setNextTile (x, y+1);
        }
        // console.log("DOWN")
      }
      if (this.pkeys == 39) {
        if (this.currentTile.directions[1]) {
          this.moveDirectionId = 1;
          setNextTile (x+1, y);
        }
        // console.log("RIGHT")
      }
      if (this.pkeys == 37) {
        if (this.currentTile.directions[3]) {
          this.moveDirectionId = 3;
          setNextTile (x-1, y);
        }
      }
      this.rotateElementByDirId();
      this.setPosition(1.2);
      this.detectCitizenCollision();
      if (this.nextTile) this.detectTileColision()
    }


  }

  changeNextMove(direction) {

  }

}
