var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");
var schoolListFromDB = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList");

$(document).ready(function() {
    schoolListFromDB.on("child_added", function(snapshot) {
        var school = snapshot.val();
        var schoolName = school.name;

        $("#schoolName").append("<option>" + schoolName + "</option>");
    });
    
    $("#schoolName").change(function(){
        //first empty everythign to start fresh
        $("#toBeDebated").empty();
        $("#passed").empty();
        $("#failed").empty();
        $("#search-form").empty();
        $("#message").empty(); 

        //changing the name of the header based on the school to make it feel personal 
        var schoolSelected = $("#schoolName").val();
        $("h1").html(schoolSelected + " info");
        
        //Meta-data for bills
        var numberOfBillsToBeDebated = 0;
        var numberOfBillsPassed = 0;
        var numberOfBillsFailed = 0;

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
        var searchForBill = function(a) {
            sortedBills.on("child_added", function(snapshot) {
                var bill = snapshot.val();
                var thisBillID = bill.id;
                if (a == bill.billTitle) {
                    showBill(thisBillID);
                };
            });
        };

        //adding bills based on the school
        sortedBills.on("child_added", function(snapshot) {
            var bill = snapshot.val();
            var billStatus = bill.billStatus.split(" ")[0];
            if (bill.school == schoolSelected) {
                if (billStatus == "on") {
                    $("#toBeDebated").append("<button>Author: " + bill.authorID + "<br>Title: " + bill.billTitle + "<br>Location: " + bill.billLocation + "</button>");
                    var thisBill = $("#toBeDebated button:last").addClass("btn btn-default");
                    thisBill.click(function() {
                        searchForBill(bill.billTitle);
                    });
                    numberOfBillsToBeDebated += 1
                } else if (billStatus == "passed") {
                    $("#passed").append("<button>Author: " + bill.authorID + "<br>Title: " + bill.billTitle + "<br>Location: " + bill.billLocation + "</button>");
                    var thisBill = $("#passed button:last").addClass("btn btn-default");
                    thisBill.click(function() {
                        searchForBill(bill.billTitle);
                    });
                    numberOfBillsPassed += 1;
                } else if (billStatus == "failed") {
                    $("#failed").append("<button>Author: " + bill.authorID + "<br>Title: " + bill.billTitle + "<br>Location: " + bill.billLocation + "</button>");
                    var thisBill = $("#failed button:last").addClass("btn btn-default");
                    thisBill.click(function() {
                        searchForBill(bill.billTitle);
                    });
                    numberOfBillsFailed += 1;
                } else {
                    console.log("neither passed or failed");
                };
            };
            
            //update the bill statistics
            $("div.card:nth-of-type(1) h2").html("YET TO BE DEBATED [" + numberOfBillsToBeDebated + "]");
            $("div.card:nth-of-type(2) h2").html("PASSED [" + numberOfBillsPassed + "]");
            $("div.card:nth-of-type(3) h2").html("FAILED [" + numberOfBillsFailed + "]");

        });
    });
});
