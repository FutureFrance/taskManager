const token = localStorage.getItem("accessToken");
const taskId = new URLSearchParams(window.location.search).get("taskId");

function verifyAuth() {
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:3333/api/auth",
        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
        xhrFields: {withCredentials: true},
        success: function (responseData) {
            //console.log(responseData);
            renderData();
        },
        error: function(xhr, error) {
            console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
            refreshAccessToken(xhr.status)
        }
    });
}

function renderData() {
    document.body.innerHTML = 
    
    ` <p> EDIT TASK</p>
    <div id="modifyForm">
        <div id="task">
            <h3>Task ID: </h3>
            <h3 id="taskId"> ${taskId}</h3>
        </div><br><br>

        <div id="taskContentRequest">
            <h3>Task Content:</h3>
            <input id="taskContent" type="text" placeholder="New Task Content..."><br><br>
        </div><br><br>

        <div id="completed">
            <h3>Completed:</h3>
            <input id="isCompleted" type="checkbox">
        </div><br><br><br>
    </div>
    
    <button onclick="modifyTask('${taskId}')">Save Changes</button>`
}

function modifyTask() {
    const taskContent = document.getElementById("taskContent").value;
    const isCompleted = document.getElementById("isCompleted").checked;

    if (taskContent === "" ) {
        return alert("task content is empty please fill the field")
    }
    console.log(taskContent, taskId, isCompleted)
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3333/api/modifyTask",
        data: JSON.stringify({
            taskContent,
            isCompleted,
            taskId
        }),
        contentType: "application/json",
        async: true,
        dataType: "json",
        crossDomain:true,
        xhrFields: {withCredentials: true},
        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
        success: function (responseData) {
            //console.log(responseData);
            window.location.assign(`http://127.0.0.1:5500/homepage.html`);
        },
        error: function(xhr, error) {
            console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
            alert("Error session expired please try again")
            refreshAccessToken(xhr.status);
        },
    });
}

function refreshAccessToken(status) {
    if (status === 401) {
        $.ajax({
            type: 'GET',
            url: "http://127.0.0.1:3333/api/refreshToken",
            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
            xhrFields: {withCredentials: true},
            success: function (responseData) {
                //console.log(responseData);
                localStorage.setItem("accessToken", responseData.accessToken);
                renderData();
            },
            error: function(xhr, error) {
                //console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
                window.location.replace("http://127.0.0.1:5500/login.html");
            }
        });
    }
}

window.onload = function() {
    verifyAuth();
}