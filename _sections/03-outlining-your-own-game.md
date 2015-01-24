---
title: Outlining your own game
layout: item
---

You may have written an outline for a speech, project, or paper before. Outlines
are structured documents that help you organize a project, such as a game.
They are very useful for writing all types of programs, but especially games
because they force you to think about the entire game before writing any code at
all. 

When outlining our game we're going to answer the following questions:

* What we need to do to start the game?
* What happens during each frame of the game?
* What special events do we need to be aware of?
* How does the game end?

## Your first game

A good first game, when learning any new environment or language, is Pong.
<img src="http://upload.wikimedia.org/wikipedia/commons/f/f8/Pong.png"
width="400">

Pong is a ping pong game. It has one ball, and two paddles.

In the game, the ball moves across the screen until it hits one of the
paddles or an edge. If it hits an edge, the game restarts. If it hits a
paddle, then the ball bounces back to the other paddle.

Open the `outline.txt` file in your text editor. You can use the structure
that's already there or remove it and create your own. Using the outline, answer
the following questions

## What we need to do to start the game?

We know we'll need some boilerplate to start the game off, but we'll also need
to load any sprite sheets we're going to use and create sprites and
listeners. What sprite sheets, sprites, and listeners will we need to
create?

## What happens during each frame of the game?

The ball has to travel, and the two paddles have to move. One paddle should
be controlled by the user, another should be computer controlled. Start
thinking about how the computer paddle should behave.

## What special events do we need to be aware of?

Given the game we described, what events do we need to handle?

## How does the game end?

When the game stops, what do we need to do to set up for another round?


# Completing your outline

When you've answered all the questions above, think about how you'll write
the code for this game, but don't do it yet. Ask yourself questions and fill
in details. The more specific your outline is the easier it will be to write
your program. When you're happy with it, check with a mentor. They might ask
some extra questions and you can add the answers to your outline.

Once your outline is ready, you can go on to the next section to implement
your game!

[Next section]({{site.baseurl}}/04-implement-your-game.html)
