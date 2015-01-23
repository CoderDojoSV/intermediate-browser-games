// Initialize enchant.js
enchant();

// window.onload executes when the static page is finished loading.
window.onload = function(){
    // Create a game variable using Enchant.
    var game = new Core(400, 320);
    // Set the game's framerate to 15 frames per second.
    game.fps = 15;
    // We use an image file called chara1.png for this game.
    // By preloading it we make sure it's available as a sprite asset and
    // loaded before the game starts.
    game.preload("chara1.png");

    // event callback for the game's first load.
    game.onload = function(){
      // Set a background color so the player can see the game borders.
      // You can use any CSS color.
      game.rootScene.backgroundColor = "#22cc66";

      // Create 7 running bears using a `for` loop.
      for (var r = 0; r < 7; r++) {
        // Each bear is an enchant sprite.
        runners[r] = new Sprite(32, 32);
        // Use the character sprite we loaded earlier.
        runners[r].image = game.assets["chara1.png"];
        // Set a random starting location.
        runners[r].x = helpers.randominteger(game.width - runners[r].width);
        runners[r].y = helpers.randominteger(game.height - runners[r].height);
        // Have it run in a random direction when we start.
        runners[r].direction = helpers.randomdirection();
        // I had some problems I couldn't figure out adding and removing events.
        // This event listener actually just runs a separate handler so it's
        // easier to switch out.
        runners[r].addEventListener("enterframe", function() { this.frame_handler() });
        // Set a default handler for the runner.
        runners[r].frame_handler = enterframe.runner;

        // In order to put the bear on the screen, it needs to become a child
        // of the root scene through the addChild() method.
        game.rootScene.addChild(runners[r]);
      }

      // Make the first runner the player by setting their frame handler and
      // sprite image.
      runners[0].frame_handler =  enterframe.player_runner;
      runners[0].frame = characters.player_runner;

      // Make the next runner the first chaser by setting their frame handler and
      // sprite image.
      runners[1].frame_handler = enterframe.chaser;
      runners[1].frame = characters.chaser;

      // Log to the console that we at least got to the start of the game! \o/
      console.log("Game is starting!");
    };
    game.start();

    // Below this are a ton of "helper" functions, objects, and values.
    // Chances are if there was something above that wasn't defined yet, it's
    // down here.

    // These are the frame indexes of the specific characters we're us
    var characters = {
      player_runner: 10,
      player_chaser: 6,
      player_tagged: 13,
      runner: 0,
      chaser: 5,
      tagged: 3
    }

    // Helper functions which do various things.
    var helpers = {
      // return a random integer between 0 and the argument. 
      randominteger : function(max) {
        return Math.floor(Math.random() * max);
      },
      // pick a direction left or right ((-1 or 1 * 3)-1 or 1 * 3) and pick a direction up or down
      randomdirection : function() {
        var x = Math.floor(Math.random() * 2 + 1) * 3;
        var y = Math.floor(Math.random() * 2 + 1) * 3;
        return { x : x, y : y };
      },
      // return the nearest *other* bear 
      nearest : function(from, all) {
        var others = all.filter(function(each) { return each !== from; });

        return others.sort(function(other){
          return distance(from.x, from.y, other.x, other.y);
        })[0];
      },
      // Return the distance between two x, y coordinates.
      distance: function() {
        var distance = function(x1, y1, x2, y2) {
          return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }
    }


    // Make an empty array to put all the runners in. Doing it in this scope makes sure it's very available.
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
