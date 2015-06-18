var fireData = new Firebase("https://yig-bill-tracker.firebaseio.com/");

$(document).ready(function() {
    $("#makeBill").click(function() {
        //author
        var school = $("#school").val();
        var name = $("#name").val();
        var lastName = $("#lastName").val();
        var authorID = name + "-" + lastName;
        
        //bill title
        var mission = $("#title").val().replace(/\s/g, "-");
        var billTitle = "a-bill-to-" + mission;

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
        });

        var billID = bill.key();
        bill.update({
            "id": billID,
        });
    });
});
