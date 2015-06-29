var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    //create sections based on the schools
    schoolList = ["Riverside", "Southside", "Eastside", "Christ-Church", "Porter-Gaud", "Mauldin", "Blufton", "JL-Mann"];
    for (var i = 0; i < schoolList.length; i++) {
        $(".container").append("<div>" + "</div>");
        $("div:last").addClass("row");
        $(".row:last").append("<h3>" + schoolList[i] + "</h3>");
        $(".row:last").append("<div>" + "</div>");
        $("div:last").addClass(schoolList[i]);
    };

    //adding bills based on the school
    sortedBills.on("child_added", function(snapshot) {
        var bill = snapshot.val();
        $("div." + bill.school).append("<div class=" + bill.billTitle + "></div>");
        $("div." + bill.billTitle).append("<button>" + bill.billTitle + "</button>");
        $("div." + bill.billTitle + " button").addClass("btn btn-default " + bill.billTitle);

        //if the bill has been sorted show it but don't let it do anything else
        if (bill.billLocation == "not yet sorted") {
            $("button." + bill.billTitle).click(function() {
                
                //creat an option to put a bill either in Upper or Premier
                $("<select>" + "</select>").insertAfter("button." + bill.billTitle);
                $("div." + bill.billTitle + " select").addClass("division");
                $("div." + bill.billTitle + " select.division").append("<option>" + "Select a Division" + "</option>");
                $("div." + bill.billTitle + " select.division").append("<option>" + "Upper" + "</option>");
                $("div." + bill.billTitle + " select.division").append("<option>" + "Premier" + "</option>");

                $("select.division").change(function() {
                    
                    //create an option to sort the bill to the right committee
                    $("<select>" + "</select>").insertAfter("select.division");
                    $("div." + bill.billTitle + " select:last").addClass("committee");
                    $("div." + bill.billTitle + " select.committee").append("<option>" + "Select a Committee" + "</option>");

                    committeList = ["Criminal Justice", "Education", "Environmental", "General Issues", "Healthcare and Human Services", "Transportation"];
                    for (var i = 0; i < committeList.length; i++) {
                        $("div." + bill.billTitle + " select.committee").append("<option>" + committeList[i] + "</option>");
                    };

                    //create a submit button
                    $("select.committee").change(function() {
                        var committee = $("select.committee").val()
                        var division = $("select.division").val();
                        $("<button>" + "Place Bill in Committee" + "</button>").insertAfter("select.committee");
                        $("div." + bill.billTitle + " button:last").addClass("btn btn-primary submit");

                        $("button.submit").click(function() {
                            billClicked = $(this).parent().text().split("Se")[0];
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
            $("button." + bill.billTitle).addClass("disabled");
            $("button." + bill.billTitle).append(document.createTextNode(" [sorted]"));
        };
    });
});
