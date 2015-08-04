var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    //create sections based on the schools
    schoolList = ["Riverside", "Southside", "Eastside", "Christ-Church", "Porter-Gaud", "Mauldin", "Blufton", "JL-Mann"];
    for (var i = 0; i < schoolList.length; i++) {
        $("#toSort").append("<div>" + "</div>");
        $("#toSort div:last").addClass("row " + schoolList[i]);
        $("#toSort .row:last").append("<h3>" + schoolList[i] + "</h3>");

        //same thing but for the sorted side
        $("#sorted").append("<div>" + "</div>");
        $("#sorted div:last").addClass("row " + schoolList[i]);
        $("#sorted .row:last").append("<h3>" + schoolList[i] + "</h3>");
    };

    var numberOfBillsToSort = 0; 
    var numberOfBillsSorted = 0;

    //adding bills based on the school
    sortedBills.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        //if the bill has been sorted show it but don't let it do anything else
        if (bill.billLocation == "not yet sorted") {
            numberOfBillsToSort += 1;
            $("div#toSort div.row." + bill.school).append("<button>" + bill.billTitle + "</button>");
            $("div#toSort button").addClass("btn btn-default");

            $("div#toSort button:last").click(function() {
                
                //create an option to put a bill either in Upper or Premier
                $("<select>" + "</select>").insertAfter(this).addClass("division");
                $("select.division").append("<option>" + "Select a Division" + "</option>");
                $("select.division").append("<option>" + "Upper" + "</option>");
                $("select.division").append("<option>" + "Premier" + "</option>");

                $("select.division").change(function() {
                    
                    //create an option to sort the bill to the right committee
                    $("<select>" + "</select>").insertAfter("select.division");
                    $("select:last").addClass("committee");
                    $("select.committee").append("<option>" + "Select a Committee" + "</option>");

                    committeList = ["Criminal Justice", "Education", "Environmental", "General Issues", "Healthcare and Human Services", "Transportation"];
                    for (var i = 0; i < committeList.length; i++) {
                        $("select.committee").append("<option>" + committeList[i] + "</option>");
                    };

                    //create a submit button
                    $("select.committee").change(function() {
                        var committee = $("select.committee").val()
                        var division = $("select.division").val();
                        $("<button>" + "Place Bill in Committee" + "</button>").insertAfter("select.committee").addClass("btn btn-primary submit");

                        $("button.submit").click(function() {
                            billClicked = "a-bill-to" + $(this).parent().text().split("a-bill-to")[1].split("Select")[0];
                            alert(billClicked);
                            sortedBills.on("child_added", function(snapshot) {
                                var bill = snapshot.val();
                                var thisBillID = bill.id;

                                if (billClicked == bill.billTitle) {
                                    alert("You are moving [" + billClicked + "] in [" + committee + "]");

                                    //build a new instance of firebase specifically for this bill using its unique ID
                                    //billInfo = new Firebase(sortedBills + "/" + thisBillID);
                                    sortedBills.child(thisBillID).update({
                                        "billLocation": committee,
                                        "billStatus": "on the docket",
                                        "division": division,
                                    });
                                };
                            });
                            $(this).siblings("button").addClass("disabled");

                            window.location.reload();
                        });
                    });
                });
            });
        } else {
            numberOfBillsSorted += 1;
            $("div#sorted div.row." + bill.school).append("<button>" + bill.billTitle + "</button>");
            $("div#sorted button").addClass("btn btn-default disabled");
        };

        //updating the number of bills taken care of
        $("div.col-md-5:first h2").html("To Sort [" + numberOfBillsToSort + "]");
        $("div.col-md-5:last h2").html("Sorted [" + numberOfBillsSorted + "]");
    });
});
