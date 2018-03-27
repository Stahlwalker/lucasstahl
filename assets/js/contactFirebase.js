// Initialize Firebase
var config = {
    apiKey: "AIzaSyABch8e624hO8-eyPXzM6yiyWoONt_GNLc",
    authDomain: "fantasyfootball-6cbb7.firebaseapp.com",
    databaseURL: "https://fantasyfootball-6cbb7.firebaseio.com",
    projectId: "fantasyfootball-6cbb7",
    storageBucket: "fantasyfootball-6cbb7.appspot.com",
    messagingSenderId: "952687201149"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding Trains
$("#submit1").on("click", function(event) {
    console.log("submit")

    event.preventDefault();
    // Get inputs
    var firstName = $("#fname").val().trim();
    var lastName = $("#lname").val().trim();
    var email = $("#email").val().trim();
    var country = $("#country").val().trim();
    var subject = $("#subject").val().trim();

    // Creates local "temporary" object for holding message data
    var newMessage = {
        name1: firstName,
        name2: lastName,
        emailAddress: email,
        location: country,
        note: subject
    };

    // Uploads train data to the database
    database.ref().push(newMessage);

      // Logs everything to console
      console.log(newMessage.name1);
      console.log(newMessage.name2);
      console.log(newMessage.emailAddress);
      console.log(newMessage.location);
      console.log(newMessage.note);

    // Alert
    alert("You message has been sent");
    console.log(alert);

        $("#fname").val("");
        $("#1name").val("");
        $("#email").val("");
        $("#country").val("");
        $("#subject").val("");

    });


    database.ref().on("child_added", function (childSnapshot, prevChildkey) {

        console.log(childSnapshot.val());
    
        // Store everything into a variable.

        var firstName = childSnapshot.val().name1;
        var lastName = childSnapshot.val().name2;
        var email = childSnapshot.val().emailAddress;
        var country = childSnapshot.val().location;
        var subject = childSnapshot.val().note;
    
        console.log(firstName);
        console.log(lastName);
        console.log(email);
        console.log(country);
        console.log(subject);
    
        // Append train info to table on page
        // $("#train-table > tbody").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" + frequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");
    
    
    });
    

    $("#submit1").on("click", function (event) {
        $("#fname").val("");
        $("#1name").val("");
        $("#email").val("");
        $("#country").val("");
        $("#subject").val("");

    });

    // Firebase not working???
    
