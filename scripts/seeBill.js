var billList = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");
//first, let's figure which bill we are dealing with
var thisBillTitle = $("h1").text();

//let's run to through the DB to find the bill and print it for the user
billList.on("child_added", function(snapshot) {
    var bill = snapshot.val();
    if (bill.billTitle == thisBillTitle) {
        var thisBillID = bill.id;
        $(".container").append("<h3 class='text-center'>" + "BE IT HEREBY ENACTED BY THE YMCA MODEL LEGISLATURE OF SOUTH CAROLINA" + "</h3>");
        sectionsOfThisBill = ["Section1", bill.section1,"Section 2", bill.section2, "Section 3", bill.section3, "Section 4", bill.section4, "Section 5", "This bill shall be enacted on " + bill.section5];
        for (var i = 0; i < sectionsOfThisBill.length / 2; i++) {
            $(".container").append("<div class='row'><h4>" + sectionsOfThisBill[2 * i] + "</h4><p class='amendable'>" + sectionsOfThisBill[(2 * i) + 1] + "</p></div>");
        };

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
        $(".container:last").append("<button id='amend'>" + "Amend Bill" + "</button>");
        $("#amend").addClass("btn btn-default");
        $("#amend").click(function() {
            alert("start editing");
            $(".amendable").attr("contenteditable", "true");
            $(".amendable").click(function() {
                var thisInfo = $(this);
                var sectionToAmend = $(this).prev().text().split(" ").join("").toLowerCase();
                if (sectionToAmend == "section1") {
                    var currentText = bill.section1;
                } else if (sectionToAmend == "section2") {
                    var currentText = bill.section2;
                } else if (sectionToAmend == "section3") {
                    var currentText = bill.section3;
                } else if (sectionToAmend == "section4") {
                    var currentText = bill.section4;
                } else if (sectionToAmend == "section5") {
                    var currentText = bill.section5;
                } else {
                    console.log("error: section not amendable");
                };
                
                //submit the amendment
                $("<button id='submitChanges'>" + "Submit Amendment" + "</button>").insertAfter("#amend");
                $("#submitChanges").addClass("btn btn-default");
                $("#submitChanges").click(function() {
                    var amendment = thisInfo.text();
                    alert("amending " + sectionToAmend + " from [" + currentText + "] to [" + amendment + "]");
 
                    //let's push the amendment to the DB
                    if (sectionToAmend == "section1") {
                        billList.child(thisBillID).update({
                            "section1": amendment,
                        });
                    } else if (sectionToAmend == "section2") {
                        billList.child(thisBillID).update({
                            "section2": amendment,
                        });
                    } else if (sectionToAmend == "section3") {
                        billList.child(thisBillID).update({
                            "section3": amendment,
                        });
                    } else if (sectionToAmend == "section4") {
                        billList.child(thisBillID).update({
                            "section4": amendment,
                        });
                    } else if (sectionToAmend == "section5") {
                        billList.child(thisBillID).update({
                            "section5": amendment,
                        });
                    } else {
                        console.log("error: amendment couldn't go through because it was not done in any of the avaiblable sections not amendable");
                    };
                    
                    //let's go back to normal
                    $(".amendable").attr("contenteditable", "false");
                    alert("amendment made");
                    window.location.reload();
                    //window.close();
                });
            });
        });
    };
});
