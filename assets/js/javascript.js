

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
            $("#winner").html(player_1_Name + " wins!" + "</br><img class='pointer' src='assets/images/point-left.jpg' />");

        },
    
        Winner2: function () {
            $("#winner").html(player_2_Name + " wins!" + "</br><img class='pointer' src='assets/images/point-right.jpg' />");
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

    
	database.ref().on("value", function (snapshot) {

		function playerDisconnect() {
			if (PlayerName != "") {

				if ((snapshot.child("players").child(1).exists()) && (PlayerName == snapshot.child("players").child(1).val().name)) {

					database.ref("/chat").onDisconnect().update({
						message: ((snapshot.child("players").child(1).val().name) + " has quit"),
						dateAdded: firebase.database.ServerValue.TIMESTAMP
					});

					database.ref("players/1").onDisconnect().remove();

				} else if ((snapshot.child("players").child(2).exists()) && (PlayerName == snapshot.child("players").child(2).val().name)) {

					database.ref("/chat").onDisconnect().update({
						message: ((snapshot.child("players").child(2).val().name) + " has quit"),
						dateAdded: firebase.database.ServerValue.TIMESTAMP
					});
					database.ref("players/2").onDisconnect().remove();

					database.ref("/turn").onDisconnect().remove();
				}
			}
		}


		if (((snapshot.child("players").child(1).exists()) == false)) {
			$("#player1waiting").html("Waiting for player 1");
			$("#winner").empty();
			$("#player1wins").empty();
			$("#player2losses").empty();
			$("#player1name").empty();
			$("#player-1").attr("style", "border: 5px solid white");
			$("#player-2").attr("style", "border: 5px solid white");

		};

		if (((snapshot.child("players").child(2).exists()) == false)) {
			$("#player2waiting").html("Waiting for player 2");
			$("#winner").empty();
			$("#win2").empty();
			$("#lose2").empty();
			$("#player2name").empty();
			$("#player-1").attr("style", "border: 5px solid white");
			$("#player-2").attr("style", "border: 5px solid white");
		};

		if ((snapshot.child("players").child(2).exists()) && ((snapshot.child("players").child(1).exists()) === false)) {
			$("#player2name").html(snapshot.child("players").child(2).val().name);
			$("#player1waiting").empty();
			$("#player-1").attr("style", "border: 5px solid white");
			$("#player-2").attr("style", "border: 5px solid white");
			hideGame();

			playerDisconnect();
		};

		if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)) {
			$("#player1waiting").empty();
			$("#player1name").html(snapshot.child("players").child(1).val().name);
			hideGame();

			playerDisconnect();

			if (PlayerName == snapshot.child("players").child(1).val().name) {
				$("#player-entry").html("<h2>" + snapshot.child("players").child(1).val().name + ", you are player 1</h2>");
				$("#player1wins").html("Wins: " + player_1_win);
				$("#player1losses").html("Losses: " + player_1_lose);
			}

		} else if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()))) {

			var databaseTurn = snapshot.child("turn").val();
			player_1_Name = snapshot.child("players").child(1).val().name;
			player_2_Name = snapshot.child("players").child(2).val().name;

			$("#player2waiting").empty();
			$("#player1waiting").empty();
			$("#player2name").html(snapshot.child("players").child(2).val().name);
			$("#player1name").html(snapshot.child("players").child(1).val().name);
			$("#player2wins").html("Wins: " + snapshot.child("players").child(2).val().win);
			$("#player2losses").html("Losses: " + snapshot.child("players").child(2).val().lose);
			$("#player1wins").html("Wins: " + snapshot.child("players").child(1).val().win);
			$("#player1losses").html("Losses: " + snapshot.child("players").child(1).val().lose);

			playerDisconnect();


			if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 1)) {
				$("#player-entry").html("<h2>It's your turn!</h2>");
				$("#player-1").attr("style", "border: 5px solid green");
				$("#player-2").attr("style", "border: 5px solid white");
				hideGame();
				$("#player1choices").attr("style", "visibility:visible");
				$("#rock1").html("ROCK");
				$("#paper1").html("PAPER");
				$("#scissors1").html("SCISSORS");
				$("#winner").empty();
			}

			if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 2)) { 
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid green");
				hideGame();
				$("#player1selection").attr("style", "visibility:visible");
				$("#player1selection").html("Pick: " + "<h2>" + player_1_Choice + "</h2>");
				$("#player-entry").html("<h2>It's " + player_2_Name + "'s turn</h2>");
			}


			if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 1)) {
				$("#player-entry").html("<h2>It's " + player_1_Name + "'s turn</h2>");
				$("#player-1").attr("style", "border: 5px solid green");
				$("#player-2").attr("style", "border: 5px solid white");
				hideGame();
				$("#winner").empty();
			}

			if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 2)) {
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid green");
				$("#player-entry").html("<h2>It's your turn!</h2>");
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
				$("#player1selection").html("Pick: " + "<h2>" + player_1_Choice + "</h2>");
				$("#player2selection").html("Pick: " + "<h2>" + player_2_Choice + "</h2>");


				CheckWinners.scoreCheck();

				newGameTimer = setTimeout(CheckWinners.resetTimer, 5 * 1000);
			}
		}
	});

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
				alert("Game lobby is full. Please try again later");
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


	$("#submit-message").on("click", function (event) {

		event.preventDefault();
		console.log(this);

		var messages = $("#message-input").val().trim();
		$("#message-input").val("");


		newMessage = PlayerName + ": " + messages;


		database.ref("/chat").update({
			message: newMessage,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	});


	database.ref("/chat").orderByChild("dateAdded").limitToLast(1).on("value", function (snapshot) {
		$("#chat-window").prepend("</br>" + snapshot.val().message + "</br>");
	});

});