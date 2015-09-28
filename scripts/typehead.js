var bills = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");

$(document).ready(function() {
    $("#schoolName").change(function() {
        var schoolName = $("#schoolName").val();
        var billAuthors = [];
        bills.on("child_added", function(snapshot) {
            var billAuthor = snapshot.val();
            if (billAuthor.school == schoolName) {
                billAuthors.push(billAuthor.author1);
                billAuthors.push(billAuthor.author2);
                console.log(billAuthors);
            };
        });

        var getInfo = function(a) {
            var authorSearched = a.toString();
            
            bills.on("child_added", function(snapshot) {
                person = snapshot.val();
                if (person.author1 == authorSearched || person.author2 == authorSearched) {
                    $("#message").html("<div class='searchedAuthor'><h3>" + authorSearched.split("-").join(" ") + "'s bill</h3></div><div class='searchedAuthorInfo'><h5> STATUS: " + person.billStatus + "</h5><h5> LOCATION: " + person.billLocation + "</h5></div>");
                    //add a class to change the color of the header depending on the status of the bill
                    if ((person.billStatus).indexOf("on") > -1) {
                        $(".searchedAuthor").addClass("onDocket");
                    } else if ((person.billStatus).indexOf("passed") > -1) {
                        $(".searchedAuthor").addClass("passed");
                    } else if ((person.billStatus).indexOf("failed") > -1) {
                        $(".searchedAuthor").addClass("failed");
                    } else {
                        console.log("error the person searched's bill is neither on the docket, passed or failed. Maybe on Governor's desk?");
                    };
                };
            });
        };

        $("#search-form").autocomplete({
                hints: billAuthors,
                width: 300,
                height: 30,
                onSubmit: function(text){
                    getInfo(text);
                }
        });
    });
});
