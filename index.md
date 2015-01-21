---
layout: default
---

<div class="home">

  <h1 class="page-heading">Sections</h1>

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
</div>
