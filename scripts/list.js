var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    $("#schoolName").change(function(){
        var schoolSelected = $("#schoolName").val();
        //changing the name of the header based on the school to make it feel personal 
        $("h1.text-center").html(schoolSelected + " info");
        //adding bills based on the school
        sortedBills.on("child_added", function(snapshot) {
            var bill = snapshot.val();
            if (bill.school == schoolSelected) {
                if (bill.billStatus == "on the docket") {
                    $("#toBeDebated").append("<button>" + bill.billTitle + "</button>");
                    $("#toBeDebated button:last").addClass("btn btn-default");
                } else {
                    $("#passedFailed").append("<button>" + bill.billTitle + "</button>");
                    $("#passedFailed button:last").addClass("btn btn-default");
                };
            };

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
});
