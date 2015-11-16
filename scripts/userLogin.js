var listOfPasswords = new Firebase("https://yig-bill-tracker.firebaseio.com/passwords");

$(document).ready(function() {
    $(".nav").hide();
    $("#submit").click(function() {
        var userPassword = $("#userPassword").val();
        var currentURL = window.location
        currentURL = currentURL.toString().replace("index.html", "");
        listOfPasswords.on("child_added", function(snapshot) {
            var userInfo = snapshot.val();
            if (userInfo.password == userPassword) {
                var userLoggedInto = userInfo.user;
                switch(userLoggedInto) {
                    case "clerk":
                        window.location = currentURL + "/views/clerk.html";
                        break;
                    case "director":
                        $(".nav").show();
                        break;
                    case "advisor":
                        window.location = currentURL + "/views/advisor.html";
                        break;
                    case "resource staff":
                        $(".nav").show();
                        $(".nav a:nth-of-type(1)").remove();
                        $(".nav a:nth-of-type(2)").remove();
                        $(".nav a:nth-of-type(3)").remove();
                        $(".nav a:nth-of-type(4)").remove();
                        $(".nav a:nth-of-type(5)").remove();
                        break;
                    case "governor":
                        window.location = currentURL + "/views/governor/governorDesk.html";
                        break;
                }; 
            };
        });
    });
});
