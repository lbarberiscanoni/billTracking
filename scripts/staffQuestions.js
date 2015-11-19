var listOfQuestions = new Firebase("https://yig-bill-tracker.firebaseio.com/staffQuestions")

$(document).ready(function() {
    listOfQuestions.on("child_added", function(snapshot) {
        var question = snapshot.val();
        if (question.status == "not answered") {
            $("#questions").prepend("<div class='row'><div class='row'><div class='row'><div class='row'><div class='row'><div class='row'><div class='row'><div class='row'><div class='row'><div class='col-md-4'></div><div class='col-md-4'><table class='table table-bordered'><tr><td>From: " + question.source + "</td><td>At: " + question.sentTimestamp + "</td><td id='questionID'>ID: " + snapshot.key() + "</td></tr><tr><td colspan='3' class='text-center' id='textOfTheQuestion'>" + question.question + "</td></tr><td colspan='3'><div class='col-md-4'></div><div class='col-md-4'><button class='btn btn-primary' id='answerQuestion'>Answer Question</button></td></div><div class='col-md-4'></div></table></div><div class='col-md-4'></div></div>");
            $("#answerQuestion").click(function() {
                answeringState = $(this).text();
                if (answeringState == "Answer Question") {
                    $(this).text("Submit Answer");
                    var bro = $(this).parent().parent().parent();
                    $("<tr><td colspan='3'><textarea rows='4' cols='65' id='answerToTheQuestion'></textarea></td></tr>").insertBefore(bro);
                } else if (answeringState == "Submit Answer") {
                    var answerToTheQuestion = $("#answerToTheQuestion").val();
                    var questionID = snapshot.key();
                    var timeStamp = new Date().getTime(); 
                    console.log(answerToTheQuestion)
                    listOfQuestions.child(questionID).update({
                        status: "answered",
                        answer: answerToTheQuestion,
                        answeredTimestamp: parseInt(timeStamp/1000).toString(),
                    });
                    window.location.reload();
                } else {
                    alert("error");
                };
            });
        };
    });
});
