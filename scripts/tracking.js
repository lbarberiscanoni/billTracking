var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    //getting the chamber the user is looking at 
    var chamberName = $(this).text().replace(/\s/g, "-").replace("BACK", "").split("Tracker")[1];

    sortedBills.on("child_added", function(snapshot) {
        //running through all the bills to find their location
        var bill = snapshot.val();
        
        if (bill.billLocation == chamberName) {
            $("div.container").append("<button>" + bill.billTitle + "</button>");
            $("button:last").addClass("btn btn-default ").attr("id", "bill"); 

            if (bill.billStatus == "passed committee" || bill.billStatus == "failed in committee") {
                $("button#bill:last").addClass("disabled");
            } else {
                $("button#bill").click(function() {
                    $(this).addClass("form-inline");
                    $("<button>" + "Passed" + "</button>").insertAfter($(this));
                    $("button:last").addClass("btn btn-success");
                    $("<button>" + "Failed" + "</button>").insertAfter($("button.btn-success"));
                    $("button:last").addClass("btn btn-danger");
                    
                    //after making buttons changing the bill status based on which button was clicked
                    $("button.btn-success").click(function() {
                        var thisBillID = bill.id;
                        sortedBills.child(thisBillID).update({
                            billStatus: "passed committee",
                        });
                        $(this).next().hide();
                        $(this).hide();
                    });

                    $("button.btn-danger").click(function() {
                        var thisBillID = bill.id;
                        sortedBills.child(thisBillID).update({
                            billStatus: "failed in committee",
                        });
                        $(this).prev().hide();
                        $(this).hide();
                    });
                    
                    //can't change bills now
                    $(this).addClass("disabled");

                });
            };
        } else {
            return false;
        };
    });
});

