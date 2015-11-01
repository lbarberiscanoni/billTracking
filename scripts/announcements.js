var listOfAnnouncements = new Firebase("https://yig-bill-tracker.firebaseio.com/announcements");

$(document).ready(function() {
    //option to make new announcements
    $("#submit").click(function() {
        var announcementTitle = $("#announcementTitle").val();
        var announcementText = $("#announcementText").val();
        var timeStamp = new Date().getTime();
        var timeStamp = parseInt(timeStamp / 1000).toString();
        listOfAnnouncements.push({
            title: announcementTitle,
            content: announcementText,
            timestamp: timeStamp,
        });
        alert("success!");
        window.location.reload();
    });

    //showing all annoucnments in order of recency
    listOfAnnouncements.on("child_added", function(snapshot) {
        var announcement = snapshot.val();
        var timeStamp = announcement.timestamp;
        var timeStamp = parseInt(timeStamp * 1000);
        var timeStamp = new Date(timeStamp);
        var timeStamp = timeStamp.toString().split("GMT")[0];
        var timeStamp = timeStamp.split("2015")[0] + " @ " + timeStamp.split("2015")[1];
        $("<div class='row'><div class='col-md-4'></div><div class='col-md-4'><h3>" + announcement.title + "</h3><h4>" + timeStamp + "</h4></h3><p>" + announcement.content + "</p></div><div class='col-md-4'></div></div>").insertAfter("#pastAnnouncements h2");
    });
});
