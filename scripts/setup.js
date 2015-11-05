var listOfSchools = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList")
var attorneyData = new Firebase("https://yig-bill-tracker.firebaseio.com/attorneyData");
var judicialData = new Firebase("https://yig-bill-tracker.firebaseio.com/judicialData");

$(document).ready(function() {
    listOfSchools.on("child_added", function(snapshot) {
        var school = snapshot.val();
        $("#school").append("<option>" + school.name + "</option>");
    });

    $("#addAttorney").click(function() {
        var firstName = $("#attorney #firstName").val();
        var lastName = $("#attorney #lastName").val();
        var attorneyName = firstName.toLowerCase().replace(" ", "") + "-" + lastName.toLowerCase().replace(" ", "");
        var division = $("#attorney #division").val();
        var school = $("#attorney #school").val();
        var teamCode = $("#attorney #teamCode").val();
        attorneyData.push({
            appealsScore: "",
            attorneyScore: "",
            averageScore: 0,
            division: division,
            eloScore: 0,
            individualName: attorneyName,
            justiceScore: "",
            schoolName: school,
            teamCode: teamCode,
            witnessScore: "",
            roundsInfo: { opponent: "0", presidingJudge: "", roundNumber: "0", scoringJudge: "", side: ""},
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
                rounds: {con: "", pro: "", roundNumber: 0, scorer: ""},
            });
        } else if (category == "Scorer") {
            judicialData.push({
                judgeName: judgeName,
                category: category,
                rounds: {con: "", pro: "", roundNumber: 0, presider: ""},
            });
        } else {
            console.log("select either scorer or presider");
        };
    });
});
