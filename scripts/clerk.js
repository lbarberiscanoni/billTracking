$(document).ready(function() {
    $("#committees").click(function() {
        $("#chamberSelection").empty();
        committeesList = ["upper_a", "upper_b", "upper_c", "upper_d", "upper_e", "upper_f", "premier_a", "premier_b", "premier_c", "premier_d", "premier_e", "premier_f", "premier_g"];
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
