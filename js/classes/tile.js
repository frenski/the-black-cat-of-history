
class Tile {

  constructor(container, canv_data, image_file, position) {
    this.image = image_file;
    this.container = container;
    this.position = position;
    this.canvasData = canv_data;
    var tex = PIXI.Texture.from(this.image);
		this.sprite = new PIXI.Sprite(tex);
    this.sprite.anchor.set(0.5);
  }

  addToContainer() {
    var tileSize = Math.round (this.canvasData.width/this.canvasData.gridX);
    this.sprite.position.x = this.position[0] * tileSize + tileSize/2;
    this.sprite.position.y = this.position[1] * tileSize + tileSize/2;
    this.sprite.width = tileSize;
    this.sprite.height = tileSize;
    this.container.addChild(this.sprite);
  }

}

class StreetTile extends Tile {

  constructor(container, canv_data, image_file, position, directions) {
    super (container, canv_data, image_file, position);
    this.directions = directions;
    this.neighborTiles = [null, null, null, null];
  }

  setNeighborTile (dir, tile) {
    this.neighborTiles[dir] = tile;
  }

}
