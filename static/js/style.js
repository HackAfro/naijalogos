/**
 * Created by Afro on 12/19/2016.
 */
function main() {
   
   $(document).on('click','#rotate', function(){
       
       $('.ui.left.sidebar')
           .sidebar({
              dimPage: true,
            transition: 'overlay',
            exclusive: false,
            closable: true
       })
           .sidebar('toggle');
   })

   $('.ui.accordion')
    .accordion()
   ;
  $(document).on('click','.ui.styled.accordion', function(){

    $('.ui.styled.accordion').accordion()
  })

}
$(document).ready(main);