// Initialize enchant.js
enchant();

// window.onload executes when the static page is finished loading.
window.onload = function(){
  // Create a game variable using Enchant.
  var game = new Core(800, 640);

  // Set the game's framerate to 15 frames per second.
  game.fps = 15;

  // We use an image file called chara1.png for this game.
  // By preloading it we make sure it's available as a sprite asset and
  // loaded before the game starts.
  game.preload("images/chara1.png");

  // event callback for the game's first load.
  game.onload = function(){
    // Set a background color so the player can see the game borders.
    // You can use any CSS color.
    game.rootScene.backgroundColor = "#22cc66";

  };

  // Log to the console that we at least got to the start of the game! \o/
  console.log("Game is starting!");
  game.start();
};
