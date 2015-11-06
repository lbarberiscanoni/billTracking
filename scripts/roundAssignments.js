var attorneyData = new Firebase("https://yig-bill-tracker.firebaseio.com/attorneyData");
var judicialData = new Firebase("https://yig-bill-tracker.firebaseio.com/judicialData");

$(document).ready(function() {
    //let's create a list fo all the attorneys by division
    var appealsIDs = [];
    var appealsInfo = [];
    var trialIDs = [];
    var trialInfo = [];

    attorneyData.once("value", function(snapshot) {
        //let's find the total number of attorneys to end the loop
        var numOfAttorneys = snapshot.numChildren();
        console.log("Number of Attorneys = " + numOfAttorneys);
        var numOfAttorneysLoopedOver = 0;
        attorneyData.on("child_added", function(snapshot) {
            var thisAttorneyInfo = snapshot.val();
            var thisAttorneyID = snapshot.key();
            if (thisAttorneyInfo.division == "Appeals") {
                appealsIDs.push(thisAttorneyID);
                appealsInfo.push(thisAttorneyInfo);
            } else if (thisAttorneyInfo.division == "Trial") {
                trialIDs.push(thisAttorneyID);
                trialInfo.push(thisAttorneyInfo);
            } else {
                console.log(thisAttorneyInfo.individualName + " does not have a division");
            };
            numOfAttorneysLoopedOver += 1

            //let's wait until the end of the loop
            if (numOfAttorneysLoopedOver == numOfAttorneys) {
                console.log("trial " + trialInfo)
                console.log("appeals " + appealsInfo);
            };
        });
    });
});
