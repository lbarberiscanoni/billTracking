var fireData = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    fireData.orderByValue().on("value", function(snapshot) {
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
                });
            });
        });
    });
});

