var billList = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");
var listOfSchools = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList");

$(document).ready(function() {
    //let's make sections for each school that will display data
    listOfSchools.on("child_added", function(snapshot) {
        var school = snapshot.val();
        var schoolName = school.name;
        var schoolID = snapshot.key();
        
        $("#schools").append("<h3>" + schoolName + "</h3>");
        $("#schools h3:last").attr("id", schoolName);

        billList.on("child_added", function(snapshot) {
            var bill = snapshot.val();

            var billsPassed = 0;
            var billsFailed = 0;
            var billsYetToDo = 0;

            if (bill.school == school.name) {
                console.log(bill.school);
                if (bill.billStatus.indexOf("on the docket") != -1) {
                    var billsYetToDo = billsYetToDo + 1;
                    listOfSchools.child(schoolID).update({
                        "yetToDo": billsYetToDo,
                    });
                } else if (bill.billStatus.indexOf("passed") != -1) {
                    var billsPassed = billsPassed + 1;
                    listOfSchools.child(schoolID).update({
                        "passed": billsPassed,
                    });
                } else if (bill.billStatus.indexOf("failed") != -1) {
                    var billsFailed = billsFailed + 1;
                    listOfSchools.child(schoolID).update({
                        "failed": billsFailed,
                    });
                } else {
                    console.log(bill.billStatus);
                };

                var currentStatus = $("#schools #" + schoolName).html();
                var updatedStatus = currentStatus + " P[" + billsPassed + "] F[" + billsFailed + "] TD[" + billsYetToDo + "]";
                $("#schools #" + schoolName).html(updatedStatus);
            };
        });
    });

    //let's make sections for each committee that will display data
    committeList = ["Criminal Justice", "Education", "Environmental", "General Issues", "Healthcare and Human Services", "Transportation"];
    for (var i = 0; i < committeList.length; i++) {
        $("#committees").append("<div class='row'>" + "<h3>" + committeList[i] + "</h3></div>");
    };

    //let's make sections for each chamber that will display data
    chamberList = ["Premier House", "Premier Senate", "House", "Senate"];
    for (var i = 0; i < chamberList.length; i++) {
        $("#chambers").append("<div class='row'>" + "<h3>" + chamberList[i] + "</h3></div>");
    };
});
