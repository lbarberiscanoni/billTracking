$(document).ready(function() {
    $("#committees").click(function() {
        $("#chamberSelection").empty();
        committeesList = ["criminal-justice", "education", "environmental", "general-issues", "healthcare-and-human-services", "transportation"];
        for (var i = 0; i < committeesList.length; i++) {
            $("#chamberSelection").append("<a>" + committeesList[i] + "</a>");
            $("#chamberSelection a:last").attr("href", "chambers/committees/" + committeesList[i] + ".html").addClass("btn btn-default");
        };
    });

    $("#premierChambers").click(function() {
        $("#chamberSelection").empty();
        chamberList = ["premier-house", "premier-senate"];
        for (var i = 0; i < chamberList.length; i++) {
            $("#chamberSelection").append("<a>" + chamberList[i] + "</a>");
            $("#chamberSelection a:last").attr("href", "chambers/" + chamberList[i] + ".html").addClass("btn btn-default");
        };
    });

    $("#upperChambers").click(function() {
        $("#chamberSelection").empty();
        chamberList = ["house", "senate"];
        for (var i = 0; i < chamberList.length; i++) {
            $("#chamberSelection").append("<a>" + chamberList[i] + "</a>");
            $("#chamberSelection a:last").attr("href", "chambers/" + chamberList[i] + ".html").addClass("btn btn-default");
        };
    });
});
