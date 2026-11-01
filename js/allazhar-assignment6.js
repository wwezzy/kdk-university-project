// Assignment 6 - Kuat Allazhar: Home and About, Tasks 7-9.
$(document).ready(function () {
  // Task 0: confirm that jQuery and the DOM are ready.
  console.log("jQuery is ready!");

  // Task 7: reuse one notification for different user actions.
  function showNotification(message) {
    $("#a6Toast")
      .stop(true, true)
      .text(message)
      .fadeIn(300)
      .delay(4000)
      .fadeOut(1000);
  }

  $("#a6ShowTip").on("click", function () {
    showNotification("Tip: use the visit planner to prepare your campus tour.");
  });

  // Task 8: show success feedback after the Clipboard API resolves.
  $("#a6CopyLink").on("click", function () {
    const link = $("#a6ShareUrl").val();

    navigator.clipboard.writeText(link)
      .then(function () {
        showNotification("Link copied!");
        $("#a6CopyIcon").text("✓");
        $("#a6CopyTooltip")
          .stop(true, true)
          .fadeIn(200)
          .delay(2000)
          .fadeOut(200);
      })
      .catch(function () {
        showNotification("Copy failed. Please copy the link manually.");
      });
  });

  // Task 9: check whether each pending image intersects the viewport.
  function loadVisibleImages() {
    const viewportTop = $(window).scrollTop();
    const viewportBottom = viewportTop + $(window).height();

    $(".a6-allazhar-lazy").each(function () {
      const image = $(this);
      const imageTop = image.offset().top;
      const imageBottom = imageTop + image.outerHeight();

      if (imageTop < viewportBottom && imageBottom > viewportTop) {
        const source = image.attr("data-src");
        image.attr("src", source);
        image.removeClass("a6-allazhar-lazy");
      }
    });
  }

  $(window).on("scroll resize", loadVisibleImages);
  loadVisibleImages();
});
