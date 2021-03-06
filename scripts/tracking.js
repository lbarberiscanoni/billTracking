var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    //find the bilsl taht are relate dot the chamber the user is looking at
    var displayBillsInThisChamber = function() {
        console.log(chamberName);
        sortedBills.on("child_added", function(snapshot) {
            //running through all the bills to find their location
            var bill = snapshot.val();

            var passStatus = "passed "; 
            passStatus += chamberName;
            var failedStatus = "failed in " 
            failedStatus += chamberName;

            if (bill.billLocation == chamberName) {
                if (bill.billStatus != failedStatus) {
                    if (bill.rocketDocketStatus == "yes") {
                        $("div.billList").append("<button class='btn btn-default' id='bill'>" + bill.billTitle + ' {Rocket Docket}' + "</button><br>");
                    } else if (bill.rocketDocketStatus == "no") {
                        $("div.billList").append("<button class='btn btn-default' id='bill'>" + bill.billTitle + "</button><br>");
                    };

                    $("button#bill:last").click(function() {
                        //remove duplicates
                        $(this).removeClass("form-inline");
                        $(".btn-success").remove();
                        $(".btn-danger").remove();
                        $("#read").remove();
                        
                        //add buttons to pass/fail/read the bill
                        $(this).addClass("form-inline");
                        $("<button class='btn btn-success'>" + "Passed" + "</button>").insertAfter($(this));
                        $("<button class='btn btn-danger'>" + "Failed" + "</button>").insertAfter("button.btn-success");
                        $("<button class='btn btn-default' id='read'>" + "Read" + "</button>").insertAfter("button.btn-danger");

                        //let's take care of the rocket docket situation as well
                        var listOfCommittees = ["Criminal Justice", "Education", "Environmental", "General Issues", "Healthcare and Human Services", "Transportation"];
                        if (listOfCommittees.indexOf(bill.billLocation) >= 0 && bill.rocketDocketStatus == "no") {
                            $("<button class='btn btn-default' id='rocketDocket'>" + "Rocket Docket" + "</button>").insertAfter("button#read");
                            $("#rocketDocket").click(function() {
                                sortedBills.child(bill.id).update({
                                    "rocketDocketStatus": "yes",
                                });

                                window.location.reload();
                            });
                        };

                        //after making buttons changing the bill status based on which button was clicked
                        $("button.btn-success").click(function() {
                            var thisBillID = bill.id;
                            sortedBills.child(thisBillID).update({
                                "billStatus": passStatus,
                            });

                            if (bill.billLocation == "Premier House") {
                                sortedBills.child(thisBillID).update({
                                    billLocation: "Premier Senate",
                                });
                            } else if (bill.billLocation == "House") {
                                sortedBills.child(thisBillID).update({
                                    billLocation: "Senate",
                                });
                            } else if (bill.billLocation == "Senate" || bill.billLocation == "Premier Senate") {
                                sortedBills.child(thisBillID).update({
                                    billLocation: "Governor Desk",
                                });
                            } else {
                                if (bill.division == "Premier") {
                                    sortedBills.child(thisBillID).update({
                                        billLocation: "Premier House",
                                    });
                                } else if (bill.division == "Upper") {
                                    sortedBills.child(thisBillID).update({
                                        billLocation: "House",
                                    });
                                } else {
                                    alert("problem with bill location");
                                };
                            };

                            $(this).next().hide();
                            $(this).hide();

                            window.location.reload();
                        });

                        $("button.btn-danger").click(function() {
                            var thisBillID = bill.id;
                            sortedBills.child(thisBillID).update({
                                "billStatus": failedStatus,
                            });

                            $(this).prev().hide();
                            $(this).hide();

                            window.location.reload();
                        });
                        
                        //show bill when button is clicked
                        $("button#read").click(function() {
                            
                            //open up a tab and show the bill
                            var showBill = function(a) {
                                billInfo = new Firebase(sortedBills + "/" + a);
                                billInfo.on("value", function(snapshot) {
                                    //variables to build the html file
                                    var jquery1 = "<script src=" + "//code.jquery.com/jquery-1.11.3.min.js" + "></script>";
                                    var jquery2 = "<script src=" + "//code.jquery.com/jquery-migrate-1.2.1.min.js" + "></script>";
                                    var firebase = "<script src=" + "https://cdn.firebase.com/js/client/2.2.6/firebase.js" + "></script>";
                                    var bootstrap = "<link rel=" + "stylesheet" + " , href=" + "../../../stylesheets/bootstrap/bootstrap.min.css" + ">";
                                    var seeBill = "<script src='../../../scripts/seeBill.js'></script>";
                                    var bill = snapshot.val();
                                    var page = window.open();
                                    page.document.write(
                                        "<!DOCTYPE html><html><head>" + 
                                        jquery1 + jquery2 + firebase + bootstrap + 
                                        "</head><body>" +
                                        "<div class=" + "container" + ">" + 
                                        "<h1 class=" + "text-center" + ">" + bill.billTitle + "</h1>" +
                                        "</div></div></body>" + seeBill + "</html>"
                                    );
                                });
                            };

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
                    });
                } else {
                    $("div.billList").append("<button class='btn btn-default disabled'>" + bill.billTitle + "</button><br>");
                    $("button:last").append(document.createTextNode(" [failed]"));
                };
            } else {
                if (bill.billStatus == passStatus) {
                    $("div.billList").append("<button class='btn btn-default disabled'>" + bill.billTitle + "</button><br>");
                    $("button:last").append(document.createTextNode(" [passed]"));
                } else {
                    return false
                }
            };
        });
    };

    //getting the chamber the user is looking at 
    var chamberName = $(this).text().replace("BACK", "").split("Tracker")[1];
    if (chamberName.split(" ").indexOf("House") < 0 && chamberName.split(" ").indexOf("Senate") < 0) {
        var thisChamberDivision = chamberName.split(" ")[0].replace(" ", "");
        var premierTruthValue =  0 + (thisChamberDivision == "Premier");
        var thisCommitteeDivision = ["", "P"][premierTruthValue];
        var chamberName = thisCommitteeDivision + chamberName.split(" ")[1];
        displayBillsInThisChamber();
    } else {
        displayBillsInThisChamber();
    };
});

