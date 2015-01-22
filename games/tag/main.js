// Initialize enchant.js
enchant();

// Helper functions
var helpers = {
  randomx : function(width) {
    return Math.floor(Math.random() * width);
  },
  randomy : function(height) {
    return Math.floor(Math.random() * height);
  },
  randomdirection : function() {
    // like a dice roll. 1 - 3 go right, 4 - 6 go left likewise up and down.k
    var x = Math.floor(Math.random() * 6) - 3;
    var y = Math.floor(Math.random() * 6) - 3;
    return { x : x, y : y };
  },
  nearest : function(from, others) {
    var distance = function(x1, y1, x2, y2) {
      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    return others.sort(function(other){
      return distance(from.x, from.y, other.x, other.y);
    })[0];
  }
}

// window.onload executes when the static page is finished loading.
window.onload = function(){
    var game = new Core(400, 320);
    game.fps = 15;
    game.preload("chara1.png");
    game.scale = 1.5;
    var characters = {
      player: 10,
      runner: 0,
      it: 5
    }

    game.onload = function(){
        var player = new Sprite(32, 32);
        player.image = game.assets["chara1.png"];
        player.x = game.width / 2;
        player.y = game.height / 2;
        player.character = characters.player;
        player.frame = player.character;
        game.rootScene.addChild(player);
        player.addEventListener("enterframe", function(){
          var speed = 3;
            if (game.input.up && this.y - speed >= 0) {
              this.y -= speed;
              this.frame = this.age % 2 + this.character;
            }
            if (game.input.down && this.y + speed <= game.height - player.height) {
              this.y += speed;
              this.frame = this.age % 2 + this.character;
            }
            if (game.input.right && this.x + speed <= game.width - player.width) {
              this.x += speed;
              this.frame = this.age % 2 + this.character;
            }
            if (game.input.left && this.x - speed >= 0) {
              this.x -= speed;
              this.frame = this.age % 2 + this.character;
            }
        });

        var runners = [];
        for (var r = 0; r < 5; r++) {
          runners[r] = new Sprite(32, 32);
          runners[r].image = game.assets["chara1.png"];
          runners[r].x = helpers.randomx(game.width - runners[r].width);
          runners[r].y = helpers.randomy(game.height - runners[r].height);
          runners[r].character = characters.runner;
          runners[r].frame = runners[r].character;
          runners[r].direction = helpers.randomdirection();
          runners[r].addEventListener("enterframe", function(){
            nextX = this.x + this.direction.x;
            if (nextX > 0 && nextX <= game.width - this.width) {
              this.x += this.direction.x;
            } else {
              this.direction.x *= -1;
            }

            nextY = this.y + this.direction.y;
            if (nextY > 0 && nextY <= game.height - this.height) {
              this.y += this.direction.y;
            } else {
              this.direction.y *= -1;
            }

            this.frame = this.age % 2 + this.character;
          });

          game.rootScene.addChild(runners[r]);
        }

        var chased = [];
        for (var c = 0; c < runners.length; c++) {
          chased[c] = runners[c];
        }
        chased.push(player);

        var it = new Sprite(32, 32);
        it.image = game.assets["chara1.png"];
        it.x = helpers.randomx(game.width - it.width);
        it.y = helpers.randomy(game.height - it.height);
        it.character = characters.it;
        it.frame = it.character;
        helpers.nearest(this, runners)
        it.addEventListener("enterframe", function(){
          // Figure out if it tags someone or not
          if (this.within(this.chasing) && (game.frame - this.chasing.frame_last_tagged) > 100) {
            console.log("tag!");
            var newx = this.chasing.x;
            var newy = this.chasing.y;
            this.chasing.x = this.x;
            this.chasing.y = this.y;
            this.chasing.frame_last_tagged = game.frame;
            this.wait_for = 200;
            return;
          }

          /* Give chase! */
          if (this.wait_for > 0) {
            this.wait_for -= 1;
            return;
          }

          if (this.chasing === undefined) {
            this.chasing = helpers.nearest(this, chased);
            console.log(this.chasing)
            this.chasing_since_frame = this.age;
          }
          if (this.chasing.x > this.x) {
            this.x += 3
          } else if (this.chasing.x < this.x) {
            this.x -= 3;
          }

          if (this.chasing.y > this.y) {
            this.y += 3
          } else if (this.chasing.y < this.y) {
            this.y -= 3;
          }
          this.frame = this.age % 2 + this.character;
          if (this.age - this.chasing_since_frame > 100) {
            this.chasing = undefined;
          }

        });
        game.rootScene.addChild(it);

        console.log("Game is starting!");
    };
    game.start();
};
