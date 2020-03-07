class Citizen {

  constructor(container, canv_data, image_file) {
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
  }

  rotateElement(angle) {
    this.sprite.rotation = angle;
  }

  rotateElementByDirId () {
    var angle = (Math.PI*2)*(0.25*this.moveDirectionId);
    // console.log(angle);
    this.rotateElement(angle);
  }

  setDir (dirId) {
    for (var i=0; i<this.moveDirection.length; i++) {
      this.moveDirection[i] = 0;
    }
    this.moveDirection[dirId] = 1;
    this.moveDirectionId = dirId;
    this.rotateElementByDirId()
  }

  setRandomDirByTitle (tile) {
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

    // Adding it to the position of the assigned title
    this.sprite.position.x = tile.position[0] * tileSize + tileSize/2;
    this.sprite.position.y = tile.position[1] * tileSize + tileSize/2;
    this.currentTile = tile;

    this.setRandomDirByTitle(tile);

  }

  moveElement() {

  }

}

class Character extends Citizen {

  constructor(container, canv_data, image_file) {
    super (container, canv_data, image_file);
  }

  changeNextMove(direction) {

  }

}
