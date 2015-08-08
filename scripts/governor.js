var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    //getting the chamber the user is looking at 
    //var chamberName = $(this).text().replace(/\s/g, "-").replace("BACK", "").split("Tracker")[1];
    //var chamberName = $(this).text().replace("BACK", "").split("Tracker")[1];
    var chamberName = "Governor Desk";
    console.log(chamberName);

    sortedBills.on("child_added", function(snapshot) {
        //running through all the bills to find their location
        var bill = snapshot.val();

        var toSignStatus = "To Be Signed by the Governor"; 
        var signedStatus = "Signed By the Governor";
        var vetoedStatus = "Vetoed by the Governor";
       
        if (bill.billLocation == chamberName) {
            $("#realTime").append("<button>" + bill.billTitle + "</button><br>");
            $("button:last").addClass("btn btn-default ").attr("id", "bill"); 

            $("button#bill:last").click(function() {
                $(this).addClass("form-inline");
                $("<button>" + "Sign into Law" + "</button>").insertAfter($(this)).addClass("btn btn-success");
                $("<button>" + "Veto" + "</button>").insertAfter("button.btn-success").addClass("btn btn-danger");
                $("<button>" + "Read" + "</button>").insertAfter("button.btn-danger").addClass("btn btn-default").attr("id", "read");

                //show bill when button is clicked
                $("button#read:last").click(function() {
                    //var billClicked = $("#bill").text();
                    var billClicked = $(".form-inline").text();
                    sortedBills.on("child_added", function(snapshot) {
                        var bill = snapshot.val();
                        var thisBillID = bill.id;
                        if (billClicked == bill.billTitle) {
                            showBill(thisBillID);
                        };
                    });

                    window.location.reload();
                });

                //open up a tab and show the bill
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

                //after making buttons changing the bill status based on which button was clicked
                $("button.btn-success").click(function() {
                    var thisBillID = bill.id;
                    sortedBills.child(thisBillID).update({
                        "billStatus": toSignStatus,
                        "billLocation": "passed legislation", 
                    });

                    $(this).next().hide();
                    $(this).hide();

                    window.location.reload();
                });

                $("button.btn-danger").click(function() {
                    var thisBillID = bill.id;
                    sortedBills.child(thisBillID).update({
                        "billStatus": vetoedStatus,
                        "billLocation": "vetoed legislation",
                    });

                    $(this).prev().hide();
                    $(this).hide();

                    window.location.reload();
                });
            });
        } else {
            if (bill.billStatus == toSignStatus) {
                $("#toSign").append("<button>" + bill.billTitle + "</button><br>");
                $("#toSign button:last").addClass("btn btn-default").attr("id", "sign");
                $("button#sign:last").click(function() {
                    $(this).addClass("form-inline");
                    $("<button>" + "Signed" + "</button>").insertAfter($(this)).addClass("btn btn-success");
                    $("button.btn-success").click(function() {
                        var thisBillID = bill.id;
                        sortedBills.child(thisBillID).update({
                            "billStatus": signedStatus,
                        });

                        window.location.reload();
                    });
                });
            } else if (bill.billStatus == signedStatus) {
                $("#signed").append("<button>" + bill.billTitle + "</button><br>");
                $("#signed button:last").addClass("btn btn-default disabled");
            } else if (bill.billStatus == vetoedStatus) {
                $("#vetoed").append("<button>" + bill.billTitle + "</button><br>");
                $("#vetoed button:last").addClass("btn btn-default disabled");
            } else {
                return false
            };
        };
    });
});

