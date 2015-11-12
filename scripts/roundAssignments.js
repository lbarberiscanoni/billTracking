$(document).ready(function() {
    $(".row #trial").toggle();
    $("button").click(function() {
        $(".row #trial").hide();
        $(this).next("#trial").toggle();
    });
});
