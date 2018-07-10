

var config = {
    apiKey: "AIzaSyAXQ-PwWgW4zlotUCJjPtnGCbbxCkQdOLw",
    authDomain: "danhomoncikcodingbootcamp.firebaseapp.com",
    databaseURL: "https://danhomoncikcodingbootcamp.firebaseio.com",
    projectId: "danhomoncikcodingbootcamp",
    storageBucket: "danhomoncikcodingbootcamp.appspot.com",
    messagingSenderId: "844394469089"
};
firebase.initializeApp(config);

// database game variables
var database = firebase.database();
var PlayerName = '';
var player_1_Name = "";
var player_2_Name = "";
var player_1_Choice = "";
var player_2_Choice = "";
var player_1_win = 0;
var player_1_lose = 0;
var player_2_win = 0;
var player_2_lose = 0;
var turns = 1;
var newGameTimer;
var GameOver = false;

//database chat variable
var newMessage = "";


$(document).ready(function () {

//game operation
    var CheckWinners = {


        resetGame: function () {
            GameOver = false;
            turns = 1;
    
            database.ref().update({
                turn: turns
            });
        },
    
    
        resetTimer: function () {
            clearTimeout(newGameTimer);
            CheckWinners.resetGame();
        },
    
    
        Winner1: function () {
            $("#winner").html(player_1_Name + " wins!!");
        },
    
        Winner2: function () {
            $("#winner").html(player_2_Name + " wins!!");
        },
    
    
    
        updateScore: function () {
            database.ref("players/1").update({
                win: player_1_win,
                lose: player_1_lose,
            });
            database.ref("players/2").update({
                win: player_2_win,
                lose: player_2_lose,
            });
        },
    
    
        scoreCheck: function () {
    
            if (player_1_Choice == "rock" && player_2_Choice == "scissors") {
                player_1_win++;
                player_2_lose++;
                CheckWinners.Winner1();
                CheckWinners.updateScore();
            }
    
            if (player_1_Choice == "rock" && player_2_Choice == "paper") {
                player_1_lose++;
                player_2_win++;
                CheckWinners.Winner2();
                CheckWinners.updateScore();
            }
    
            if (player_1_Choice == "scissors" && player_2_Choice == "rock") {
                player_1_lose++;
                player_2_win++;
                CheckWinners.Winner2();
                CheckWinners.updateScore();
            }
    
            if (player_1_Choice == "scissors" && player_2_Choice == "paper") {
                player_1_win++;
                player_2_lose++;
                CheckWinners.Winner1();
                CheckWinners.updateScore();
            }
    
            if (player_1_Choice == "paper" && player_2_Choice == "rock") {
                player_1_win++;
                player_2_lose++;
                CheckWinners.Winner1();
                CheckWinners.updateScore();
            }
    
            if (player_1_Choice == "paper" && player_2_Choice == "scissors") {
                player_1_lose++;
                player_2_win++;
                CheckWinners.Winner2();
                CheckWinners.updateScore();
            }
    
            if (player_1_Choice == player_2_Choice) {
                $("#winner").html("It's a tie!");
            }
    
        }
    }



	$("#player-entry").html("<h2>Enter Your Name to Play</h2>" +
		"</br><input type='text' id='name-input'>" +
		"</br></br><button class = 'btn btn-default' input type='submit' id='submit-name'>Submit</button>");
	$("#player1waiting").html("Waiting for player 1");
	$("#player2waiting").html("Waiting for player 2");

 //toggle game functions to each player
	function hideGame() {
		$("#player1choices").attr("style", "visibility:hidden");
		$("#player2choices").attr("style", "visibility:hidden");
		$("#player1selection").attr("style", "visibility:hidden");
		$("#player2selection").attr("style", "visibility:hidden");
	}
	hideGame();

    
 //

			var databaseTurn = snapshot.child("turn").val();
			player_1_Name = snapshot.child("players").child(1).val().name;
			player_2_Name = snapshot.child("players").child(2).val().name;

			$("#player2waiting").empty();
			$("#player1waiting").empty();
			$("#player2name").html(snapshot.child("players").child(2).val().name);
			$("#player1name").html(snapshot.child("players").child(1).val().name);
			$("#player2wins").html("WIN: " + snapshot.child("players").child(2).val().win);
			$("#player2losses").html("LOSE: " + snapshot.child("players").child(2).val().lose);
			$("#player1wins").html("WIN: " + snapshot.child("players").child(1).val().win);
			$("#player1losses").html("LOSE: " + snapshot.child("players").child(1).val().lose);

	//		


			if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 1)) {
				$("#player-entry").html("<h2>Hello " + snapshot.child("players").child(1).val().name + ".  You are player 1!</h2>");
				$("#player-1").attr("style", "border: 5px solid yellow");
				$("#player-2").attr("style", "border: 5px solid white");
				hideGame();
				$("#player1choices").attr("style", "visibility:visible");
				$("#rock1").html("ROCK");
				$("#paper1").html("PAPER");
				$("#scissors1").html("SCISSORS");
				$("#winner").empty();
				$("#instruction").html("It's your turn!");
			}

			if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 2)) { 
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid yellow");
				hideGame();
				$("#player1selection").attr("style", "visibility:visible");
				$("#player1selection").html("Chose: " + "<h2>" + player_1_Choice + "</h2>");
				$("#instruction").html("Waiting for " + player_2_Name + " to choose...");
			}


			if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 1)) {
				$("#player-entry").html("<h2>Hello " + snapshot.child("players").child(2).val().name + ".  You are player 2!</h2>");
				$("#player-1").attr("style", "border: 5px solid yellow");
				$("#player-2").attr("style", "border: 5px solid white");
				$("#instruction").html("Waiting for " + player_1_Name + " to choose!!");
				hideGame();
				$("#winner").empty();
			}

			if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 2)) {
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 2px solid yellow");
				$("#instruction").html("It is your turn!");
				hideGame();
				$("#player2choices").attr("style", "visibility:visible");
				$("#rock2").html("ROCK");
				$("#paper2").html("PAPER");
				$("#scissors2").html("SCISSORS");
			}

			if (databaseTurn == 3 && GameOver == false) {
				GameOver = true;

				player_1_Choice = snapshot.child("players").child(1).val().choice;
				player_2_Choice = snapshot.child("players").child(2).val().choice;
				player_1_win = snapshot.child("players").child(1).val().win;
				player_1_lose = snapshot.child("players").child(1).val().lose;
				player_2_win = snapshot.child("players").child(2).val().win;
				player_2_lose = snapshot.child("players").child(2).val().lose;

				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");
				$("#player1choices").attr("style", "visibility:hidden");
				$("#player2choices").attr("style", "visibility:hidden");
				$("#player1selection").attr("style", "visibility:visible");
				$("#player2selection").attr("style", "visibility:visible");
				$("#player1selection").html("Chose: " + "<h2>" + player_1_Choice + "</h2>");
				$("#player2selection").html("Chose: " + "<h2>" + player_2_Choice + "</h2>");
				$("#instruction").empty();

				CheckWinners.scoreCheck();

				newGameTimer = setTimeout(CheckWinners.resetTimer, 5 * 1000);
			}
		//
	//

	$("#submit-name").on("click", function () {

		var username = $("#name-input").val().trim();

		PlayerName = username;
		console.log(username);


		database.ref().once('value').then(function (snapshot) {

			if ((snapshot.child("players").child(1).exists()) === false) {
				database.ref("players/1").set({
					name: username,
					win: player_1_win,
					lose: player_1_lose
				});

			} else if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)) {
				database.ref("players/2").set({
					name: username,
					win: player_2_win,
					lose: player_2_lose
				});
				database.ref().update({
					turn: turns,
				});

			} else if ((snapshot.child("players").child(1).exists()) && (snapshot.child("players").child(2).exists())) {
				alert("There are two players playing! Try again later!");
			}
		});
	});


	$(".choice1").on("click", function () {

		player_1_Choice = $(this).val();
		console.log(player_1_Choice);

		database.ref().once('value').then(function (snapshot) {

			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
			turns++;


			if ((PlayerName == snapshot.child("players").child(1).val().name)) {
				database.ref("players/1").update({
					choice: player_1_Choice,
				});

				database.ref().update({
					turn: turns
				});
			}
		});
	});

	$(".choice2").on("click", function () {

		player_2_Choice = $(this).val();
		console.log(player_2_Choice);

		database.ref().once('value').then(function (snapshot) {

			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
			turns++;


			if ((PlayerName == snapshot.child("players").child(2).val().name)) {
				database.ref("players/2").update({
					choice: player_2_Choice,
				});

				database.ref().update({
					turn: turns,
				});
			}
		});
	});

//


});