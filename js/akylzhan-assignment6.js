
$(document).ready(function () {

    // Task 0 - Setup
    console.log("jQuery is ready!");

    // Task 1, 2, 3 - Search, Autocomplete, Highlighting
    const activities = [
        "Football Club",
        "Basketball Club",
        "Programming Workshop",
        "Music Club",
        "Art Club",
        "Tech Workshop"
    ];

    function escapeHtml(value) {
        return $("<div>").text(value).html();
    }

    function updateSearch(query) {
        const search = query.trim().toLowerCase();
        let matches = 0;

        $(".a6-activity").each(function () {
            const original = $(this).text();
            const position = original.toLowerCase().indexOf(search);

            if (search === "" || position !== -1) {
                $(this).show();
                matches++;

                if (search !== "") {
                    const before = escapeHtml(original.slice(0, position));
                    const found = escapeHtml(
                        original.slice(position, position + search.length)
                    );
                    const after = escapeHtml(
                        original.slice(position + search.length)
                    );

                    $(this).html(
                        before + "<mark>" + found + "</mark>" + after
                    );
                } else {
                    $(this).text(original);
                }
            } else {
                $(this).hide();
            }
        });

        $("#a6-search-status").text(
            matches + " activities found"
        );

        $("#a6-suggestions").empty();

        if (search === "") {
            $("#a6-suggestions").hide();
            return;
        }

        activities
            .filter(function (item) {
                return item.toLowerCase().includes(search);
            })
            .forEach(function (item) {
                $("<button>")
                    .attr("type", "button")
                    .addClass("a6-suggestion")
                    .text(item)
                    .css({
                        display: "block",
                        width: "100%",
                        border: "none",
                        backgroundColor: "transparent"
                    })
                    .on("click", function () {
                        $("#a6-search").val(item);
                        updateSearch(item);
                        $("#a6-suggestions").hide();
                    })
                    .appendTo("#a6-suggestions");
            });

        $("#a6-suggestions").toggle(
            $("#a6-suggestions").children().length > 0
        );
    }

    $("#a6-search").on("input", function () {
        updateSearch($(this).val());
    });

    updateSearch("");

    // Task 4 - Scroll Progress Bar
    function updateProgress() {
        const scrollTop = $(window).scrollTop();
        const maxScroll =
            $(document).height() - $(window).height();

        const percentage = maxScroll > 0
            ? (scrollTop / maxScroll) * 100
            : 0;

        $("#a6-scroll-progress").css(
            "width",
            Math.min(100, percentage) + "%"
        );
    }

    $(window).on("scroll resize", updateProgress);
    updateProgress();

    // Task 5 - Animated Number Counter
    let counterStarted = false;

    function startCounters() {
        if (counterStarted) return;

        const stats = $(".a6-stats");
        if (!stats.length) return;

        const visibleBottom =
            $(window).scrollTop() + $(window).height();

        if (visibleBottom >= stats.offset().top) {
            counterStarted = true;

            $(".a6-counter").each(function () {
                const element = $(this);
                const target = Number(element.data("target"));

                $({ count: 0 }).animate(
                    { count: target },
                    {
                        duration: 1600,
                        easing: "swing",
                        step: function (value) {
                            element.text(Math.floor(value));
                        },
                        complete: function () {
                            element.text(target);
                        }
                    }
                );
            });
        }
    }

    $(window).on("scroll resize", startCounters);
    startCounters();

    // Task 7 - Notification System
    function showToast(message) {
        $("#a6-toast")
            .stop(true, true)
            .text(message)
            .fadeIn(200)
            .delay(2200)
            .fadeOut(500);
    }

    // Task 6 - Loading Spinner on Submit
    // Uses the existing Assignment 5 registration button
    $("#event-register").on("click.a6", function (event) {
        const name = $("#event-name").val().trim();
        const selectedEvent = $("#event-choice").val();

        if (!name || !selectedEvent) {
            return;
        }

        // Prevent the old Assignment 5 click handler
        // from immediately displaying success.
        event.stopImmediatePropagation();

        const button = $(this);

        button.prop("disabled", true);
        $("#a6-register-text").text("Please wait...");
        $("#a6-register-spinner").removeClass("d-none");

        setTimeout(function () {
            $("#event-result").text(
                name + ", you registered for " +
                selectedEvent + "!"
            );

            button.prop("disabled", false);
            $("#a6-register-text").text("Register");
            $("#a6-register-spinner").addClass("d-none");

            showToast("Registration successful!");
        }, 1500);
    });

    // Task 8 - Copy to Clipboard
    $("#a6-copy-btn").on("click", async function () {
        const text = $("#a6-copy-text").val();

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const input = $("#a6-copy-text")[0];
                input.focus();
                input.select();

                if (!document.execCommand("copy")) {
                    throw new Error("Copy failed");
                }
            }

            $("#a6-copy-btn").text("✓ Copied!");
            $("#a6-copy-status").text("Copied to clipboard!");
            showToast("Link copied successfully!");

            setTimeout(function () {
                $("#a6-copy-btn").text("Copy");
            }, 2000);

        } catch (error) {
            $("#a6-copy-status").text(
                "Copy failed. Please copy the link manually."
            );
        }
    });

    // Task 9 - Image Lazy Loading
    // Apply to the existing campus gallery images
    const images = $(".campus-gallery img");

    images.each(function () {
        const image = $(this);
        const source = image.attr("src");

        image.attr("data-src", source);
        image.removeAttr("src");
        image.addClass("a6-lazy");
    });

    function loadVisibleImages() {
        const bottom =
            $(window).scrollTop() + $(window).height() + 200;

        $(".a6-lazy").each(function () {
            const image = $(this);

            if (image.offset().top <= bottom) {
                image.attr("src", image.attr("data-src"));

                image.one("load", function () {
                    image.addClass("a6-loaded");
                });

                if (this.complete && this.naturalWidth > 0) {
                    image.addClass("a6-loaded");
                }

                image.removeClass("a6-lazy");
            }
        });
    }

    $(window).on("scroll resize", loadVisibleImages);
    loadVisibleImages();

});
