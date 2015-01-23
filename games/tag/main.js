// Initialize enchant.js
enchant();

// window.onload executes when the static page is finished loading.
window.onload = function(){
    var game = new Core(400, 320);
    game.fps = 15;
    game.preload("chara1.png");
    game.scale = 1.5;
    var characters = {
      player_runner: 10,
      player_chaser: 10,
      runner: 0,
      chaser: 5
    }

    // Helper functions
    var helpers = {
      randominteger : function(max) {
        return Math.floor(Math.random() * max);
      },
      randomdirection : function() {
        // like a dice roll. 1 - 3 go right, 4 - 6 go left likewise up and down.k
        var x = Math.floor(Math.random() * 2 + 1) * 3;
        var y = Math.floor(Math.random() * 2 + 1) * 3;
        return { x : x, y : y };
      },
      nearest : function(from, all) {
        var distance = function(x1, y1, x2, y2) {
          return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }
        var others = all.filter(function(each) { return each !== from; });

        return others.sort(function(other){
          return distance(from.x, from.y, other.x, other.y);
        })[0];
      }
    }

    game.onload = function(){
      game.rootScene.backgroundColor = "#22cc66";

      for (var r = 0; r < 7; r++) {
        runners[r] = new Sprite(32, 32);
        runners[r].image = game.assets["chara1.png"];
        runners[r].x = helpers.randominteger(game.width - runners[r].width);
        runners[r].y = helpers.randominteger(game.height - runners[r].height);
        runners[r].direction = helpers.randomdirection();
        runners[r].addEventListener("enterframe", enterframe.runner);
        game.rootScene.addChild(runners[r]);
      }

      // Make the first runner the player.
      runners[0].removeEventListener("enterframe", enterframe.runner);
      runners[0].addEventListener("enterframe", enterframe.player_runner);
      runners[0].frame = characters.player_runner;

      // Make the next runner the first chaser.
      runners[1].removeEventListener("enterframe", enterframe.runner);
      runners[1].addEventListener("enterframe", enterframe.chaser);

      console.log("Game is starting!");
    };
    game.start();

    var runners = [];
    var enterframe = {
      player_chaser : function() {

      },
      player_runner : function() {
        var speed = 3;
        if (game.input.up && this.y - speed >= 0) {
          this.y -= speed;
          this.frame = this.age % 2 + characters.player_runner;
        }
        if (game.input.down && this.y + speed <= game.height - this.height) {
          this.y += speed;
          this.frame = this.age % 2 + characters.player_runner;
        }
        if (game.input.right && this.x + speed <= game.width - this.width) {
          this.x += speed;
          this.frame = this.age % 2 + characters.player_runner;
        }
        if (game.input.left && this.x - speed >= 0) {
          this.x -= speed;
          this.frame = this.age % 2 + characters.player_runner;
        }
      },
      runner : function() {
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

        this.frame = this.age % 2 + characters.runner;
      },
      chaser : function() {
        // Figure out if it tags someone or not
        if (this.intersect(this.chasing)) {
          if (this.chasing.frame_last_tagged && game.frame - this.chasing.frame_last_tagged < 100) {
            return;
          }

          console.log("tag!");
          var newx = this.chasing.x;
          var newy = this.chasing.y;
          this.chasing.x = this.x;
          this.chasing.y = this.y;
          this.x = newx;
          this.y = newy;
          this.chasing.frame_last_tagged = game.frame;
          this.wait_for = 60;
          return;
        }

        // Give chase!
        if (this.wait_for > 0) {
          this.wait_for -= 1;
          return;
        }

        if (this.chasing === undefined) {
          this.chasing = helpers.nearest(this, runners);
          console.log(this.chasing);
          this.chasing_since_frame = this.age;
        }
        if (this.chasing.x > this.x) {
          this.x += 3;
        } else if (this.chasing.x < this.x) {
          this.x -= 3;
        }

        if (this.chasing.y > this.y) {
          this.y += 3
        } else if (this.chasing.y < this.y) {
          this.y -= 3;
        }
        this.frame = this.age % 2 + characters.chaser;
        if (this.age - this.chasing_since_frame > 100) {
          this.chasing = undefined;
        }
      }
    };

  };
