var listOfTeams = new Firebase("https://yig-bill-tracker.firebaseio.com/attorneyData");
var listOfJudges = new Firebase("https://yig-bill-tracker.firebaseio.com/judicialData");
var roundsInfo = new Firebase("https://yig-bill-tracker.firebaseio.com/roundsInfo/");

$(document).ready(function() {
    listOfTeams.on("child_added", function(snapshot) {
        var team = snapshot.val();
        $("#prosecution").append("<option>" + team.teamCode + "</option>");
        $("#defense").append("<option>" + team.teamCode + "</option>");
    });

    listOfJudges.on("child_added", function(snapshot) {
        var judge = snapshot.val();
        if (judge.status == "active") {
            if (judge.category == "Presider") {
                $("#presidingJudge").append("<option>" + judge.judgeName + "</option>");
            } else if (judge.category == "Scorer") {
                $("#scoringJudge").append("<option>" + judge.judgeName + "</option>");
            };
        };
    });

    $("#submitRound").click(function() { 
        var prosecutionTeam = $("#prosecution").val();
        var defenseTeam = $("#defense").val();
        var roundNumber = parseInt($("#roundNumber").val());
        var presider = $("#presidingJudge").val();
        var scorer = $("#scoringJudge").val();
        var roomCode = $("#roundNumber").val();

        $("#confirmationMessage").html("<div class='row'><div class='col-md-3'></div><div class='col-md-6'><h2>" + prosecutionTeam + " vs. " + defenseTeam + " judged by " + presider + " and scored by " + scorer + " in Room " + roomCode + "</h2></div><div class='col-md-3'></div><br><div class='row'><div class='col-md-4'></div><div class='col-md-4'><button class='btn btn-success form-control' id='confirmation'>Confirm the Submission</button></div><div class='col-md-4'></div></div></div>");
        $("#confirmation").click(function() {
            roundsInfo.once("value", function(snapshot) {
                var totalNumberOfRounds = snapshot.numChildren();
                var newIndex = totalNumberOfRounds;
                roundsInfo.push({
                    con: defenseTeam,
                    conScoreBefore: 0,
                    conScoreAfter: 0,
                    pro: prosecutionTeam,
                    proScoreBefore: 0,
                    proScoreAfter: 0,
                    scoringJudge: scorer,
                    presidingJudge: presider,
                    roomCode: roomCode,
                    roundNumber: roundNumber,
                    status: "to do",
                    index: newIndex, 
                });
            });
            
            alert("you have successfully added the round");
            window.location.reload();
        });
    });
});
