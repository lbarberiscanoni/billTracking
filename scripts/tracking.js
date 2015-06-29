var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    //getting the chamber the user is looking at 
    //var chamberName = $(this).text().replace(/\s/g, "-").replace("BACK", "").split("Tracker")[1];
    var chamberName = $(this).text().replace("BACK", "").split("Tracker")[1];
    console.log(chamberName);

    sortedBills.on("child_added", function(snapshot) {
        //running through all the bills to find their location
        var bill = snapshot.val();

        var passStatus = "passed "; 
        passStatus += chamberName;
        var failedStatus = "failed in " 
        failedStatus += chamberName;
       
        if (bill.billLocation == chamberName) {
            $("div.container").append("<button>" + bill.billTitle + "</button><br>");
            $("button:last").addClass("btn btn-default ").attr("id", "bill"); 

            $("button#bill:last").click(function() {
                $(this).addClass("form-inline");
                $("<button>" + "Passed" + "</button>").insertAfter($(this)).addClass("btn btn-success");
                $("<button>" + "Failed" + "</button>").insertAfter("button.btn-success").addClass("btn btn-danger");

                //after making buttons changing the bill status based on which button was clicked
                $("button.btn-success").click(function() {
                    var thisBillID = bill.id;
                    sortedBills.child(thisBillID).update({
                        billStatus: passStatus,
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
                        billStatus: failedStatus,
                    });

                    $(this).prev().hide();
                    $(this).hide();

                    window.location.reload();
                });
            });
        } else {
            if (bill.billStatus == passStatus) {
                $("div.container").append("<button>" + bill.billTitle + "</button><br>");
                $("button:last").addClass("btn btn-default disabled");
                $("button:last").append(document.createTextNode(" [passed]"));
            } if (bill.billStatus == failedStatus) {
                $("div.container").append("<button>" + bill.billTitle + "</button><br>");
                $("button:last").addClass("btn btn-default disabled");
                $("button:last").append(document.createTextNode(" [failed]"));
            } else {
                return false
            };
        };
    });
});

