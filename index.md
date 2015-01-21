---
layout: default
---


*A lab-driven intermediate workshop for creating browser games.*

It's hard to share games with your friends if you have a Game Boy and they're using an iPad but almost everyone has access to a web browser. Following this lab either at a Coder Dojo or at home will show you how to analyze and modify 2D games as well as plan and write your own simple 2D games that run in a web browser. It should take about three hours to complete.

## At the end

* You will be able read and follow 2D games written in an object oriented style.
* You will be able to outline a program for implementing specific game mechanics.
* You will be able to create 2D single screen games from an empty file.

## Before getting started

* You should be able to type effectively.
* You should be able to read silently and work independently and in small groups.
* You should be able to write and demonstrate understanding of loops in one or more programming languages.
* You should be able write and demonstrate understanding of conditional (if-then) statements in one or more programming languages.

## You'll need a laptop or other portable computer with: 
* wireless internet
* a physical keyboard
* a mouse or pointing device
* a web browser

## Course Outline

* Setup (45 minutes)
* Introduction (15 minutes)
* Modify a game (45 minutes)
* Create a game outline (30 minutes)
* Implement a new game using the outline (45 minutes)

# Sections

<ul class="item-list">
  {% for section in site.sections %}
    <li>
      <span class="item-meta">{{ section.date | date: "%b %-d, %Y" }}</span>

      <h2>
        <a class="item-link" href="{{ section.url | prepend: site.baseurl }}">{{ section.title }}</a>
      </h2>
    </li>
  {% endfor %}
</ul>
