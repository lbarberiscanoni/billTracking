var billList = new Firebase("https://yig-bill-tracker.firebaseio.com");
//first, let's figure which bill we are dealing with
var thisBillTitle = $("h1").text();

//let's run to through the DB to find the bill and print it for the user
billList.on("child_added", function(snapshot) {
    var bill = snapshot.val();
    if (bill.billTitle == thisBillTitle) {
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
                var thisSection = $(this).prev().text().split(" ").join("").toLowerCase();
                var dataToChange = bill.thisSection;
                var oldVersion = $(this).text();
                $("<button id='submitChanges'>" + "Submit Amendment" + "</button>").insertAfter("#amend");
                $("#submitChanges").addClass("btn btn-default");
                $("#submitChanges").click(function() {
                    var newVersion = $(".amendable").text();
                    alert("old version " + oldVersion);
                    alert("new version " + newVersion);
                    $(".amendable").attr("contenteditable", "false");
                    window.location.reload();
                    alert("amendment made");
                    window.close();
                });
            });
        });
    };
});
