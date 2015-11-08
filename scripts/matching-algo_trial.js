var attorneyData = new Firebase("https://yig-bill-tracker.firebaseio.com/attorneyData");
var judicialData = new Firebase("https://yig-bill-tracker.firebaseio.com/judicialData");
var listOfRounds = new Firebase("https://yig-bill-tracker.firebaseio.com/roundsInfo");

$(document).ready(function(){
	obtainMatch = function(judgesWhoPreside, judgesWhoScore, teams) { 
		/*
	//
	// In case a match is possible it returns array of strings with the possible matching in the folowing format:
	// {'pro': team1, 'con': team2, 'scoringJudge': possibleJudge, 'presidingJudge': presidingJudge}
	//	otherwise it returns
	// false	 -	of type boolean
	//
		*/ 
		// Matched contains an array of strings with the possible matching in the folowing format
		// [ team1, team2, scoringJudge ]
		matched = {};

		// Whenever I found a match. I set the value of this variable to true so I can exit subsequent 
		// Iterations of the loops.
		breakFromAllFors = false;

		// List of all rounds. To be retrieved from firebase
		rounds = Array();

		$.ajax({
			url: 'https://yig-bill-tracker.firebaseio.com/roundsInfo/.json',
			contentType: 'json',
			// It is important that async is set to false becase that way my code
			// does not have to worry about variables not being defined.
			// and also I have to return a value from the function in synchronous time
			// which would be impossible if set to true.
			async: false,
			complete: function(dataR) {
				// Obtain all of the previous rounds
				data = dataR['responseJSON'];
				roundsIds = Object.keys(data);
				roundsRaw = Array();
				for (var i=0; i<roundsIds.length; i++) {
					roundsRaw.push(data[roundsIds[i]]);
				}
				roundsOrdered = Array();

				// Sort of all of the rounds from smallest to biggest
				//using bubble sort, according to their key 'index'
				needsSorting = true;
				// Bubble Sort
				while(needsSorting==true) {
					needsSorting = false;
					for (var i=0; i<roundsIds.length-1; i++) {
						// console.log(Object.keys(roundsRaw));
						if(roundsRaw[i]['index'] > roundsRaw[i+1]['index']) {
							temporaryHolder = roundsRaw[roundsIds[i]].index;
							roundsRaw[i]['index'] = roundsRaw[i+1]['index'];
							roundsRaw[i+1]['index'] = temporaryHolder;
							needsSorting = true;
						}
					}
				}
				rounds = roundsRaw;

				// Loops until it finds two people who can match.
				for(var i = 0; i < teams.length; i++) {
					team1 = teams[i][0];
					// // console.log("i: "+i.toString());
					for (var j=0; j < teams.length; j++) {
						team2 = teams[j][0];
						// If the schools are the same break.
						if(teams[i][1] == teams[j][1]) {
							continue
						}
						// // console.log("	j: "+j.toString());
						if (j==i) {
							// Cannot match a team with itself
							continue;
						}
						// Loop through all previous rounds to see if these two
						// teams have been together on the past
						breakTwice = false;
						for (var k = 0; k < judgesWhoScore.length; k++) {
							// // console.log("		k: "+k.toString());
							possibleJudge = judgesWhoScore[k];
							breakOnce = false;
							for (var v = 0; v < judgesWhoPreside.length; v ++){
								presidingJudge = judgesWhoPreside[v];
								presidingJudgeBreak = false;
								for (var h = 0; h < rounds.length; h++){
									// // console.log("			h: "+h.toString());
									round = rounds[h];
									if (
										( round['con'] == team1 && round['pro'] == team2 ) ||
										( round['con'] == team2 && round['pro'] == team1 )
										) {
										// // console.log("breaking because those teams have already competed");
										breakTwice = true;
										break;
									} // end of checking if they have competed before
									// Check whether this judge has ever been judging either team
									if (
										round['con'] == team1 || round['pro'] == team1 ||
										round['con'] == team2 || round['pro'] == team2
										) {
										if (round['presidingJudge'] == presidingJudge) {
											// // console.log("breaking because of scoring judge");
											presidingJudgeBreak = true;
											break;
										} // Yeah. This judge has judged one of the teams before
										if (round['scoringJudge'] == possibleJudge) {
											// // console.log("breaking because of scoring judge");
											breakOnce = true;
											break;
										} // Yeah. This judge has judged one of the teams before
									} // end of checking if the current looping round has one of the two posible matching teams.				
									//
									// If you have reached this point this means there is nothing
									// that could hold you from matching these teams with this judge
									//
									// // console.log(team1+ ", "+team2);
								} // end of looping through rounds
								if(breakOnce == true) {
									break;
								}
								if(breakTwice == true) {
									break;
								}
								if (presidingJudgeBreak == false) {
									breakFromAllFors = true;
									matched = {'pro': team1, 'con': team2, 'scoringJudge': possibleJudge, 'presidingJudge': presidingJudge};
								}
								if(breakFromAllFors == true) {
									break;
								}
							} // end of looping through the judges who could possibly preside
							if(breakTwice == true) {
								break;
							} // End of checking if those two teams can match.
							if (breakFromAllFors == true) {
								break;
							}
						} // End of looping through the possible judges
						if (breakFromAllFors == true) {
							break;
						}
					} // end of looping through the loop to find the second team
					if (breakFromAllFors == true) {
						break;
					}
				} // end of looping through the loop to find the first team
			} // End of complete function
		}); // End of ajax call
		if(breakFromAllFors == true) {
			team1 = matched['pro'];
			team2 = matched['con'];
			team1Status = "pro";
			team2Status = "con";
			for (var h = 0; h < rounds.length; h++){
				round = rounds[h];
				if (
					round['con'] == team1 || round['pro'] == team1 ||
					round['con'] == team2 || round['pro'] == team2
					) {
					if(round['con'] == team1) {
						team1Status = 'con';
					}
					if(round['pro'] == team1) {
						team1Status = 'pro';
					}
					if(round['con'] == team2) {
						team2Status = 'con';
					}
					if(round['pro'] == team2) {
						team2Status = 'pro';
					}
				} 
			} // end of looping through rounds
			function coinFlip() {
				return Math.floor(Math.random() * 2);
			}
			if(team1Status == team2Status) {
				// Make a random decision
				team1Status = ['pro','con'][parseInt(coinFlip())];
				if (team1Status == 'pro') {
					team2Status = 'con';
				} else {
					team2Status = 'pro';
				}
			} else if(team1Status != team2Status) {
				// Change
				temporaryStatus = team2Status;
				team2Status = team1Status;
				team1Status = temporaryStatus;
			}
			matched[team1Status] = team1;
			matched[team2Status] = team2;
			return matched;
		} else {
			return false;
		}
	} // End of obtain match

    // List of all judges. Make sure those specific strings are used when assigning judges to
    // the users
    //judgesWhoPresideFB = ["judge 1", "judge 2", "judge 3"];
    judgesWhoPresideFB = [];

    // List of all judges. Make sure those specific strings are used when assigning judges to
    // the users
    //judgesWhoScoreFB = ["judge 1", "judge 2", "judge 3"];
    judgesWhoScoreFB = [];
    judicialData.once("value", function(snapshot) {
        var totalNumberOfJudges = snapshot.numChildren();
        window.totalNumberOfJudges = totalNumberOfJudges;

        var numberOfJudgesLoopedThrough = 0;
        window.numberOfJudgesLoopedThrough = numberOfJudgesLoopedThrough;

        rawJudicialData = snapshot.val();
        keysOfData = Object.keys(rawJudicialData);

        for(var i = 0; i < keysOfData.length; i++){
        	var judge = rawJudicialData[keysOfData[i]];
        	if (judge.category == "Presider") {
                judgesWhoPresideFB.push(judge.judgeName);
            } else if (judge.category == "Scorer") {
                judgesWhoScoreFB.push(judge.judgeName);
            } else { 
                // console.log(judge.judgeName + " does not have a category");
            }

            if(i==keysOfData.length-1) {
            	attorneyData.once("value", function(attorneySnapshot) {
            		var rawAttorneyData = attorneySnapshot.val();
            		keysAttorneyData = Object.keys(rawAttorneyData);
            		teamsFB = []
            		for (var j = 0; j < keysAttorneyData.length; j++) {
            			var team = rawAttorneyData[keysAttorneyData[j]];
            			var teamInfo = [team.teamCode, team.schoolName];
            			teamsFB.push(teamInfo);
            		}
            		listOfRounds.once("value", function(roundsSnapshot) {
            			var numOfRounds = roundsSnapshot.numChildren();
              			var thisRoundIndex = numOfRounds + 1;
              			rawRoundsData = roundsSnapshot.val();
              			keysRoundData = Object.keys(rawRoundsData);
              			window.thisRoundIndex = thisRoundIndex;
              			for (var k = 0; k < keysRoundData.length; k++){
              				round = rawRoundsData[keysRoundData[k]];
              				prosecution = round.pro;
              				defense = round.con;
              				presider = round.presidingJudge;
              				scorer = round.scoringJudge;
              				$("#trial table").append("<tr><td>" + prosecution + "</td><td>" + defense + "</td><td>" + presider + "</td><td>" + scorer + "</td></tr>");
              			}
            		});
            	});
            }
        }
    });
});
