var listOfEventsAtTheConference = new Firebase("https://yig-bill-tracker.firebaseio.com/conferenceSchedule");

$(document).ready(function() {
    //let's create the basic outline of the each day
    var listOfDays = ["Wednesday", "Thursday", "Friday", "Saturday"];
    for (i = 0; i < listOfDays.length; i++) {
        $("#schedule").append("<div class='row'><h2 class='text-center'>" + listOfDays[i] + "</h2><div class='col-md-2'></div><div class='col-md-8'><table class='table table-bordered " + listOfDays[i] + "'><tr class='active'><td>Start</td><td>End</td><td>Event</td><td>Location</td><td>Address</td><td>Description</td><td>Attire</td></tr></table></div><div class='col-md-2'></div></div>");
    };

    //let's add events to the correct day based on earliest start time
    listOfEventsAtTheConference.orderByChild("startTime").on("child_added", function(snapshot) {
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
                var contentsOfThisRow = $("tr." + thisEventID).html();

                //getting the day of the conference to use for the time stamp just for Jesus
                var bam = $("tr." + thisEventID).parent().parent().parent().html();
                var bam1 = bam.toString().split("<tbody");
                var bam1 = bam1[0].split("table-bordered");
                var dayOfTheConference = bam1[1].replace('">', '').replace(" ", "");

                var lol = contentsOfThisRow.split("><");
                var lol2 = [];
                for (j = 0; j < lol.length; j++) {
                    var a = lol[j].replace("<td>", "").replace("</td>", "");
                    var b = a.replace("</td", "").replace("td>", "");
                    lol2.push(b);
                    if (j == lol.length - 1) {
                        //let's now get the time stamp for jesus
                        var possibleDates = {"wednesday":"18","thursday":"19","friday":"20","saturday":"21"};
                        var stringDateStart = (new Date("2015/11/"+possibleDates[dayOfTheConference.toLowerCase()]+" "+ lol2[0]).getTime()/1000);
                        var stringDateEnd = (new Date("2015/11/"+possibleDates[dayOfTheConference.toLowerCase()]+" "+ lol2[1]).getTime()/1000);

                        listOfEventsAtTheConference.child(thisEventID).update({
                            "startTime": lol2[0],
                            "startTimestamp": stringDateStart,
                            "endTime": lol2[1],
                            "endTimestamp": stringDateEnd,
                            "eventName": lol2[2],
                            "locationName": lol2[3],
                            "locationAddress": lol2[4],
                            "description": lol2[5],
                            "attire": lol2[6],
                        });
                        window.location.reload();
                    };
                };
            };
        };
    });
});
