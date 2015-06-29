var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com");

//I took this off bc it kept overidding the new change made by the bill sorting form
//billList.on("value", function(snapshot) {
//    sortedBills.update(snapshot.val());
//});

$(document).ready(function() {
    //create sections based on the schools
    schoolList = ["Riverside", "Southside", "Eastside", "Christ-Church", "Porter-Gaud", "Mauldin", "Blufton", "JL-Mann"];
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
        $("div." + bill.school).append("<div class=" + bill.billTitle + "></div>");
        $("div." + bill.billTitle).append("<button>" + bill.billTitle + "</button>");
        $("div." + bill.billTitle + " button").addClass("btn btn-default " + bill.billTitle);

        //show bill when button is clicked
        var showBill = function(a) {
            billInfo = new Firebase(sortedBills + "/" + a);
            billInfo.on("value", function(snapshot) {
                //variables to build the html file
                var jquery1 = "<script src=" + "//code.jquery.com/jquery-1.11.3.min.js" + "></script>";
                var jquery2 = "<script src=" + "//code.jquery.com/jquery-migrate-1.2.1.min.js" + "></script>";
                var firebase = "<script src=" + "https://cdn.firebase.com/js/client/2.2.6/firebase.js" + "></script>";
                var bootstrap = "<link rel=" + "stylesheet" + " , href=" + "stylesheets/bootstrap/bootstrap.min.css" + ">";
                var bill = snapshot.val();
                var page = window.open();
                page.document.write(
                    "<!DOCTYPE html><html><head>" + 
                    jquery1 + jquery2 + firebase + bootstrap + 
                    "</head><body>" +
                    "<div class=" + "container" + ">" + 
                    "<h1 class=" + "text-center" + ">" + bill.billTitle + "</h1>" +
                    "<h3 class=" + "text-center" + ">" + "BE IT HEREBY ENACTED BY THE YMCA MODEL LEGISLATURE OF SOUTH CAROLINA" + "</h3>" +
                    "<div class=" + "container" + ">" +
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
                    "</div></div></body></html>"
                );
            });
        };

        //open bill when clicking on button
        $("button." + bill.billTitle).click(function() {
            var billClicked = $(this).text();
            sortedBills.on("child_added", function(snapshot) {
                var bill = snapshot.val();
                var thisBillID = bill.id;
                if (billClicked == bill.billTitle) {
                    alert("This bill is " + bill.billStatus + " and is now in " + bill.billLocation);
                    showBill(thisBillID);
                };
            });
        });
    });
});
