var listOfEventsAtTheConference = new Firebase("https://yig-bill-tracker.firebaseio.com/conferenceSchedule");

$(document).ready(function() {
    //let's create the basic outline of the each day
    var listOfDays = ["Wednesday", "Thursday", "Friday", "Saturday"];
    for (i = 0; i < listOfDays.length; i++) {
        $("#schedule").append("<div class='row'><h2 class='text-center'>" + listOfDays[i] + "</h2><div class='col-md-2'></div><div class='col-md-8'><table class='table table-bordered " + listOfDays[i] + "'><tr><td>Start</td><td>End</td><td>Event</td><td>Location</td><td>Address</td><td>Description</td><td>Attire</td></tr></table></div><div class='col-md-2'></div></div>");
    };

    listOfEventsAtTheConference.orderByChild("startTime").on("child_added", function(snapshot) {
        var event = snapshot.val();
        //let's append a tr with the values in the correct place
        $("table." + event.dayOfTheConference).append("<tr><td>" + event.startTime + "</td><td>" + event.endTime + "</td><td>" + event.eventName + "</td><td>" + event.locationName + "</td><td>" + event.locationAddress + "</td><td>" + event.description + "</td><td>" + event.attire + "</td></tr>");
    });
});
