var sortedBills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    var chamberName = "Governor Desk";
    console.log(chamberName);

    sortedBills.on("child_added", function(snapshot) {
        //running through all the bills to find their location
        var bill = snapshot.val();

        var toSignStatus = "To Be Signed by the Governor"; 
        var signedStatus = "Signed By the Governor";
        var vetoedStatus = "Vetoed by the Governor";
       
        if (bill.billLocation == chamberName) {
            $("#realTime").append("<button class='btn btn-default' id='bill'>" + bill.billTitle + " {" + bill.governorEvaluation + "}" + "</button><br>");

            $("button#bill:last").click(function() {
                $(this).addClass("form-inline");
                $("<button class='btn btn-success'>" + "Sign into Law" + "</button>").insertAfter($(this));
                $("<button class='btn btn-danger'>" + "Veto" + "</button>").insertAfter("button.btn-success");
                $("<button class='btn btn-default' id='read'>" + "Read" + "</button>").insertAfter("button.btn-danger");

                //show bill when button is clicked
                $("button#read:last").click(function() {
                    //var billClicked = $("#bill").text();
                    var billClicked = $(".form-inline").text();
                    var billClicked = billClicked.replace(" {in favor}", "");
                    var billClicked = billClicked.replace(" {in opposition", "");
                    console.log(billClicked);
                    sortedBills.on("child_added", function(snapshot) {
                        var bill = snapshot.val();
                        var thisBillID = bill.id;
                        if (billClicked == bill.billTitle) {
                            showBill(thisBillID);
                        };
                    });

                    window.location.reload();
                });

                //open up a tab and show the bill
                var showBill = function(a) {
                    billInfo = new Firebase(sortedBills + "/" + a);
                    billInfo.on("value", function(snapshot) {
                        //variables to build the html file
                        var jquery1 = "<script src=" + "//code.jquery.com/jquery-1.11.3.min.js" + "></script>";
                        var jquery2 = "<script src=" + "//code.jquery.com/jquery-migrate-1.2.1.min.js" + "></script>";
                        var firebase = "<script src=" + "https://cdn.firebase.com/js/client/2.2.6/firebase.js" + "></script>";
                        var bootstrap = "<link rel='stylesheet', href='../../stylesheets/bootstrap/bootstrap.min.css'>";
                        var bill = snapshot.val();
                        var billText = bill.billText
                        var page = window.open();
                        page.document.write(
                            "<!DOCTYPE html><html><head>" + 
                            jquery1 + jquery2 + firebase + bootstrap + 
                            "</head><body>" +
                            "<div class=" + "container" + ">" + 
                            "<h1 class=" + "text-center" + ">" + bill.billTitle + "</h1>" +
                            "<h3 class=" + "text-center" + ">" + "BE IT HEREBY ENACTED BY THE YMCA MODEL LEGISLATURE OF SOUTH CAROLINA" + "</h3>" +
                            "<div class=" + "container" + ">" +
                            "<div class=" + "row" + ">" +
                            "<p>" + billText.replace("[n]", "<br>") + "</p></div>" +
                            "</div></div></body></html>"
                        );
                    });
                };

                //after making buttons changing the bill status based on which button was clicked
                $("button.btn-success").click(function() {
                    var thisBillID = bill.id;
                    sortedBills.child(thisBillID).update({
                        "billStatus": toSignStatus,
                        "billLocation": "passed legislation", 
                    });

                    $(this).next().hide();
                    $(this).hide();

                    window.location.reload();
                });

                $("button.btn-danger").click(function() {
                    var thisBillID = bill.id;
                    sortedBills.child(thisBillID).update({
                        "billStatus": vetoedStatus,
                        "billLocation": "vetoed legislation",
                    });

                    $(this).prev().hide();
                    $(this).hide();

                    window.location.reload();
                });
            });
        } else {
            switch (bill.billStatus) {
                case toSignStatus:
                    $("#toSign").append("<button class='btn btn-default' id='sign'>" + bill.billTitle + "</button><br>");
                    $("button#sign:last").click(function() {
                        $(this).addClass("form-inline");
                        $("<button class='btn btn-success'>" + "Signed" + "</button>").insertAfter($(this));
                        $("button.btn-success").click(function() {
                            var thisBillID = bill.id;
                            sortedBills.child(thisBillID).update({
                                "billStatus": signedStatus,
                            });

                            window.location.reload();
                        });
                    });
                    break;
                case signedStatus: 
                    $("#signed").append("<button class='btn btn-default disabled'>" + bill.billTitle + "</button><br>");
                    break;
                case vetoedStatus: 
                    $("#vetoed").append("<button class='btn btn-default disabled'>" + bill.billTitle + "</button><br>");
                    break;
            };
        };
    });
});

