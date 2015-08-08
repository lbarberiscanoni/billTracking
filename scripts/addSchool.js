var listOfSchools = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList");

$(document).ready(function() {
    listOfSchools.on("child_added", function(snapshot) {
        var school = snapshot.val();
        $("#currentSchools").append("<div class='row'>" + "</div>");
        $(".row:last").append("<h2>" + school.name + "</h2>");
    });

    $("#submit").click(function() {
        var newSchool = $("#newSchool").val();
        listOfSchools.push({
            "name": newSchool,
        });

        window.location.reload();
    });
});
