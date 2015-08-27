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

        //author
        var school = $("#school").val();
        var name = $("#name").val();
        var lastName = $("#lastName").val();
        var authorID = name + " " + lastName;
        
        //bill title
        var mission = $("#title").val();
        var billTitle = "A Bill to " + mission;

        //bill text 
        var section1 = $("#section1").val();
        var section2 = $("#section2").val();
        var section3 = $("#section3").val();
        var section4 = $("#section4").val();
        var section5 = $("#section5").val();

        alert("You are about to add [" + billTitle + "]");
        //adding data to the Firebase database
        var bill = fireData.push({
            authorID,
            school,
            billTitle,
            section1,
            section2,
            section3,
            section4,
            section5,
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
