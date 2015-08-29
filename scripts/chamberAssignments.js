var schoolList = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList");
var billList = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    schoolList.on("child_added", function(snapshot) {
        var school = snapshot.val();
        $("#peopleToBeAssigned").append("<div class='row'><h3>" + school.name + "</h3></div>");
        $(".row:last").attr("id", school.name);
        billList.on("child_added", function(snapshot) {
            bill = snapshot.val();
            if (bill.authorLocation == "not yet assigned") {
                if (bill.school == school.name) {
                    var billID = bill.id;
                    $("<button class='btn btn-default' id='author'>" + bill.authorID + "</button>").insertAfter("#peopleToBeAssigned #" + bill.school + " h3").click(function() {
                        $("<div class='col-md-3'></div>").insertAfter(this);
                        $(".col-md-3:last").append("<select class='form-control' id='chamber'>" + "</select>");
                        $("select.form-control:last").append("<option>" + "Assign to Chamber" + "</option>");
                        chamberList = ["Criminal Justice", "Education", "Environmental", "General Issues", "Healthcare and Human Services", "Transportation", "Premier House", "Premier Senate", "House", "Senate"];
                        for (i = 0; i < chamberList.length; i++) {
                            $("select.form-control:last").append("<option>" + chamberList[i] + "</option>");
                        };
                        $("#chamber").change(function() {
                            var selectedChamber = $("#chamber").val();
                            billList.child(billID).update({
                                "authorLocation": selectedChamber,
                            });
                            window.location.reload();
                        });
                    });
                };
            };
        });
    });
});
