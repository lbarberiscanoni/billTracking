var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");
var schoolList = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList"); 

$(document).ready(function() {
    //create sections based on the schools
    schoolList.on("child_added", function(snapshot) {
        var school = snapshot.val();
        var schoolName = school.name;

        $("#toSort").append("<div>" + "</div>");
        $("#toSort div:last").addClass(schoolName);
        $("#toSort div:last").append("<h3 class='btn btn-default'>" + schoolName + "</h3><div class='legislation'></div>");

        //dropdown for the bills to sort
        $(".legislation").hide();
        $("#toSort h3:last").click(function(){
            var schoolClicked = $(this);
            var legislation = schoolClicked.parent().find(".legislation");
            legislation.toggle(400);
        });
    });

    var numberOfBillsToSort = 0; 
    var numberOfBillsSorted = 0;

    //adding bills based on the school
    sortedBills.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        //if the bill has been sorted show it but don't let it do anything else
        if (bill.billLocation == "not yet sorted") {
            numberOfBillsToSort += 1;
            $("#toSort div." + bill.school + " .legislation").append("<button>" + bill.billTitle + "</button>");
            $("#toSort button").addClass("btn btn-default billInfoTrigger");

            $("div#toSort .billInfoTrigger:last").click(function() {
                var billClickedNow = $(this);
                
                //create an option to put a bill either in Upper or Premier
                $("<div>" + "</div>").insertAfter(this).addClass("division");
                $("div.division").append("<button class='btn btn-default upper'>" + "Upper" + "</button>");
                $(".upper").click(function(){
                    window.division = "Upper";
                });
                $("div.division").append("<button class='btn btn-default premier'>" + "Premier" + "</button>");
                $(".premier").click(function() {
                    window.divison = "Premier";
                });
                    
                //create an option to sort the bill to the right committee
                $("<select>" + "</select>").insertAfter("div.division");
                $("select:last").addClass("committee btn btn-default");
                $("select.committee").append("<option>" + "Select a Committee" + "</option>");

                truthValue = 0 + (division == "Upper");
                committeList = [["A", "B", "C", "D", "E", "F"],["PA", "PB", "PC", "PD", "PE", "PF", "PG"]][truthValue];
                for (var i = 0; i < committeList.length; i++) {
                    $("select.committee").append("<option>" + committeList[i] + "</option>");
                };


                $("<button>" + "Place Bill in Committee" + "</button>").insertAfter("select.committee").addClass("btn btn-default submit");

                $("button.submit").click(function() {                    
                    var committee = $("select.committee").val()
                    var billClicked = billClickedNow.text();
                    sortedBills.on("child_added", function(snapshot) {
                        var bill = snapshot.val();
                        var thisBillID = bill.id;

                        if (billClicked == bill.billTitle) {
                            alert("You are moving [" + billClicked + "] in [" + committee + "]" + " in the [" + division + "] division");

                            sortedBills.child(thisBillID).update({
                                "billLocation": committee,
                                "billStatus": "on the docket",
                                "division": division,
                            });
                        };
                    });
                    $(this).siblings("button").prop("disabled", "true");

                    window.location.reload();
                });
            });
        } else {
            numberOfBillsSorted += 1;
        };

        //updating the number of bills taken care of
        $("div.toSort h2").html("To Sort [" + numberOfBillsToSort + "]");
        $("div.sorted h2").html("Sorted [" + numberOfBillsSorted + "]");
    });

    i = 0;
    sortedBills.on("child_added", function(snapshot) {
        bill = snapshot.val();
        if (i < 15 && bill.billLocation != "not yet sorted") {
            i += 1;
            $("div#sorted").append("<button class='btn btn-default sortedBill'>Title: " + bill.billTitle + "<br>Location: " + bill.billLocation + "<br>School: " + bill.school + "</button>");
        };
    });
});
