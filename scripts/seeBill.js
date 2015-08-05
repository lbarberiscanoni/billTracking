var billList = new Firebase("https://yig-bill-tracker.firebaseio.com");
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
                    window.close();
                });
            });
        });
    };
});
