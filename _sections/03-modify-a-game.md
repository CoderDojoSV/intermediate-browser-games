---
title: Modifying an existing game
layout: item
---

# Reading a game program

In the introduction we went over a bunch of techniques.
Now we're going to try and *identify* some of those techniques in a game that has already been written.

When reading code, pay attention to comments left by the author.
 These are often helpful in figuring out what the subsequent part of the program does.
The best programs have comments that explain *why* something works as well as how.

Open up [the game of tag]({{ site.baseurl}}/games/tag) in a new tab and play
around a bit. Move around with the arrow keys and try to avoid being tagged!

On the page below the game, you'll see three links. One is a link to the
outline that I wrote when I first thought of making a tag game. We're going to
practice outlines a little later, so you can take a look at it now if you want,
but we're going to come back to it later.

There's also two different links to the source code. For now, let's open the
version marked "annotated source code". Annotated means that I added some
extra detailed notes in the comments. Look through the annotated source and
try to find some examples of the following techniques and tell whether they're
event driven, procedural, object-oriented, or a mix.

* Sending a method
* An event-handling function
* Change of event handling function
* Two or more lines that accomplish one goal
* An "early return"
* A frame handling function
* Use of collision detection
* The first loading of a sprite sheet
* Changing an object's sprite frame.

# Grab your own copy of the game

Use the link below to download a copy of the tag game's source code.  
[Source archive of the game of tag](TODO)

If you're using a Chromebook, you can open [the game of tag on 9leap](TODO) and
fork it.

# Make some changes

On line TODO, change the number to something really high like 999. Then make
it something really small like 4. Experiment with different values to see what
changing that number does.

Find some other number in the source code and change it to a very large or very
small value. By changing values experimentally, you can not only figure out what
the number does, but how the changes to that number affect how fun the game is.

## Make the runners run at different speeds.

Now try making all the runners run at different speeds. Find where the
runners are created, then look around to see how they handle frame events.
Once you've done so, you should be able to keep following the code until
you've found where their speed is set.

<div class="mentor">
The `eachframe.runner` function sets the direction using the
`helper.randomdirection`function.
</div>

## Make the runners run away from the chaser

Right now, the running bears besides the player and the chaser just run
around randomly. Some of them will even run right into the chaser! Try making
them run in the opposite direction from the chaser.

***HINT***: The chaser runs *toward* a specific bear at any given time. See if
you can follow that logic to make the runners run *away* from the chaser.

<div class="mentor">
In order to do this, they'll need to be able to identify the current chaser (or
player chaser) from any individual runner. It might be easiest to do this by
setting `game.chaser` in the chaser's frame handler.

To invert the logic, copy the block of comparisons and where the chaser would
add a step, subtract a step. So this

~~~
if (this.chasing.x > this.x) {
  this.x += 3;
} else if (this.chasing.x < this.x) {
  this.x -= 3;
}
~~~

becomes

~~~
if (this.x > chaser.x) {
  this.x -= 3;
} else if (this.x < chaser.x) {
  this.x += 3;
}
~~~
</div>

### Analyze the result

Did you get the last section working? If so, you probably noticed that all the
runners run flat out to the edge of the screen. This makes the game not very
interesting. Every time you make a change, test out your game. Is it more fun
or less fun? Sometimes making your computer players more logical makes it
more fun, but it can also make it less fun by making them too predictable.

## Make the runners go wild until the chaser gets close

In the last part, you made the runners run straight away from the chaser, but
it took some of the charm out of the game. Let's go back to letting the bears
run randomly, but we'll have them start running away whenever the chaser
gets too close to them. To do this, we'll have to take the code you started
with, and the code you just wrote, and put them together.

If we were outlining this code from scratch, we might have an outline entry
like:

~~~
If the chaser is close, run away from the chaser otherwise keep running in the
current direction
~~~

So we know that we'll need to use an `if` statement. But how do we determine
whether or not two bears are "close", what does "close" mean. Determining
"proximity" or distance, is just another kind of collision detection. You can
either use the enchant library function
`runner.within(chaser, 128)`
Which tells you whether or not the center of `runner` is more or less than
`128` pixels away from the center of `chaser`. Or you can use the
`helper.distance(runner.x, runner.y, chaser.x, chaser.y)` helper function that
tells you the geometric distance between two points on the field.

Either way will work. Pick whichever makes more sense to you.

## Make the chaser much faster than the runners

After playing a while, you might decide that it's too easy now that the runners
know to avoid the chaser. Maybe we need to give the chaser a little speed boost.
Found out how fast the chaser runs and make it a little faster, experiment
to see where it's the most fun.

## Make the runners unable to walk through each other.

The game is coming together, but it still looks a bit silly when the bears walk
through each other. It would take a bit of work to make sure that no bears
walk into each other, but I'm pretty confident that you can do it! Find some
examples of collision detection you've already seen to adapt them to this
use.

