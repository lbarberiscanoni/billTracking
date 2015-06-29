var fireData = new Firebase("https://yig-bill-tracker.firebaseio.com");

$(document).ready(function() {

    $("#school").change(function() {
        var school = $("#school").val();
        var schoolList = new Firebase(fireData + "/" + school);

        $("div.container").append("<select>" + "</select>");
        $("select:last-of-type").attr("id", "authorName");

        schoolList.orderByValue().on("value", function(snapshot) {

            $("select").append("<option>" + "select an author" + "</option>");

            snapshot.forEach(function(data) {
                authorName = data.key(); 
                $("select").append("<option>" + authorName + "</option>");
            });
        });

        $("#authorName").change(function() {
            var authorName = $("#authorName").val();
            var billInfo = new Firebase(fireData + "/" + school + "/" + authorName);

            $("div.container").append("<select>" + "</select>");
            $("select:last-of-type").attr("id", "billInfo");

            billInfo.orderByValue().on("value", function(snapshot) {

                $("select").append("<option>" + "select a option" + "</option>");

                snapshot.forEach(function(data) {
                    billInfo = data.key();
                    $("#billInfo").append("<option>" + billInfo + "</option>");
                });
            });

            $("#billInfo").change(function() {

                  var billInfo = $("#billInfo").val();

                  $("div.container").append("<input>" + "</input>");
                  $("input").attr("type", "text");
                  $("input").attr("placeholder", "enter new " + billInfo);
                  $("input").attr("id", "dataChange");

                  $("div.container").append("<input>" + "</input>");
                  $("input:last-of-type").attr("type", "button");
                  $("input:last-of-type").attr("value", "submit change");
                  $("input:last-of-type").attr("id", "submitChange");

                  $("#submitChange").click(function() {

                  var school = $("#school").val();
                  var authorName = $("#authorName").val();
                  var firstPath = fireData.child(school)
                  var billInfo = $("#billInfo").val();
                  var change = $("#dataChange").val();

                  alert("You are changing the [" + billInfo + "] of [" + authorName + "] to [" + change + "]");

                  if (billInfo == "billTitle") {
                    firstPath.child(authorName).update({
                    billTitle: change
                  });
                  } else if (billInfo == "section1") {
                    firstPath.child(authorName).update({
                    section1: change
                  });
                  } else if (billInfo == "section2") {
                    firstPath.child(authorName).update({
                    section2: change
                  });
                  } else if (billInfo == "section3") {
                    firstPath.child(authorName).update({
                    section3: change
                  });
                  } else if (billInfo == "section4") {
                    firstPath.child(authorName).update({
                    section4: change
                  });
                  } else if (billInfo == "section5") {
                    firstPath.child(authorName).update({
                    section5: change
                  });
                  } else {
                    alert("ERROR!!!!")
                  };

                   window.location.reload();
                });
            });
        });
   });
});
