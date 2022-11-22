"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();


var submitBtn = document.getElementById("submitBtn");
var chatSection = document.getElementById("chatSection");
var addToGroup = document.getElementById("addToGroup");
var leaveChatbtn = document.getElementById("leaveChat");

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (username, message) {
    var li = ` 
                  <ul class="list-unstyled text-white">
                    <li class="d-flex justify-content-between mb-4">
                        <img src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" alt="avatar"
                             class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
                        <div class="card mask-custom">
                            <div class="card-header d-flex justify-content-between p-3"
                                 style="border-bottom: 1px solid rgba(255,255,255,.3);">
                                <p class="fw-bold mx-2">${username}</p>
                                <p class="text-light small mb-0" id='seconds-counter'><i class="far fa-clock"></i>Just now</p>
                            </div>
                            <div class="card-body">
                                <p class="mb-0" >
                                   ${message}
                                </p>
                            </div>
                        </div>
                    </li>  </ul>`;
    document.getElementById("messagesList").insertAdjacentHTML("afterbegin", li);
});

chatSection.style.display = "block"


connection.start().then(function () {
    if (localStorage.getItem("user")) {
        addToGroup.classList.add("d-none")
        chatSection.classList.remove("d-none")
    }

    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});




addToGroup.addEventListener("submit", (e) => {
    e.preventDefault();
    var user = {
        name: document.getElementById("userInput").value,
        group: document.getElementById("selectGroup").value
    }

    if (document.getElementById("userInput").value != "" && document.getElementById("selectGroup").value != "") {

        connection.invoke("AddToGroupAsync", user.group).catch(function (err) {
            return console.error(err.toString());
        })
        localStorage.setItem("user", JSON.stringify(user));
        ShowChatSection();
        document.getElementById("messagesList").innerHTML = "";

    }
    else {
        document.getElementById("groupError").innerHTML = "";
        var errorMessage = "Please select group"
        document.getElementById("userInput").placeholder = "Please enter username";
        document.getElementById("groupError").innerHTML = errorMessage;
    }
   
})

function ShowChatSection() {
    addToGroup.classList.add("d-none")
    chatSection.classList.remove("d-none")
}

function JoinGroupSection() {
    addToGroup.classList.remove("d-none")
    chatSection.classList.add("d-none")
}

leaveChatbtn.addEventListener("click", () => {
    var user = JSON.parse(localStorage.getItem("user"));

    connection.invoke("RemoveFromGroupAsync", user.group).catch((err) => {
        return console.error(err.toString());
    })

    document.getElementById("userInput").value = "";
    document.getElementById("selectGroup").value = "";
    document.getElementById("groupError").innerHTML = "";
    localStorage.removeItem("user");
    JoinGroupSection();
})

document.getElementById("sendButton").addEventListener("click", (event) => {

    var message = document.getElementById("messageInput").value;
    var user = JSON.parse(localStorage.getItem("user"));

    connection.invoke("SendMessage", user.name, message, user.group).catch((err) => {
        return console.error(err.toString());
    });
    document.getElementById("messageInput").value = "";
    event.preventDefault();
});