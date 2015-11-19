var listOfEventsAtTheConference = new Firebase("https://yig-bill-tracker.firebaseio.com/conferenceSchedule");

$(document).ready(function() {
    //let's create the basic outline of the each day
    var listOfDays = ["Wednesday", "Thursday", "Friday", "Saturday"];
    for (i = 0; i < listOfDays.length; i++) {
        $("#schedule").append("<div class='row'><h2 class='text-center'>" + listOfDays[i] + "</h2><div class='col-md-2'></div><div class='col-md-8'><table class='table table-bordered " + listOfDays[i] + "'><tr class='active'><td>Start</td><td>End</td><td>Event</td><td>Location</td><td>Address</td><td>Description</td><td>Attire</td></tr></table></div><div class='col-md-2'></div></div>");
    };

    //let's add events to the correct day based on earliest start time
    listOfEventsAtTheConference.orderByChild("startTimestamp").on("child_added", function(snapshot) {
        var event = snapshot.val();
        //let's append a tr with the values in the correct place
        $("table." + event.dayOfTheConference).append("<tr class='amendable " + snapshot.key() + "'><td>" + event.startTime + "</td><td>" + event.endTime + "</td><td>" + event.eventName + "</td><td>" + event.locationName + "</td><td>" + event.locationAddress + "</td><td>" + event.description + "</td><td>" + event.attire + "</td></tr>");
    });

    //let's make changes easy
    $("#changeSchedule").click(function() {
        if ($(this).text() == "Make Changes") {
            $(this).text("Submit Changes");
            $(".amendable").attr("contenteditable", "true");
        } else if ($(this).text() == "Submit Changes") {
            var allEvents = $("#schedule").find("tr.amendable");
            for (i = 0; i < allEvents.length; i++) {
                var thisEventClasses = allEvents[i].className;
                var thisEventID = thisEventClasses.split(" ")[1]
                console.log($("tr.amendable." + thisEventID));
                var contentsOfThisRow = $("tr.amendable." + thisEventID)[0];
                var newEventInfo = [];
                for (at = 0; at < contentsOfThisRow.childElementCount; at++) {
                    var sas = contentsOfThisRow.childNodes[at].innerText;
                    console.log(sas);
                    newEventInfo.push(sas);
                };
                console.log(newEventInfo);
                //getting the day of the conference to use for the time stamp just for Jesus
                var bam = $("tr." + thisEventID).parent().parent().parent().html();
                var bam1 = bam.toString().split("<tbody");
                var bam1 = bam1[0].split("table-bordered");
                var dayOfTheConference = bam1[1].replace('">', '').replace(" ", "");
                console.log(dayOfTheConference);

                //let's now get the time stamp for jesus
                var possibleDates = {"wednesday":"18","thursday":"19","friday":"20","saturday":"21"};
                var stringDateStart = (new Date("2015/11/"+possibleDates[dayOfTheConference.toLowerCase()]+" "+ newEventInfo[0]).getTime()/1000).toString();
                var stringDateEnd = (new Date("2015/11/"+possibleDates[dayOfTheConference.toLowerCase()]+" "+ newEventInfo[1]).getTime()/1000).toString();

                var updateCalendar = function() {
                    listOfEventsAtTheConference.child(thisEventID).update({
                        "startTime": newEventInfo[0],
                        "startTimestamp": stringDateStart,
                        "endTime": newEventInfo[1],
                        "endTimestamp": stringDateEnd,
                        "eventName": newEventInfo[2],
                        "locationName": newEventInfo[3],
                        "locationAddress": newEventInfo[4],
                        "description": newEventInfo[5],
                        "attire": newEventInfo[6],
                    });
                };
                updateCalendar();
                window.location.reload();
            };
        };
    });
});
