var listOfSchools = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList")
var attorneyData = new Firebase("https://yig-bill-tracker.firebaseio.com/attorneyData");
var judicialData = new Firebase("https://yig-bill-tracker.firebaseio.com/judicialData");

$(document).ready(function() {
    //let's add the schools as options
    listOfSchools.on("child_added", function(snapshot) {
        var school = snapshot.val();
        $("#school").append("<option>" + school.name + "</option>");
    });

    //let's add team codes as options
    attorneyData.on("child_added", function(snapshot) {
        var team = snapshot.val();
        $("#teamCode").append("<option>" + team.teamCode + "</option>");
    });

    $("#addAttorney").click(function() {
        var firstName = $("#attorney #firstName").val();
        var lastName = $("#attorney #lastName").val();
        var attorneyName = firstName.toLowerCase().replace(" ", "") + "-" + lastName.toLowerCase().replace(" ", "");
        var teamCode = $("#attorney #teamCode").val();
        attorneyData.on("child_added", function(snapshot) {
            var team = snapshot.val();
            var teamID = snapshot.key();
            if (team.teamCode == teamCode) {
                attorneyData.child(teamID).child("attorneyList").push({
                    attorneyScore: 0,
                    averageScore: 0,
                    individualName: attorneyName,
                    witnessScore: 0,
                });
            };
        });
    });

    $("#addJudge").click(function() {
        var firstName = $("#judge #firstName").val();
        var lastName = $("#judge #lastName").val();
        var judgeName = firstName.toLowerCase().replace(" ", "") + "-" + lastName.toLowerCase().replace(" ", "");
        var category = $("#judge #category").val();
        if (category == "Presider") {
            judicialData.push({
                judgeName: judgeName,
                category: category,
                status: "active",
            });
        } else if (category == "Scorer") {
            judicialData.push({
                judgeName: judgeName,
                category: category,
                status: "active",
            });
        } else {
            console.log("select either scorer or presider");
        };
    });

    $("#addTeam").click(function() {
        var teamCode = $("#newTeamCode").val();
        var division = $("#division").val();
        var school = $("#school").val();
        attorneyData.push({
            "division": division,
            "eloScore": 0,
            "schoolName": school,
            "teamCode": teamCode,
            "attorneyList": "",
        });
    });
});
