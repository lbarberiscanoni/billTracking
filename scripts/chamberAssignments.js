var schoolList = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList");
var billList = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    //create sections based on school list
    schoolList.on("child_added", function(snapshot) {
        var school = snapshot.val();
        var schoolName = school.name;

        $("#peopleToBeAssigned").append("<div>" + "</div>");
        $("#peopleToBeAssigned div:last").addClass(schoolName);
        $("#peopleToBeAssigned div:last").append("<h3 class='btn btn-default'>" + schoolName + "</h3><div class='chamberAssignment'></div>");

        //dropdown for the delegates to sort
        $(".chamberAssignment").hide();
        $("#peopleToBeAssigned h3:last").click(function() {
            var schoolClicked = $(this);
            var chamberAssignment = schoolClicked.parent().find(".chamberAssignment");
            chamberAssignment.toggle(400);
        });
    });

    var numberOfPeopleToAssign = 0;
    var numberOfPeopleAssigned = 0;

    //adding delegates based on the school
    billList.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        var billID = bill.id;
        //if the person is already sorted show it but don't let it do anything else
        if (bill.authorLocation == "not yet assigned") {
            numberOfPeopleToAssign += 2;
            $("#peopleToBeAssigned div." + bill.school + " .chamberAssignment").append("<button class='btn btn-default chamberAssignmentTrigger'>" + bill.author1 + "</button>");
            $("#peopleToBeAssigned div." + bill.school + " .chamberAssignment").append("<button class='btn btn-default chamberAssignmentTrigger'>" + bill.author2 + "</button>");
            $("div#peopleToBeAssigned .chamberAssignmentTrigger").click(function() {
                $("select#chamber").remove();
                $("<select class='form-control' id='chamber'>" + "</select>").insertAfter(this);
                $("select.form-control:last").append("<option>" + "Assign to Chamber" + "</option>");

                chamberList = ["A", "B", "C", "D", "E", "F", "PA", "PB", "PC", "PD", "PE", "PF", "PG", "Premier House", "Premier Senate", "House", "Senate"];
                for (var i = 0; i < chamberList.length; i++) {
                    $("select.form-control:last").append("<option>" + chamberList[i] + "</option>");
                };

                $("#chamber").change(function() {
                    var selectedChamber = $("#chamber").val();
                    billList.child(billID).update({
                        "authorLocation": selectedChamber,
                    });
                    window.location.reload();
                });
            });
        } else {
            numberOfPeopleAssigned += 1;
        };
        
        //updating the number of bills taken care of
        $("div.toSort h2").html("To Sort [" + numberOfPeopleToAssign + "]");
        $("div.sorted h2").html("Sorted [" + numberOfPeopleAssigned + "]");
    });

    i = 0;
    billList.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        if (i < 15 && bill.authorLocation != "not yet assigned") {
            i += 1;
            $("div#assigned").append("<button class='btn btn-default assignedDelegate'>Name: " + bill.author1 + " & " + bill.author2 + "<br>Chamber Assignment: " + bill.authorLocation + "</button>");
        };
    });
});
