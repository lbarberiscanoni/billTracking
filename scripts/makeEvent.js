var listOfEventsAtTheConference = new Firebase("https://yig-bill-tracker.firebaseio.com/conferenceSchedule");

$(document).ready(function() {
    //first let's add the time to the form
    $("#timepicker1").timepicker();
    $("#timepicker2").timepicker();

    $("#submit").click(function() {
        //let's get the info for the new event
        var eventName = $("#eventName").val();
        var eventDay = $("#eventDay").val();
        var eventStart = $("#timepicker1").val();
        var eventEnd = $("#timepicker2").val();
        var eventLocation = $("#location").val();
        var eventAddress = $("#address").val();
        var eventDescription = $("#eventDescription").val();
        var eventAttire = $("#attire").val();
        
        //now let's push the data into a new event on the schedule
        listOfEventsAtTheConference.push({
            eventName: eventName,
            dayOfTheConference: eventDay,
            startTime: eventStart,
            endTime: eventEnd,
            locationName: eventLocation,
            locationAddress: eventLocation,
            description: eventDescription,
            attire: eventAttire,
        });

        alert("success");
    });
});
