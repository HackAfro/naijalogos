/**
 * Created by Afro on 12/19/2016.
 */
function main() {

    $(document).on('click', '#rotate', function () {

        $('.ui.left.sidebar').sidebar({
            dimPage: false,
            transition: 'overlay',
            exclusive: true,
            closable: true
        }).sidebar('toggle');
    })

    $('.ui.accordion')
        .accordion()
    ;
    $(document).on('click', '.ui.styled.accordion', function () {

        $('.ui.styled.accordion').accordion()
    })

    $(document).on('click', '.ui.fluid.dropdown', function () {
        $('.ui.fluid.dropdown').dropdown()
    })

    $(window).scroll(function () {
        var scroll = $(window).scrollTop(); // how many pixels you've scrolled
        var os = $('.ui.masthead.segment').offset().top; // pixels to the top of div1
        var ht = $('.ui.masthead.segment').height(); // height of div1 in pixels
        // if you've scrolled further than the top of div1 plus it's height
        // change the color. either by adding a class or setting a css property
        if (scroll > os + ht) {
            $('#menu').removeClass('white')
            $('#menu').addClass('black')

        } else {
            $('#menu').removeClass('black')
            $('#menu').addClass('white')
        }
    });

}
$(document).ready(main);