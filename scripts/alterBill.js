var fireData = new Firebase("https://yig-bill-tracker.firebaseio.com/bills");
var listOfSchoolsFromDB = new Firebase("https://yig-bill-tracker.firebaseio.com/schooList");

$(document).ready(function() {
    listOfSchoolsFromDB.on("child_added", function(snapshot) {
        var school = snapshot.val();
        var schoolName = school.name;

        $("#school").append("<option>" + schoolName + "</option>");
    });

    $("#school").change(function() {
        var school = $("#school").val();

        $("div.container").append("<select>" + "</select>");
        $("select:last").attr("id", "authorName");
        $("select#authorName").addClass("form-control");
        $("select#authorName").append("<option>" + "select an author" + "</option>");

        fireData.on("child_added", function(snapshot) {
            var bill = snapshot.val();
            if (bill.school == school) {
                $("select").append("<option>" + bill.authorID + "</option>");
                
            } else {
                console.log("false")
            };
        });

        $("#authorName").change(function() {
            var authorName = $("#authorName").val();

            $("div.container").append("<select>" + "</select>");
            $("select:last").attr("id", "areaOfChange");
            $("select#areaOfChange").addClass("form-control");
            $("select#areaOfChange").append("<option>" + "select what to change" + "</select>");
            
            billInfo = ["authorID", "billLocation", "billStatus", "division", "school", "billTitle", "section1", "section2", "section3", "section4", "section5"]
            for (i = 0; i < billInfo.length; i++) {
                $("select#areaOfChange").append("<option>" + billInfo[i] + "</option>");
            };

            $("#areaOfChange").change(function() {
                var areaOfChange = $("#areaOfChange").val();

                fireData.on("child_added", function(snapshot) {
                    var bill = snapshot.val();
                    if (bill.authorID == authorName) {
                        //making a conditional sequence to correspond the value of the change to the particular data key in Firebase
                        if (areaOfChange == "authorID") {
                            var currentVersion = bill.authorID;
                        } if (areaOfChange == "billLocation") {
                            var currentVersion = bill.billLocation;
                        } if (areaOfChange == "billStatus") {
                            var currentVersion = bill.billStatus;
                        } if (areaOfChange == "division") {
                            var currentVersion = bill.division;
                        } if (areaOfChange == "school") {
                            var currentVersion = bill.school;
                        } if (areaOfChange == "billTitle") {
                            var currentVersion = bill.billTitle;
                        } if (areaOfChange == "section1") {
                            var currentVersion = bill.section1;
                        } if (areaOfChange == "section2") {
                            var currentVersion = bill.section2;
                        } if (areaOfChange == "section3") {
                            var currentVersion = bill.section3;
                        } if (areaOfChange == "section4") {
                            var currentVersion = bill.section4;
                        } if (areaOfChange == "section5") {
                            var currentVersion = bill.section5;
                        } else {
                            console.log("change not possible");
                        };

                        //first let's show the current version
                        $("<h4>" + "The Current " + areaOfChange + " is:" + "</h4>").insertAfter("#areaOfChange");
                        $("<p>" + currentVersion + "</p>").insertAfter("h4");
                        $("<h4>" + "Make the Change:" + "</h4>").insertAfter("p");

                        //then let's make an input to change things
                        if (areaOfChange == "authorID") {
                            $("<input>" + "</input>").insertAfter("h4:last");
                            $("input").attr("id", "alteration");
                            $("input#alteration").attr("type", "text");
                            $("input#alteration").attr("placeholder", "enter a new author name");
                        } else if (areaOfChange == "billLocation") {
                            $("<select>" + "</select>").insertAfter("h4:last");
                            $("select:last").attr("id", "alteration");
                            $("select#alteration").append("<option>" + "select a new bill location" + "</option>");

                            chambers = ["Criminal Justice", "Education", "Environmental", "General Issues", "Healthcare and Human Services", "Transportation", "Premier House", "Premier Senate", "House", "Senate", "Governor Desk"];
                            for (i = 0; i < chambers.length; i++) {
                                $("select#alteration").append("<option>" + chambers[i] + "</option>");
                            };
                        } else if (areaOfChange == "billStatus") {
                            alert("for now we do not let you change a bill's status from here");
                            window.location.reload();
                        } else if (areaOfChange == "division") {
                            $("<select>" + "</select>").insertAfter("h4:last");
                            $("select:last").attr("id", "alteration");
                            $("select#alteration").append("<option>" + "select a new division" + "</option>");

                            divisionList = ["Upper", "Premier"];
                            for (i = 0; i < divisionList.length; i++) {
                                $("select#alteration").append("<option>" + divisionList[i] + "</option>");
                            };
                        } else if (areaOfChange == "school") {
                            $("<select>" + "</select>").insertAfter("h4:last");
                            $("select:last").attr("id", "alteration");
                            $("select#alteration").append("<option>" + "select a new school" + "</option>");

                            schoolList = ["Riverside", "Southside", "Eastside", "Christ-Church", "Porter-Gaud", "Mauldin", "Blufton", "JL-Mann"];
                            for (i = 0; i < schoolList.length; i++) {
                                $("select#alteration").append("<option>" + schoolList[i] + "</option>");
                            };
                        } else if (areaOfChange == "billTitle") {
                            $("<label>" + "A Bill to" + "</label>").insertAfter("h4:last");
                            $("<input>" + "</input>").insertAfter("label");
                            $("input").attr("id", "alteration");
                            $("input#alteration").attr("placeholder", "enter a new bill title");
                        } else if (areaOfChange == "section1" || "section2" || "section3" || "section4") {
                            $("<textarea>" + "</textarea>").insertAfter("h4:last");
                            $("textarea").attr("id", "alteration");
                            $("textarea#alteration").addClass("form-control");
                            $("textarea#alteration").attr("placeholder", "amend this section of the bill");
                        } else if (areaOfChange == "section5") {
                            $("<input>" + "</input>").insertAfter("h4:last");
                            $("input").attr("id", "alteration");
                            $("input#alteration").attr("type", "date");
                            $("input#alteration").attr("placeholder", "enter a new bill title");
                        } else {
                            console.log("error in creating the change");
                        };

                        $("<br><br><button>" + "Submit Change" + "</button>").insertAfter("#alteration");
                        $("button:last").addClass("btn btn-lg btn-primary");
                        $("button:last").attr("id", "submit");

                        $("button#submit").click(function() {
                            var alteration = $("#alteration").val();
                            alert(alteration);
                            fireData.on("child_added", function(snapshot){
                                var bill = snapshot.val();
                                var thisBillID = bill.id;

                                if (bill.authorID == authorName) {
                                    if (areaOfChange == "authorID") {
                                        var newAuthorID = alteration.replace(/\s/g, "-");
                                        fireData.child(thisBillID).update({
                                            "authorID": newAuthorID,
                                        });
                                    } else if (areaOfChange == "billLocation") {
                                        fireData.child(thisBillID).update({
                                            "billLocation": alteration,
                                        });
                                    } else if (areaOfChange == "division") {
                                        fireData.child(thisBillID).update({
                                            "division": alteration,
                                        });
                                    } else if (areaOfChange == "school") {
                                        fireData.child(thisBillID).update({
                                            "school": alteration,
                                        });
                                    } else if (areaOfChange == "billTitle") {
                                        var newBillTitle = alteration.toLowerCase().replace(/\s/g, "-");
                                        fireData.child(thisBillID).update({
                                            "billTitle": newBillTitle,
                                        });
                                    } else if (areaOfChange == "section1") {
                                        fireData.child(thisBillID).update({
                                            "section1": alteration,
                                        });
                                    } else if (areaOfChange == "section2") {
                                        fireData.child(thisBillID).update({
                                            "section2": alteration,
                                        });
                                    } else if (areaOfChange == "section3") {
                                        fireData.child(thisBillID).update({
                                            "section3": alteration,
                                        });
                                    } else if (areaOfChange == "section4") {
                                        fireData.child(thisBillID).update({
                                            "section4": alteration,
                                        });
                                    } else {
                                        console.log("error in creating the change");
                                    };
                                } else {
                                    console.log("false");
                                };
                            });
                            window.location.reload();
                        });
                    } else {
                        console.log("false")
                    };
                });
            });
        });
    });
});
