var listOfBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    $("#change").hide();
    $("#searchParameter").change(function() {
        //let's add the search input
        $("#searchBar").html("<div class='col-md-4'></div><div class='col-md-4'><div id='search-form'></div><div id='message'></div></div><div class='col-md-4'></div>"); 

        //let's get the data
        var searchParameter = $("#searchParameter").val();
        var billList = [];
        if (searchParameter == "Author") {
            listOfBills.on("child_added", function(snapshot) {
                var bill = snapshot.val();
                billList.push(bill.author1.toLowerCase());
                billList.push(bill.author2.toLowerCase());
            });
        } else if (searchParameter == "Bill Title") {
            listOfBills.on("child_added", function(snapshot) {
                var bill = snapshot.val();
                billList.push(bill.billTitle.toLowerCase());
            });
        } else {
            alert("error with the search parameter");
        };

        var showInfo = function(a) {
            listOfBills.child(a).on("value", function(snapshot) {
                $("#change").show();
                $("#searchResults table.table.table-bordered").empty();
                var thisBill = snapshot.val();
                console.log(thisBill);
                var billInfo = [["Bill ID", thisBill.id], ["School", thisBill.school], ["Author 1", thisBill.author1],["Author 2", thisBill.author2],["Author Location", thisBill.authorLocation], ["Bill Status", thisBill.billStatus],["Bill Location", thisBill.billLocation], ["Division", thisBill.division],["Rocket Docket Status", thisBill.rocketDocketStatus],["Sponsor", thisBill.sponsor], ["Governor Evaluation", thisBill.governorEvaluation]];
                for (i = 0; i < billInfo.length; i++) {
                    $("#searchResults table").append("<tr><td>" + billInfo[i][0] + "</td><td class='amendable'>" + billInfo[i][1] + "</td></tr>"); 
                };
                $("#searchResults table").append("<tr><td colspan='2'class='text-center amendable'>" + thisBill.billTitle + "</td></tr><tr><td colspan='2' class='amendable'>" + thisBill.billText + "</td></tr>");
            });
        };

        var getInfo = function(a) {
            var searchResult = a.toString().toLowerCase();
            
            listOfBills.on("child_added", function(snapshot) {
                bill = snapshot.val();
                billID = snapshot.key();
                if (bill.author1.toLowerCase() == searchResult || bill.author2.toLowerCase() == searchResult) {
                    showInfo(billID);
                } else if (bill.billTitle.toLowerCase() == searchResult) {
                    showInfo(billID);
                };
            });
        };

        $("#search-form").autocomplete({
            hints: billList,
            width: 300,
            height: 30,
            onSubmit: function(text){
                getInfo(text);
            }
        });
    });
});
