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
        $("div." + bill.school).append("<div class=" + "bill" + "></div>");
        $("div.bill:last").append("<h4>" + bill.billTitle + "</h4> <p> by [" + bill.authorID + "]</p>");
        $("div.bill:last").addClass("btn btn-default");
    });
});

