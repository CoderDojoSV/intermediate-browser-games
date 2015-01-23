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
      // This event listener actually just runs a separate listener so it's
      // easier to switch out.
      runners[r].addEventListener("enterframe", function() { this.frame_listener() });
      // Set a default listener for the runner.
      runners[r].frame_listener = enterframe.runner;

      // In order to put the bear on the screen, it needs to become a child
      // of the root scene through the addChild() method.
      game.rootScene.addChild(runners[r]);
    }

    // Make the first runner the player by setting their frame listener and
    // sprite image.
    runners[0].frame_listener =  enterframe.player_runner;
    runners[0].frame = characters.player_runner;

    // Make the next runner the first chaser by setting their frame listener and
    // sprite image.
    runners[1].frame_listener = enterframe.chaser;
    runners[1].frame = characters.chaser;

  };

  // Log to the console that we at least got to the start of the game! \o/
  console.log("Game is starting!");
  game.start();

  // Below this are a ton of "helper" functions, objects, and values.
  // Chances are if there was something above that wasn't defined yet, it's
  // down here.

  // These are the frame indexes of the specific characters we're using in our sprite sheet.
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

    // pick a direction left or right and a direction up or down
    randomdirection : function() {
      var x = Math.floor(Math.random() * 2 + 1) * 3;
      var y = Math.floor(Math.random() * 2 + 1) * 3;
      return { x : x, y : y };
    },

    // Return the distance between two x, y coordinates.
    distance : function(x1, y1, x2, y2) {
      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    },

    // return the nearest *other* bear 
    nearest : function(from, all) {
      var others = all.filter(function(each) { return each !== from; });

      return others.sort(function(other){
        return helpers.distance(from.x, from.y, other.x, other.y);
      })[0];
    }
  };

  // Make an empty array to put all the runners in. Doing it in here makes it available to the game as well as the frame listener functions.
  var runners = [];

  // The enterframe object holds all of the frame listening functions for the various characters we have in our game.
  var enterframe = {
    // This frame listener allows the player to control a running bear using the arrow keys.
    player_runner : function() {
      // Set the running speed once so we can change it here if we decide to change it.
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

    // When the player is the chaser instead of a runner, they need to be able to tag other players as well as run around.
    player_chaser : function() {
      // Figure out we tagged someone or not
      for (var r = 0; r < runners.length; r++) {
        if (this.tagged === undefined && runners[r] !== this && this.intersect(runners[r])) {
          this.tagged = runners[r];
        }
      }

      // Tag them if we got them! If we tagged someone, don't run any more this turn so return early.
      if (this.tagged) {
        this.tagged.frame_listener = enterframe.tagged;
        this.tagged.tag_timer = 20;
        this.tagged = undefined;
        this.frame_listener = enterframe.player_runner;
        return;
      }

      // Set the speed of the player as chaser so we can change it only in one place.
      var speed = 3;

      // Give chase with the arrow keys just like when running.
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

    // This is the listener that runs for a computer chaser.
    chaser : function() {
      // Figure out if they tagged someone or not
      for (var r = 0; r < runners.length; r++) {
        if (this.tagged === undefined && runners[r] !== this && this.intersect(runners[r])) {
          this.tagged = runners[r];
        }
      }

      // When they tag someone, the tagged character becomes the new chaser after being tagged and this chaser becomes a regular runner.
      // If we tagged someone we return early instead of continuing to chase.
      if (this.tagged) {
        if (this.tagged.frame_listener === enterframe.player_runner) {
          this.tagged.frame_listener = enterframe.player_tagged;
        } else {
          this.tagged.frame_listener = enterframe.tagged;
        }

        this.tagged.tag_timer = 20;
        this.tagged = undefined;
        this.frame_listener = enterframe.runner;

        return;
      }

      // Give chase!

      // The chaser picks on a specific runner, if we haven't picked a runner, let's do that first by selecting the nearest one.
      if (this.chasing === undefined) {
        this.chasing = helpers.nearest(this, runners);
        // Chasing just one character wouldn't be fun so we only chase people for a little while.
        // That's why we set the chasing_since_frame variable.
        this.chasing_since_frame = this.age;
      }

      // Run towards the chased runner.
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

      // Animate the running chaser by moving the sprite frame.
      this.frame = this.age % 2 + characters.chaser;


      // If we've been chasing someone for three seconds, give up.
      if (this.age - this.chasing_since_frame > game.fps * 3) {
        this.chasing = undefined;
      }
    },

    // This listener handles a non-player-character who was just tagged.
    // The tag_timer was set when they got tagged and makes them wait before becoming a chaser themself.
    tagged : function() {
      this.frame = characters.tagged;
      if (this.tag_timer > 0) {
        this.tag_timer -= 1;
        return;
      }
      this.frame_listener = enterframe.chaser;
    },

    // This listener handles a player-character who was just tagged.
    // The tag_timer was set when they got tagged and makes them wait before becoming a chaser themself.
    player_tagged : function() {
      this.frame = characters.player_tagged;
      if (this.tag_timer > 0) {
        this.tag_timer -= 1;
        return;
      }
      this.frame_listener = enterframe.player_chaser;
    }
  };
};
