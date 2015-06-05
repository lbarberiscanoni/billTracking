var fireData = new Firebase("https://booking-example.firebaseio.com")

$(document).ready(function() {
    $("#find").click(function() {
        var property = $("#property").val();
        var name = $("#guestName").val();
        var lastName = $("#guestLastName").val();
        var guest = name + "-" + lastName;
        var guestData = new Firebase(fireData + "/" + property + "/" + guest)
        guestData.orderByValue().on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                guestInfo = data.key() + ": " + data.val();
                $("body").append("<p>" + guestInfo + "</p>");
            });
        });
    });
});


