function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:3333/api/login",
        data: JSON.stringify({
            email,
            password
        }),
        contentType: 'application/json',
        async:true,
        crossDomain:true,
        dataType : 'json',
        xhrFields: {withCredentials: true},
        success: function( responseData ){
            //console.log(responseData, "User has been logged in");
            localStorage.setItem("accessToken", responseData.loginInfo.accessToken);
            window.location.replace("http://127.0.0.1:5500/homepage.html");
        },
        error: function(xhr, error) {
            console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
        },
    });
}
