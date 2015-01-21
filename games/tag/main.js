// Initialize enchant.js
enchant();

// window.onload executes when the static page is finished loading.
window.onload = function(){
    var game = new Core(400, 320);
    game.fps = 15;
    game.preload("chara1.png");
    var characters = {
      player: 10,
      runner: 0,
      it: 5
    }
    game.onload = function(){
        var bear = new Sprite(32, 32);

        bear.image = game.assets["chara1.png"];
        bear.x = game.width / 2;
        bear.y = game.height / 2;
        bear.character = characters.it;
        bear.frame = bear.character;
        game.rootScene.addChild(bear);

        bear.addEventListener("enterframe", function(){
          var speed = 3;
            if (game.input.up && this.y - speed >= 0) {
              this.y -= speed;
              this.frame = this.age % 2 + this.character;
            }
            if (game.input.down && this.y + speed <= game.height - bear.height) {
              this.y += speed;
              this.frame = this.age % 2 + this.character;
            }
            if (game.input.right && this.x + speed <= game.width - bear.width) {
              this.x += speed;
              this.frame = this.age % 2 + this.character;
            }
            if (game.input.left && this.x - speed >= 0) {
              this.x -= speed;
              this.frame = this.age % 2 + this.character;
            }
        });

        bear.addEventListener("touchstart", function(){
            game.rootScene.removeChild(bear);
        });
    };
    game.start();
};
