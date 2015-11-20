var listOfBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    $("#change").click(function() {
        var processStatus = $(this).text();
        if (processStatus == "Make Changes") {
            $(this).text("Submit Changes")
            $(".amendable").attr("contenteditable", "true");
        } else {
            var lol = $(".amendable");
            var infoList = [];
            for (i = 0; i < lol.length; i++) {
                console.log(lol[i].innerHTML);
                infoList.push(lol[i].innerHTML);
            };
            console.log(infoList);
            var updateBillInfo = function() {
                listOfBills.child(infoList[0]).update({
                    school: infoList[1],
                    author1: infoList[2],
                    author2: infoList[3],
                    authorLocation: infoList[4],
                    billStatus: infoList[5],
                    billLocation: infoList[6],
                    division: infoList[7],
                    rocketDocketStatus: infoList[8],
                    sponsor: infoList[9],
                    governorEvaluation: infoList[10],
                    billTitle: infoList[11],
                    billText: infoList[12],
                });
            };
            updateBillInfo();
        };
    });
});
