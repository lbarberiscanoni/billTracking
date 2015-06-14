var billList = new Firebase("https://yig-bill-tracker.firebaseio.com");
var sortedBills = new Firebase("https://yig-bill-tracker2.firebaseio.com");
var chamberDockets = new Firebase("https://yig-bill-tracker3.firebaseio.com");

billList.on("value", function(snapshot) {
    sortedBills.update(snapshot.val());
});

$(document).ready(function() {
    sortedBills.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            school = data.key()
            billList = new Firebase(sortedBills + "/" + school);

            billList.orderByValue().on("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    author = data.key();
                    billTitle = data.val().billTitle;

                    //Setting up the container
                    $("div.container").append("<h3>" + school + "</h3>");
                    $("div.container").append("<div>" + "</div>");
                    $("div.container div:last-of-type").addClass(school);

                    //Adding the bill info
                    $("div." + school).append("<p>" + author + ": " + billTitle + "</p>");
                    $("div." + school).append("<select>" + "Select a Chamber" + "</select>");

                    //Making the chamber selection
                    $("select:last").addClass("selectpicker chamber");
                    $("select.chamber:last").append("<option>" + "Select a Chamber" + "</option>");
                    $("select.chamber:last").append("<option>" + "Premier" + "</option>");
                    $("select.chamber:last").append("<option>" + "Upper" + "</option>");

                    var makeChangeCallback = function(school) {
                        return function() {
                            $(this.closest("div")).append("<select>" + "Select a Comittee" + "</select>");
                            $("select:last-of-type").addClass("selectpicker committee");

                            var committeeList = ["Select a Committee", "Criminal Justice", "Education", "Envirorment", "Healthcare", "Transportation", "General Issues"];
                            for (var i = 0;  i < committeeList.length; i++) {
                                $("select.committee").append("<option>" + committeeList[i] + "</option>");
                            };

                            $("select.committee").change(function() {
                                var chamber = $(this).parent().find("select.chamber").val();
                                var committee = $(this).val();
                                $(this.closest("div")).append("<button>" + "Send to " + chamber + " " + committee + "</button>");
                                $("button").addClass("btn btn-default");

                                $("button").click(function() {
                                    var bill = $(this).parent().find("p").text();
                                    var name = bill.split(":")[0];
                                    var billTitle = bill.split(":")[1];
                                    chamberDockets.child(chamber).child(committee).set({
                                        author: name,
                                        school: school,
                                        title: billTitle,
                                    });
                                    $(this).parent().hide();
                                });
                            });
                       };
                    };
                    
                    $("select.chamber:last").change(makeChangeCallback(school));
                });
            });
        });
    });
});
