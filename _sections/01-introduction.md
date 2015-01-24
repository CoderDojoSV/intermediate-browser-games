---
title: Introduction to Browser Games
layout: item
---

## Techniques Used

In order to make our games, we're going to be using a number of different
programming techniques at different times. We're going to spend a few moments
discussing each technique so you'll recognize them when we need to use them
later. Keep a look out :eyeglasses:!

## Boilierplate

In most programming environments, there's a few things that every program needs
in order to do basic setup. This code that every program needs is often called
"boilerplate". For enchant.js, the library we're using, we need some web
boilerplate, as well as some javascript function calls and callbacks defined to
use the library. We have a basic project skeleton, a project with nothing but
boilerplate, ready for you to use today.

The `index.html` file contains boilerplate for loading enchant's source and
the main game file as well as linking to the source and outline files.

In the `main.js` file, we have to start off by initializing enchant by calling a
function: `enchant();` then we use browser events to make sure our game is only
run once the page finishes loading.

Once we've set up all the programming for our game we wrap up with
`game.start();`.

## Object-Oriented Programming

Object-oriented programming is a style of writing programs that organizes your
code into objects that people can easily understand. When applied well, it also
helps keep specific parts of your code from referencing other details about how
your code works. This makes it easier to change some parts of your program
without changing all of it.

Enchant uses an object oriented style internally that we interact with. Our
code mixes object-oriented and procedural programming styles.

In our game, we have the game itself, which is one object
~~~
var game = new Core(480, 480);
~~~

We can interact with our game object using its variable name, `game`. We'll also
create new `Sprite()` objects. Enchant.js other object types, `Map`s and
`Scene`s can be used to create more complex games. You can learn about them at
the end of the lab.

Once you have an object, you interact with it by sending messages. Sending a
message looks a lot like calling a function in Javascript, but when sending
messages, there's always an argument called `this` that represents the message
recipient.

`game.preload()` and `rootScene.addChild()` are both examples of messages
sent to the `game` and `rootScene` objects.

Event handlers in Javascript are also sent to objects as messages, but since
we don't ever send them ourselves, we never see it. We do get to use `this` to
refer to whichever object is receiving the message though. Functions that tell
an object what to do when a message is received are called methods.

~~~
if (game.input.up && this.y - speed >= 0) {
  this.y -= speed;
  this.frame = this.age % 2 + characters.player_runner;
}
~~~

The value of `this` will be different for each of the bears the message is sent
to. Otherwise we'd have to use some other method to know which bear we were
talking to.

## Procedural Programming

Procedural programming is another style of organizing a program. In
procedural programming you put statements that affect the game program one
after another. This makes it easy to see what is going on since you can start
at the top and end at the bottom and see exactly what happened step by
step. However, when your program gets bigger and more complicated, the
procedural style starts to get more confusing and it might be helpful to break
the program up using another programming style.

Individual functions and methods in our games will be written using a
procedural style.

~~~
// Tag them if we got them!
if (this.tagged) {
  this.tagged.frame_handler = enterframe.tagged;
  this.tagged.tag_timer = 20;
  this.tagged = undefined;
  this.frame_handler = enterframe.player_runner;
  return;
}
~~~

In the above block of code, we set up the fact that we tagged another
runner in several steps, ending with an early return (see below).

## Event-driven Programming

Event-driven programming is a very popular style for games programming since
the programming environment figures out how to check for specific cases and
all you have to do is tell it how to react. When using event driven
programming you assign event *listeners* to be called when certain events
occur. In a web site, you might define a "click" event handler which runs
whenever a specific button on your web site is clicked. It would be very
difficult for you to constantly check whether or not the mouse button was
clicked, and if it was clicked, check what was clicked on. But using an event
system like the one in your web browser, we can do so very simply since the
underlying system is performing that check for the mouse and notifies us if
the event we care about occurs.

This is a function designed to be used as an event handler.
~~~
var tagged = function() {
  this.frame = characters.tagged;
  if (this.tag_timer > 0) {
    this.tag_timer -= 1;
    return;
  }
  this.frame_handler = enterframe.chaser;
}

runner.addEventListener("enterframe",tagged);
~~~

The last line we add the function we wrote to be run as an eventListener
whenever the `runner` object receives the `enterframe` event, which we know
it will get once every frame.

## Frame-by-frame processing

In games written for the early Nintendo and Atari, you had to make sure your
code ran fast enough that it could draw to the screen each time the screen
refreshed. Modern computers are so fast though, that many games have an opposite
problem, if you let them run, they'll process things too quickly for a person to
keep up. So instead of having code that loops, we tell enchant what framerate to
run our game at, and at the start of each frame enchant sends the `enterframe`
event, which we can use to tell objects what to do during that frame. Using this
technique we can easily separate how each runner and chaser behaves while
avoiding a big procedural mess.

This code let's a runner run all the way across the screen moving by 1
coordinate per frame.

If the screen is 480 pixels across and the game runs at 15 frames per second,
how long with the runner take to go across?

<div class="mentor">
480 pixels / ((1 pixel / frame ) * 15 frames / second)  
= 480 pixels / 15 pixels / second
= 32 seconds
</div>

~~~
runner.addEventListener("enterframe", function() {
  this.x = this.x + 1;
});
~~~

## Coordinate grid graphics

Many 2D games feature coordinate grids. If you've had a geometry class, you
might have used coordinate geometry before. On paper, you usually pick a point
for (0, 0) in the middle of the graph. But on computers, (0, 0) is usually
the top left corner, which is where it is in enchant.js.

To move things to the right, you increase the *x* coordinate, to move them left,
you decrease it.

To move things down you increase the *y* coordinate, to move them up you
decrease it.

In enchant, objects are not automatically kept inside the screen
boundaries. So it's possible for objects to have negative coordinates, or
coordinates larger than the size of the screen.

## Collision detection

In many games, we want to know if two objects on the screen are touching. This
is called detecting collisions, and it is so common that enchant actually has
two different methods of collision detection for you to choose based on your
needs. The first kind of collision detection uses the
`object.intersect(object2)` method. This checks if the bounding
coordinates of both objects to see if they intersect. It's the most
straightforward way to check but relies on your object's visible shape to mostly
fill the rectangular sprite size otherwise it will register a collision
without visible touching.

The second method involves computing the distance between the centers of two
objects. Which works better for objects that are roughly circular or when you
want to know if objects are "near" rather than touching.

`object.within(object2, 32)` will tell you if the center-to-center distance of
`object` and `object2` is less than or equal to 32.

## Sprite sheets 

A sprite sheet is a bunch of related images you want to use for your game all in
a single image file. They're used to help organize the amount of work you have
to do to load files for the game. While sprite sheets can support sprites of
different sizes, they're easiest to use when every image has the same
rectangular dimensions.

Preloading a sprite sheet and using it for an on-screen sprite.

~~~
game.preload("chara1.png");
runner.image = game.assets["chara1.png"];
runner.frame = 10;
~~~

## Early return

In procedural languages, it's possible to put `return` statements before the
end of a code block. Doing so will prevent the code that follows from
running. For this reason, it's usually only done inside a conditional
statement as an alternative to a large if-else block. Whether or not you use
if-else or if with an early return is up to you. We use them in the tag game
when the chaser tags another runner so they don't also run into the runner.

The following statements are equivalent

~~~
if (runner.was_tagged) {
  runner.frame_listener = listeners.tagged;
} else {
  runner.run();
}
~~~

~~~
if (runner.was_tagged) {
  runner.frame_listener = listeners.tagged;
  return;
}

runner.run();
~~~
