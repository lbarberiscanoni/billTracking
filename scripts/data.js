var data = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    //let's make sections for each school that will display data
    schoolList = {
        "Riverside": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        }, 
        "Southside": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        }, 
        "Eastside": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        }, 
        "Christ Church": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        }, 
        "Porter Gaud": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        }, 
        "Mauldin": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        }, 
        "Blufton": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        }, 
        "JL Mann": {
            passed: 0,
            failed: 0,
            yetToDo: 0,
        },
    };

    var showSchool = function() {
        console.log(schoolList);
        var finalStr = ''
        for (school in schoolList) {
            var s = schoolList[school];
            console.log(s)
            console.log(s.passed);
            console.log(schoolList[school]['failed']);
            finalStr = finalStr + "<div class='row'>" + "<h3>" + school + " P[" + schoolList[school]['passed'] + "] F[" + schoolList[school]['failed'] + "] TD[" + schoolList[school]['yetToDo'] + "]</h3></div>";

           $("#schools").append("<div class='row'>" + "<h3>" + school + " P[" + schoolList[school]['passed'] + "] F[" + schoolList[school]['failed'] + "] TD[" + schoolList[school]['yetToDo'] + "]</h3></div>");
        }
        //console.log(finalStr);
        //console.log('gg')

        //$("#schools").append(finalStr);
    };

    $.when(data.on("child_added", function(snapshot) {
        var thisBill = snapshot.val();
        var statusOfBill = thisBill.billStatus;
        if (schoolList[thisBill.school]) {
            if (statusOfBill.indexOf("passed") != -1) {
                schoolList[thisBill.school].passed += 1;
            } else if (statusOfBill.indexOf("failed") != -1) {
                schoolList[thisBill.school].failed += 1;
            } else if (statusOfBill.indexOf("docket") != -1) {
                schoolList[thisBill.school].yetToDo += 1;
            };
        };
    })).then(showSchool());

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
