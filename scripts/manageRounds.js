var listOfRounds = new Firebase("https://yig-bill-tracker.firebaseio.com/roundsInfo");

$(document).ready(function() {
    $("#roundNumber").change(function() {
        var selectedRoundNumber = $("#roundNumber").val();
        var selectedRoundNumber = selectedRoundNumber.split(" ")[1];

        listOfRounds.on("child_added", function(snapshot) {
            var round = snapshot.val();
            var roundID = snapshot.key();

            if (round.roundNumber ==  selectedRoundNumber && round.status == "to do") {
                var thisRound = "<button class='btn btn-default form-control' id='" + roundID + "'>" + round.pro + " vs. " + round.con + "</button>";
                $("#roundsInfo").append("<div class='round'>" + thisRound + "</div>");
                $("#roundsInfo button:last").click(function() {
                    $(".scoreForm").remove();
                    var scoringInput = "<input type='number' class='score form-control' value='0'>";
                    var scoreParameters_pro = ["Opening", "Direct 1", "Witness 1", "Direct 2", "Witness 2", "Direct 3", "Witness 3", "Cross 1", "Cross 2", "Cross 3", "Closing"];
                    var scoreParameters_con = ["Opening", "Cross 1", "Cross 2", "Cross 3", "Direct 1", "Witness 1", "Direct 2", "Witness 2", "Direct 3", "Witness 3", "Closing"];

                    var scoreForm = $($(this).parent()).append("<div class='scoreForm'><div class='col-md-6' id='prosecutionScores'></div><div class='col-md-6' id='defenseScores'></div><button class='btn btn-default btn-success form-control' id='calcScores'>Calculate Round Scores</button>");
                    scoreForm.hide();
                    scoreForm.slideDown("800");
                    var addScoreParameters = function(targetArea, listOfParameters) {
                        for (i = 0; i < listOfParameters.length; i++) {
                        $(targetArea).append("<label>" + listOfParameters[i] + "</label>" + scoringInput);
                    };
                    };
                    addScoreParameters("#prosecutionScores", scoreParameters_pro);
                    addScoreParameters("#defenseScores", scoreParameters_con);
                    $("#calcScores").click(function() {
                        //calculate the scores
                        var totalScore_prosecution = 0;
                        var totalScore_defense = 0;
                        
                        for (scoreLoop = 0; scoreLoop < scoreParameters_pro.length; scoreLoop++) {
                            var nOfType = scoreLoop + 1;
                            var singleScore = $("#prosecutionScores input.score:nth-of-type(" + nOfType + ")").val();
                            totalScore_prosecution = totalScore_prosecution + parseInt(singleScore);
                        };
                        for (scoreLoop = 0; scoreLoop < scoreParameters_con.length; scoreLoop++) {
                            var nOfType = scoreLoop + 1;
                            var singleScore = $("#defenseScores input.score:nth-of-type(" + nOfType + ")").val();
                            totalScore_defense = totalScore_defense + parseInt(singleScore);
                        };

                        //let's make the user confirm these scores
                        var showOutcome = function(winner) {
                            $("<h3 class='text-center'>Check the scores one last time</h3><h4 class='text-center'>Prosecution [" + totalScore_prosecution + "] vs Defense [" + totalScore_defense + "]</h4>" + "<blockquote class='text-center'>" + winner + "won the round</blockquote><div><div class='col-md-3'></div><button class='btn btn-primary col-md-6' id='submitScores'>Submit Scores</button><div class='col-md-3'></div></div>").insertAfter("#calcScores");
                            $("#submitScores").click(function() {
                                var oldScore_prosecution = round.proScoreBefore;
                                var newScore_prosecution = oldScore_prosecution + totalScore_prosecution;
                                var oldScore_defense = round.conScoreBefore;
                                var newScore_defense = oldScore_defense + totalScore_defense;

                                listOfRounds.child(roundID).update({
                                    proScoreAfter: newScore_prosecution,
                                    conScoreAfter: newScore_defense,
                                    status: "done",
                                });
                            });
                        };
                        if (totalScore_prosecution > totalScore_defense) {
                            showOutcome(round.pro);
                        } else if (totalScore_prosecution < totalScore_defense) {
                            showOutcome(round.con);
                        } else if (totalScore_prosecution == totalScore_defense) {
                            alert("error there can't be a tie");
                        } else {
                            alert("error in the scoring process");
                        };
                    });
                });
            } else {
                alert("no rounds available");
            };
        });
    });
});
