$(".in").on('input', function() {
  newSize = $(this).val().length;
  if (newSize > 0) {
    slide = $(this).parent().find(".slide").eq(0);
    slide.addClass("slide-up");
  } else if (newSize == 0) {
    slide = $(this).parent().find(".slide").eq(0);
    slide.removeClass("slide-up");
  }
  /* slide = $(this).parent().find(".slide").eq(0);
  if($(this).val()!=""){
    
  }*/
  //alert(prevSize);
  prevSize = newSize;
});
