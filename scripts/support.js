var emailList = new Firebase("https://yig-bill-tracker.firebaseio.com/emailList");
$(document).ready(function() {
    var validateEmail = function(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    //let's get a quick count
    emailList.once("value", function(snapshot) {
        var numberOfEmailsAlreadyinDB = snapshot.numChildren();
        $("#emailCount").html(numberOfEmailsAlreadyinDB + " people are already using the app!");

        $("#submit").click(function() {
            var emailAddress = $("#emailAddress").val();
            if (validateEmail(emailAddress) == true) {
                var i = 0;
                var listOfEmailsAlreadyinDB = [];
                emailList.on("child_added", function(snapshot) {
                    i += 1;
                    listOfEmailsAlreadyinDB.push(snapshot.val().emailAddress);
                    if (i == numberOfEmailsAlreadyinDB) {
                        if (listOfEmailsAlreadyinDB.indexOf(emailAddress) > -1) {
                            $("#responseMessage").html("<h3 class='text-center'>Sorry! It looks like you have already signed up!");
                        } else {
                            emailList.push({
                                "emailAddress": emailAddress,
                            });
                            $("#responseMessage").html("<h3 class='text-center'>Congrats! Check your email for the link to download the app!");
                        };
                    };
                });
            } else {
                $("#responseMessage").html("<h3 class='text-center'>Sorry! Looks like your email is invalid");
            };
        });
    });
});
