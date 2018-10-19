$(document).ready(function () {
  var x_timer;
  $("#UserName").keyup(function (e) {
    clearTimeout(x_timer);
    var user = { UserName: $(this).val() };
    var userString = JSON.stringify(user);
    console.log(userString);
    x_timer = setTimeout(function () { isAvailability(userString) }, 700);
  })

  function isAvailability(userString) {
    $.ajax({
      url: '/users/register',
      data: { user: userString },
      type: 'get',
      dataType: 'json'
    })
      .done(function (data) {
        console.log(data.status);
        if (data.status == "Available") {
          $('#message').html('<p>You can use this UserName</p>');
        }

        else {
          $('#message').html('<p>UserName already exists </p>');
        }
      });
  }
})