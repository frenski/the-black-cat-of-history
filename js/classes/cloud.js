class Cloud {

  constructor(container, canv_data, image_file, dir, pace) {
    this.image = image_file;
    this.container = container;
    this.canvasData = canv_data;
    this.dir = dir;
    this.pace = pace;
    var tex = PIXI.Texture.from(this.image);
		this.sprite = new PIXI.Sprite(tex);
  }

  addToContainer(position) {
    var tileSize = Math.round (this.canvasData.width/this.canvasData.gridX);
    this.sprite.position.x = position[0] * tileSize;
    this.sprite.position.y = position[1] * tileSize ;
    this.sprite.width = tileSize * 2;
    this.sprite.height = tileSize;
    this.container.addChild(this.sprite);
  }

  moveElement () {
    var s = this.sprite;
    var p = this.pace;
    if (this.dir[3] == 1) {
      p = -p;
      if (s.position.x <= -s.width) {
        s.position.x = this.canvasData.width + s.width;
      }
    } else {
      if (s.position.x >= this.canvasData.width + s.width) {
        s.position.x = -s.width;
      }
    }

    this.sprite.position.x += p;

  }

}
