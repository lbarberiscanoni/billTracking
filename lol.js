var listOfBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    listOfBills.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        var billDivision = bill.division;
        $("body").append("<button class='btn btn-default' id='bill'>" + snapshot.key() + "</button>");
        //if it's Premier
        if (billDivision.indexOf("Premier") > -1) {
            $("button:last").css("background-color", "blue");
        //if not premier
        } else if (billDivision.indexOf("Premier") == -1) {
            $("button:last").css("background-color", "green");
        //error
        } else {
            $("button:last").css("background-color", "red");
        };

        $("button#bill:last").click(function() {
            var thisBillID = $(this).text();
            var thisBillColor = $(this).css("background-color");
            var green = "rgb(0, 128, 0)"
            var blue = "rgb(0, 0, 255)"
            if ($(this).css("background-color") == blue) {
                listOfBills.child(thisBillID).update({
                    division: "Premier",
                });
            } else if ($(this).css("background-color") == green) {
                listOfBills.child(thisBillID).update({
                    division: "Upper",
                });
            };
        });
    });
});
