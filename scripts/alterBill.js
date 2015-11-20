var listOfBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    $("#change").click(function() {
        var processStatus = $(this).text();
        if (processStatus == "Make Changes") {
            $(this).text("Submit Changes")
            $(".amendable").attr("contenteditable", "true");
        } else {
            var lol = $(".amendable");
            console.log(lol);
        };
    });
});
