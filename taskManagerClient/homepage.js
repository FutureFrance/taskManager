function getData() {
    console.log("Rendering the data....")
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3333/api/home',
        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
        xhrFields: {withCredentials: true},
        success: function( responseData ){
            //console.log(responseData);
            renderData(responseData.tasks);
        },
        error: function(xhr, error) {
            //console.log("Error getting the data...");
           // console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
            refreshAccessToken(xhr.status);
        },
    });
}

function renderData(data) {
    let taskDone = ""
    
    document.body.innerHTML = 
    ` <p>Task Manager</p>
    <div class="createTask_form">
        <input id="input_task" type="text" placeholder="Enter a task to do">
        <button onclick="createTask()">Submit</button>
    </div>

    <table id="taskTabel">
    </table>`

    for (let i = 0; i < data.length; i++) {
        if (data[i].isCompleted === true) {
            taskDone = `style="text-decoration: line-through 13% red"`;
        } 
        document.getElementById("taskTabel").innerHTML += 
        `<tr id="${data[i]._id}" class="tabelRow">
            <td class="tabelCell" ${taskDone}>${data[i].taskContent}</td>
            <td> 
                <button onclick="setTaskContent('${data[i].taskContent}')" class="modifyButton">
                    <a class="modifyLink" href="http://127.0.0.1:5500/editTask.html?taskId=${data[i]._id}">Modify</a>
                </button>
                <button class="deleteTask" onclick="deleteTask('${data[i]._id}')">Delete</button>
            </td>
        </tr>`
        taskDone = ""
    }
}

function setTaskContent(taskContent) {
    localStorage.setItem("taskContent", taskContent);
}

function verifyAuth() {
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3333/api/auth',
        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
        xhrFields: {withCredentials: true},
        success: function( responseData ){
            console.log(responseData);
            getData();
        },
        error: function(xhr, error) {
            //console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
            //console.log("calling to refresh tokens")
            refreshAccessToken(xhr.status);
        },
    });
}

function createTask() {
    const taskContent = document.getElementById("input_task").value;

    $.ajax ({
        type: 'POST',
        url: "http://127.0.0.1:3333/api/createTask",
        data: JSON.stringify({
            taskContent
        }),
        contentType: 'application/json',
        async:true,
        dataType : 'json', 
        crossDomain:true,
        xhrFields: {withCredentials: true},
        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
        success: function( responseData ){
            //console.log(responseData, "congrats task has been created");
            addTaskToTable(responseData.task);
        },
        error: function(xhr, error) {
            //console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
            refreshAccessToken(xhr.status);
        },
    });
}

function deleteTask(taskId) {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3333/api/deleteTask",
        data: JSON.stringify({
            taskId
        }),
        contentType: "application/json",
        async: true,
        dataType : 'json', 
        crossDomain:true,
        xhrFields: {withCredentials: true},
        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
        success: function (responseData) {
            //console.log(responseData);
            document.getElementById(taskId).remove();
        },
        error: function(xhr, error) {
            //console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
            refreshAccessToken(xhr.status);
        },
    })
}

function addTaskToTable(responseData) {
    let taskDone = ""

    if (responseData.isCompleted === true) {
        taskDone = `style="text-decoration: line-through;"`
    } 
 
    document.getElementById("taskTabel").innerHTML += 
    `<tr id="${responseData._id}" class="tabelRow">
        <td class="tabelCell" ${taskDone}>${responseData.taskContent}</td>
        <td>
            <button class="modifyButton">
                <a class="modifyLink" href="http://127.0.0.1:5500/editTask.html?taskId=${responseData._id}">Modify</a>
            </button>
            <button class="deleteTask" onclick="deleteTask('${responseData._id}')">Delete</button>
        </td>
    </tr>`
    //console.log(responseData)
}

function refreshAccessToken(status) {
    if (status === 401) {
        console.log("trying to refresh tokens...")
        $.ajax({
            type: 'GET',
            url: "http://127.0.0.1:3333/api/refreshToken",
            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
            xhrFields: {withCredentials: true},
            success: function (responseData) {
                //console.log(responseData);
                localStorage.setItem("accessToken", responseData.accessToken);
                getData();
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