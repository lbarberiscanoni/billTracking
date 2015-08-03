var bills = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {
    $("#schoolName").change(function() {
        var schoolName = $("#schoolName").val();
        var billAuthors = [];
        bills.on("child_added", function(snapshot) {
            var billAuthor = snapshot.val();
            if (billAuthor.school == schoolName) {
                billAuthors.push(billAuthor.authorID);
                console.log(billAuthors);
            };
        });

        var getInfo = function(a) {
            var authorSearched = a.toString();
            
            bills.on("child_added", function(snapshot) {
                person = snapshot.val();
                if (person.authorID == authorSearched) {
                    $("#message").html("<h3>" + authorSearched.split("-").join(" ") + "'s bill is: </h3><blockquote> Status: " + person.billStatus + "<br> Location: " + person.billLocation + "</blockquote>");
                    $("h3:last").addClass("text-center");
                    $("blockquote").addClass("text-center");
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
