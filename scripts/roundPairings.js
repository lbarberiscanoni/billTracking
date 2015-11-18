var listOfRounds = new Firebase("https://yig-bill-tracker.firebaseio.com/roundsInfo");
$(document).ready(function() {
    alert("hello");
    listOfRounds.on("child_added", function(snapshot) {
        var roundInfo = snapshot.val();
        console.log(roundInfo);
        $("table.table.table-bordered#round" + roundInfo.roundNumber).append("<tr><td>" + roundInfo.pro + "</td><td>" + roundInfo.con + "</td><td>" + roundInfo.scoringJudge + "</td><td>" + roundInfo.presidingJudge + "</td></tr>");
    });
});
