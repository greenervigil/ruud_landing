$(document).ready(function () {
  /*if (window.location.href.indexOf("ruudcav2") > -1) {
    $('#ruud-country-select option[value=ca]').attr('selected','selected');
  } else if (window.location.href.indexOf("ruudv6") > -1)  {
    $('#ruud-country-select option[value=us]').attr('selected','selected');
  }*/
//   if (countryCode === "Canada") {
//     $('#ruud-country-select option[value=ca]').attr('selected','selected');
//   } else if (countryCode === "mea")  {
//     $('#ruud-country-select option[value=mea]').attr('selected','selected');
//   } else {
//     $('#ruud-country-select option[value=us]').attr('selected','selected');
//   }
  $("#ruud-country-select").change(function() {
    var option = $(this).find('option:selected');
    window.location.href = option.data("url");
  });
});