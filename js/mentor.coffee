---
---

$(document).ready(->
  if (window.location.href.search(/mentor/) isnt -1)
    console.log "Showing mentor content"
    # $(".mentor").css("display: block;")
    $(".mentor").show()
)
