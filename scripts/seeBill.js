var billList = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");
//first, let's figure which bill we are dealing with
var thisBillTitle = $("h1").text();

//let's run to through the DB to find the bill and print it for the user
billList.on("child_added", function(snapshot) {
    var bill = snapshot.val();
    if (bill.billTitle == thisBillTitle) {
        var thisBillID = bill.id;
        var billText = bill.billText;
        console.log(billText.split("<br>"));
        $(".container").append("<h3 class='text-center'>" + "BE IT HEREBY ENACTED BY THE YMCA MODEL LEGISLATURE OF SOUTH CAROLINA" + "</h3>");
        $(".container").append("<div class='row amendable' id='billText'>/div>");
        $("#billText").html(billText);

        var chamber = bill.billLocation;
        var passedStatus = "passed " + chamber;
        var failedStatus = "failed in " + chamber;
        //let's add a way to pass bills from this window
        $(".container:last").append("<button id='passed'>" + "Passed" + "</button>");
        $("#passed").addClass("btn btn-success");
        $("#passed").click(function() {
            alert(passedStatus);
            billList.child(thisBillID).update({
                "billStatus": passedStatus,
            });
            
            //let's move the bill in the appropriate chamber
            if (bill.billLocation == "Premier House") {
                billList.child(thisBillID).update({
                    billLocation: "Premier Senate",
                });
            } else if (bill.billLocation == "House") {
                billList.child(thisBillID).update({
                    billLocation: "Senate",
                });
            } else if (bill.billLocation == "Senate" || bill.billLocation == "Premier Senate") {
                billList.child(thisBillID).update({
                    billLocation: "Governor Desk",
                });
            } else {
                if (bill.division == "Premier") {
                    billList.child(thisBillID).update({
                        billLocation: "Premier House",
                    });
                } else if (bill.division == "Upper") {
                    billList.child(thisBillID).update({
                        billLocation: "House",
                    });
                } else {
                    alert("problem with bill location");
                };
            };

            window.location.reload();
        });

        //let's add a way to fail bills from this window
        $(".container:last").append("<button id='failed'>" + "Failed" + "</button>");
        $("#failed").addClass("btn btn-danger");
        $("#failed").click(function() {
            alert(failedStatus);
            billList.child(thisBillID).update({
                "billStatus": failedStatus,
            });
            window.location.reload();
        });

        //let's add the amendment capabilities
        $(".container:last").append("<button class='btn btn-default' id='amend'>" + "Amend Bill" + "</button>");
        $("#amend").click(function() {
            var processStatus = $(this).text();
            if (processStatus == "Amend Bill") {
                $(this).text("Submit Amendment");
                $(".amendable").attr("contenteditable", "true");
            } else if (processStatus == "Submit Amendment") {
                var newBillText = $(".amendable").html();
                console.log(newBillText);
                billList.on("child_added", function(snapshot) {
                    var billBeingLoopedOver = snapshot.val();
                    if (billBeingLoopedOver.billTitle == thisBillTitle) {
                        billList.child(billBeingLoopedOver.id).update({
                            billText: newBillText,
                        });
                    };
                });
                alert("amendment made");
                window.location.reload();
            };
        });
    };
});
