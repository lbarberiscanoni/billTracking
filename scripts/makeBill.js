var fireData = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");
var schoolListFromDB = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList");

$(document).ready(function() {
    //add schools based on the DB
    schoolListFromDB.on("child_added", function(snapshot) {
        var school = snapshot.val();
        var schoolName = school.name;

        $("#school").append("<option>" + schoolName + "</option>");
    });

    $("#makeBill").click(function() {

        //authors
        var author1 = $("#author1").val().toLowerCase().replace(" ", "-");
        var author2 = $("#author2").val().toLowerCase().replace(" ", "-");
        var school = $("#school").val();
        
        //bill title
        var mission = $("#title").val();
        var billTitle = "A Bill to " + mission;

        //bill text 
        var section1 = $("#section1").val();
        var section2 = $("#section2").val();
        var section3 = $("#section3").val();
        var section4 = $("#section4").val();
        var section5 = $("#section5").val();
        var billText = "<h3>Section 1</h3>" + section1 + "<h3>Section 2</h3>" + section2 + "<h3>Section 3</h3>" + section3 + "<h3>Section 4</h3>" + section4 + "<h3>This bill will go into effect starting on " + section5 + "</h3>";

        alert("You are about to add [" + billTitle + "]");
        //adding data to the Firebase database
        var bill = fireData.push({
            author1,
            author2,
            school,
            billTitle,
            billText,
            authorLocation: "not yet assigned",
            billLocation: "not yet sorted",
            billStatus: "not yet sorted",
            division: "not yet sorted",
            governorEvaluation: "not yet evaluated",
            "rocketDocketStatus": "no",
        });

        var billID = bill.key();
        bill.update({
            "id": billID,
        });

        window.location.reload();
    });
});
