class Building {

  constructor(container, canv_data, image_file, position, size) {
    this.image = image_file;
    this.container = container;
    this.canvasData = canv_data;
    this.position = position;
    this.size = size;
    var tex = PIXI.Texture.from(this.image);
		this.sprite = new PIXI.Sprite(tex);
    this.sprite.anchor.set(0.5/size[0], 0.5/size[1]);
  }

  addToContainer() {
    var tileSize = Math.round (this.canvasData.width/this.canvasData.gridX);
    this.sprite.position.x = this.position[0] * tileSize + tileSize/2;
    this.sprite.position.y = this.position[1] * tileSize + tileSize/2;
    this.sprite.width = tileSize * this.size[0];
    this.sprite.height = tileSize * this.size[1];
    this.container.addChild(this.sprite);
  }

}
