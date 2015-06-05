var fireData = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    fireData.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            school = data.key()
            $("body").append("<h3>" + school + "</h3>");

            billList = new Firebase(fireData + "/" + school);
            billList.orderByValue().on("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    author = data.key();
                    billTitle = data.val().billTitle;
                    $("body").append("<p>" + author + ": " + billTitle + "</p>");
                });
            });
        });
    });
});

