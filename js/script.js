//front-end
$(document).ready(function(){
    $("#blanks form").submit(function(event){
        var email= $("input#email").val();
        $(".input1").text(email);
        $("#showing").show();
        event.preventDefault();
    });
});
function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}


function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
