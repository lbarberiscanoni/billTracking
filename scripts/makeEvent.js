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
        //JESUS WAS HERE
        var dayString = eventDay.toLowerCase();
        var timeStringStart = eventStart;
        var timeStringEnd = eventEnd;
        var possibleDates = {"wednesday":"18","thursday":"19","friday":"20","saturday":"21"};
        var stringDateStart = (new Date("2015/11/"+possibleDates[dayString]+" "+timeStringStart).getTime()/1000);
        var stringDateEnd = (new Date("2015/11/"+possibleDates[dayString]+" "+timeStringEnd).getTime()/1000);
        //JESUS MOTHERFUCKERS
        //now let's push the data into a new event on the schedule
        listOfEventsAtTheConference.push({
            eventName: eventName,
            dayOfTheConference: eventDay,
            startTime: eventStart,
            endTime: eventEnd,
            startTimestamp: stringDateStart,
            endTimestamp: stringDateEnd,
            locationName: eventLocation,
            locationAddress: eventLocation,
            description: eventDescription,
            attire: eventAttire,
        });

        alert("success");
    });
});
