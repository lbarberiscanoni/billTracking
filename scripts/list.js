var fireData = new Firebase("https://yig-bill-tracker2.firebaseio.com");

$(document).ready(function() {
    //create sections based on the schools
    schoolList = ["Riverside", "Southside", "Eastside", "Christ-Church", "Porter-Gaud", "Mauldin", "Blufton"];
    for (var i = 0; i < schoolList.length; i++) {
        $(".container").append("<div>" + "</div>");
        $("div:last").addClass("row");
        $(".row:last").append("<h3>" + schoolList[i] + "</h3>");
        $(".row:last").append("<div>" + "</div>");
        $("div:last").addClass(schoolList[i]);
    };

    fireData.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        snapshot.forEach(function(data) {
            school = data.key()
            billList = new Firebase(fireData + "/" + school);

            billList.orderByValue().on("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    author = data.key();
                    billTitle = data.val().billTitle;

                    //Setting up the container
                    $("div.container").append("<h3>" + school + "</h3>");
                    $("div.container").append("<div>" + "</div>");
                    $("div.container div:last-of-type").addClass(school);

                    //Adding the bill info
                    $("div." + school).append("<p>" + author + ": " + billTitle + "</p>");
                    $("div." + school).append("<button>" + "See Bill" + "</button>");
                    $("button").attr("type", "submit");
                    $("button").addClass("btn btn-default");
                    $("button").attr("id", "seeBill");

                    $("#seeBill").click(function() {
                        var billInfo = ($(this).closest("div").find("p").text());
                        alert(billInfo);
                    });
                });
            });
        });
    });
});

