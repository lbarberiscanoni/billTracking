var billList = new Firebase("https://yig-bill-tracker.firebaseio.com");
var sortedBills = new Firebase("https://yig-bill-tracker2.firebaseio.com");
var chamberDockets = new Firebase("https://yig-bill-tracker3.firebaseio.com");

billList.on("value", function(snapshot) {
    sortedBills.update(snapshot.val());
});

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

    //adding bills based on the school
    sortedBills.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        $("div." + bill.school).append("<button>" + bill.billTitle + "</button>");
        $("button:last").addClass("btn btn-default " + bill.id);

        //show bill when button is clicked
        var showBill = function(a) {
            billInfo = new Firebase(sortedBills + "/" + a);
            billInfo.on("value", function(snapshot) {
                //variables to build the html file
                var jquery1 = "<script src=" + "//code.jquery.com/jquery-1.11.3.min.js" + "></script>";
                var jquery2 = "<script src=" + "//code.jquery.com/jquery-migrate-1.2.1.min.js" + "></script>";
                var firebase = "<script src=" + "https://cdn.firebase.com/js/client/2.2.6/firebase.js" + "></script>";
                var bootstrap = "<link rel=" + "stylesheet" + "," + " href=" + "stylesheets/bootstrap/bootstrap.min.css" + ">";
                var bill = snapshot.val();
                var page = window.open();
                page.document.write(
                    "<!DOCTYPE html><html><head>" + 
                    jquery1 + jquery2 + firebase + bootstrap + 
                    "</head><body>" +
                    "<div class=" + "container" + ">" + 
                    "<h1 class=" + "text-center" + ">" + bill.billTitle + "</h1>" +
                    "<br>" +
                    "<h3 class=" + "text-center" + ">" + "BE IT HEREBY ENACTED BY THE YMCA MODEL LEGISLATURE OF SOUTH CAROLINA" + "</h3>" +
                    "<div class=" + "row" + ">" +
                    "<h4>" + "Section 1" + "</h4>" + 
                    "<p>" + bill.section1 + "</p></div>" +
                    "<div class=" + "row" + ">" +
                    "<h4>" + "Section 2" + "</h4>" + 
                    "<p>" + bill.section2 + "</p></div>" +
                    "<div class=" + "row" + ">" +
                    "<h4>" + "Section 3" + "</h4>" + 
                    "<p>" + bill.section3 + "</p></div>" +
                    "<div class=" + "row" + ">" +
                    "<h4>" + "Section 4" + "</h4>" + 
                    "<p>" + bill.section4 + "</p></div>" +
                    "<div class=" + "row" + ">" +
                    "<h4>" + "Section 5" + "</h4>" + 
                    "<p>" + "When signed into law, the bill will first take place on " + bill.section5 + "</p></div>" +
                    "</div></body></html>"
                );
            });
        };

        //open bill when clicking on button
        $("button").click(function() {
            sortedBills.on("child_added", function(snapshot) {
                var bill = snapshot.val();
                var thisBillID = bill.id;
                showBill(thisBillID);
            });
        });
    });
});
