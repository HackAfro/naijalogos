/**
 * Created by Afro on 12/19/2016.
 */
function main() {

    $(document).on('click', '.ui.green.button', function () {
        $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
            $("#acc-imprest").slideUp(500);
        });
    })

    $(document).on('click', '.ui.green.basic.button', function () {
        $("#acc-imprest > p").text("Vendor remittance form approved!!")
        $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
            $("#acc-imprest").slideUp(500);
        });
    })

    $(document).on('submit', '#imForm', function () {
        $("#acc-imprest > p").text("Form sent!!. You'll be notified once it's accepted")
        $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
            $("#acc-imprest").slideUp(500);
        });
    })

    $(document).on('submit', '#veForm', function () {
        $("#acc-imprest > p").text("Form sent!!. You'll be notified once it's accepted")
        $("#acc-imprest").fadeTo(2000, 500).slideUp(500, function(){
            $("#acc-imprest").slideUp(500);
        });
    })


}
$(document).ready(main);