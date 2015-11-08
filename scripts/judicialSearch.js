var judges = new Firebase("https://yig-bill-tracker.firebaseio.com/judicialData");

$(document).ready(function() {
    var judgesList = [];
    judges.on("child_added", function(snapshot) {
        var judge = snapshot.val();
        judgesList.push(judge.judgeName);
    });

    var getInfo = function(a) {
        var authorSearched = a.toString();
        
        judges.on("child_added", function(snapshot) {
            person = snapshot.val();
            personID = snapshot.key();
            if (person.judgeName == authorSearched) {
                $("#message").html("<div class='searchedJudge'><h3>" + person.judgeName + "</h3></div><div class='searchedJudgeInfo'><h5 class='newCategory'> CATEGORY: " + person.category + "</h5><h5 class='newStatus'> STATUS: " + person.status + "</h5><h5 class='judgeID'>ID: " + personID + "</h5></div><button class='btn btn-success' id='editJudgeInfo'>Edit Judge Info</button>");
                //let's take care of the editing process
                $("#editJudgeInfo").click(function() {
                    var state = $(this).text();
                    if (state == "Edit Judge Info") {
                        $(this).text("Submit Edit");
                        $(".newCategory").html("<h5>CATEGORY: <select id='newCategory' class='form-control'><option>Presider</option><option>Scorer</option></select></h5>");
                        $(".newStatus").html("<h5>CATEGORY: <select id='newStatus' class='form-control'><option>active</option><option>not active</option></select></h5>");
                    } else if (state == "Submit Edit") {
                        var newCategory = $("#newCategory").val();
                        var newStatus = $("#newStatus").val();
                        var judgeID = $(".judgeID").text().split(" ")[1];
                        console.log(judgeID);
                        judges.child(judgeID).update({
                            category: newCategory,
                            status: newStatus,
                        });
                        alert("success");
                        window.location.reload();
                    } else {
                        console.log("error in the editing process");
                    };
                });
            };
        });
    };

    $("#search-form").autocomplete({
            hints: judgesList,
            width: 300,
            height: 30,
            onSubmit: function(text){
                getInfo(text);
            }
    });
});
