class GameUI {

  constructor() {

    this.modalRect = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['modal-rect']
    });

    this.modalSplash = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['modal-splash']
    });

  }

  showModalGO(text) {
    this.modalSplash.setContent('<h1>'+text+'</h1>');
    this.modalSplash.open();
  }

  showModalBinaryChoice(intro, desc, ch1, ch2, txt1, txt2) {
    var content = '<h1>'+intro+'</h1>';
    content += '<h2>'+desc+'</h2>';
    content += '<a class="scenario-block" style="float: left; width:50%;"><div>'+ch1+'</div><h3>'+txt1+'</h3></a>';
    content += '<a class="scenario-block" style="float: left; width:50%;"><div>'+ch2+'</div><h3>'+txt2+'</h3></a>';
    content += '<div style="clear: both;"><div>';
    this.modalRect.setContent(content);
    this.modalRect.open ();
  }

  closeModalRect() {
    this.modalRect.close();
  }

}