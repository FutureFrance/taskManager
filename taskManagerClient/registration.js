function registration() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordRepeat = document.getElementById("repeat_password").value;

    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3333/api/registration',
        data: JSON.stringify({
            email,
            password,
            repeatPass: passwordRepeat,
        }),
        contentType: 'application/json',
        async:true,
        dataType : 'json', 
        success: function( responseData ){
            //console.log(responseData, "User has been registered");
            window.location.replace("http://127.0.0.1:5500/login.html"); 
        },
        error: function(xhr, status, error) {
            console.log(`xhr-respone: ${xhr.responseText}\nStatus: ${xhr.status}\nError: ${error}`);
        },
    });
}