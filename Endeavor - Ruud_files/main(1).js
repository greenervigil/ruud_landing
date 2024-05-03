$(document).ready(function() {
   navFunctions();       
});

function navFunctions(){

    $('#lavanav li a').click(function(){
        $('.steppanel').hide();
        var stepnumber = $(this).attr('href');
        $(stepnumber).show('fast');
        
        $('#lavanav').find('.current').removeClass('current');
        $(this).parent().addClass('current');
        
        return false;

    });
    
    $('#goto2, #btnBack2').click(function(){
        $('#step2btn').trigger('click');
    });
    
    $('#btnCalculate').click(function(){
        $('#step3btn').trigger('click');
    });
    
    $('#btnStartOver, #btnBack1').click(function(){
        $('#step1btn').trigger('click');
    });
    

}

function moveSlider(direction) {

   var slider = document.getElementById('incentive-list')
   var le = $("#incentive-list").position().left;

   if (direction == 'left' && le < -1) {
	   $("#incentive-list").animate({ left: "+=314" }, 500);
   }

   var res = (0 - $("#incentive-list").width()) + 500;
   if (direction == 'right' && le > res) {
	   $("#incentive-list").animate({ left: "-=314" }, 500)
   }

}
