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
      player_chaser: 6,
      player_tagged: 13,
      runner: 0,
      chaser: 5,
      tagged: 3
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
        runners[r].addEventListener("enterframe", function() { this.frame_handler() });
        runners[r].frame_handler = enterframe.runner;
        game.rootScene.addChild(runners[r]);
      }

      // Make the first runner the player.
      runners[0].frame_handler =  enterframe.player_runner;
      runners[0].frame = characters.player_runner;

      // Make the next runner the first chaser.
      runners[1].frame_handler = enterframe.chaser;
      runners[1].frame = characters.chaser;

      console.log("Game is starting!");
    };
    game.start();

    var runners = [];
    var enterframe = {
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
      player_chaser : function() {
        // Figure out we tagged someone or not
        for (var r = 0; r < runners.length; r++) {
          if (this.tagged === undefined && runners[r] !== this && this.intersect(runners[r])) {
            this.tagged = runners[r];
          }
        }

        // Tag them if we got them!
        if (this.tagged) {
          this.tagged.frame_handler = enterframe.tagged;
          this.tagged.tag_timer = 20;
          this.tagged = undefined;
          this.frame_handler = enterframe.player_runner;
          return;
        }

        var speed = 3;
        if (game.input.up && this.y - speed >= 0) {
          this.y -= speed;
          this.frame = this.age % 2 + characters.player_chaser;
        }
        if (game.input.down && this.y + speed <= game.height - this.height) {
          this.y += speed;
          this.frame = this.age % 2 + characters.player_chaser;
        }
        if (game.input.right && this.x + speed <= game.width - this.width) {
          this.x += speed;
          this.frame = this.age % 2 + characters.player_chaser;
        }
        if (game.input.left && this.x - speed >= 0) {
          this.x -= speed;
          this.frame = this.age % 2 + characters.player_chaser;
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
        for (var r = 0; r < runners.length; r++) {
          if (this.tagged === undefined && runners[r] !== this && this.intersect(runners[r])) {
            this.tagged = runners[r];
          }
        }

        if (this.tagged) {
          if (this.tagged.frame_handler === enterframe.player_runner) {
            this.tagged.frame_handler = enterframe.player_tagged;
          } else {
            this.tagged.frame_handler = enterframe.tagged;
          }

          this.tagged.tag_timer = 20;
          this.tagged = undefined;
          this.frame_handler = enterframe.runner;

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
        if (this.age - this.chasing_since_frame > game.fps * 3) {
          this.chasing = undefined;
        }
      },

      tagged : function() {
        this.frame = characters.tagged;
        if (this.tag_timer > 0) {
          this.tag_timer -= 1;
          return;
        }
        this.frame_handler = enterframe.chaser;
    },
      player_tagged : function() {
        this.frame = characters.player_tagged;
        if (this.tag_timer > 0) {
          this.tag_timer -= 1;
          return;
        }
        this.frame_handler = enterframe.player_chaser;
    }
  };
};
