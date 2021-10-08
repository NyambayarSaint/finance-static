$(window).on('load', function() {
  "use strict";
  //Preloader
  if ($('body').hasClass('loading')) {
    var $preLoader = $('body>.sm-preloader');
    if ($preLoader.length) {
      $preLoader.animate({
        opacity: 0,
        visibility: "hidden"
      }, 2500);
      $('body').removeClass('loading');
      $(window).trigger('sm-resize');
    } else {
      $('body').removeClass('loading');
    }
  }

  $(".dropdown img.flag").addClass("flagvisibility");

  $(".dropdown dt").click(function() {
    $(".dropdown dd ul").toggle();
  });

  $(".dropdown dd ul li").click(function() {
    var text = $(this).html();
    $(".dropdown dt span").html(text);
    $(".dropdown dd ul").hide();
  });

  function getSelectedValue(id) {
    return $("#" + id).find("dt span.value").html();
  }

  $(document).bind('click', function(e) {
    var $clicked = $(e.target);
    if (!$clicked.parents().hasClass("dropdown"))
      $(".dropdown dd ul").hide();
  });



  $(".dropdown img.flag").toggleClass("flagvisibility");


  /* Social Share */
  $(document).on("click", '.social-share a', function(e) {
    e.preventDefault();
    var $socName = $(this).attr('class').replace('-share', '');
    jQuery.post(lvly_script_data.ajaxurl, { action: 'lvly_share_ajax', social_pid: $(this).closest('.social-share').data('id'), social_name: $socName });
    switch ($socName) {
      case 'facebook':
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + jQuery(this).attr('href'), "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
        break;
      case 'twitter':
        window.open('http://twitter.com/intent/tweet?text=' + $(this).data('title') + ' ' + jQuery(this).attr('href'), "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
        break;
      case 'pinterest':
        window.open('http://pinterest.com/pin/create/button/?url=' + jQuery(this).attr('href') + '&media=' + $(this).data('image') + '&description=' + $(this).data('title'), "pinterestWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
        break;
      case 'google':
        window.open('https://plus.google.com/share?url=' + jQuery(this).attr('href'), "googleWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
        break;
      case 'linkedin':
        window.open('https://www.linkedin.com/shareArticle??mini=true&url=' + jQuery(this).attr('href') + '&title=' + $(this).data('title'), "linkedinWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
        break;
    }

    return false;
  });

});

function getValues() {
  //button click gets values from inputs
  var balance = parseFloat(document.getElementById("principal_fixed").value);
  var interestRate = parseFloat(
    document.getElementById("interest_fixed").value / 100.0
  );
  var terms = parseInt(document.getElementById("terms_fixed").value);

  //set the div string
  var div = document.getElementById("Result_fixed");

  //in case of a re-calc, clear out the div!
  div.innerHTML = "";

  //validate inputs - display error if invalid, otherwise, display table
  var balVal = validateInputs(balance);
  var intrVal = validateInputs(interestRate);

  if (balVal && intrVal) {
    //Returns div string if inputs are valid
    div.innerHTML += amort(balance, interestRate, terms);
  } else {
    //returns error if inputs are invalid
    div.innerHTML += "Буруу утга оруулсан байна. Зээлийн дүнгээ шалгана уу";
  }
}


function numberWithCommas_fixed(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showPurchase_fixed(newValue) {
  var pp = newValue
  document.getElementById("principal_fixed").value = numberWithCommas_fixed(pp) + " ₮";
  verify();
}

function changedPP_fixed(newValue) {
  var pp = parseInt(newValue.toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  if (isNaN(pp)) {
    pp = "0";
  }
  document.getElementById("principal_fixed").value = numberWithCommas_fixed(pp) + " ₮";
  verify();
}

function changedIR_fixed(newValue) {
  var ir = newValue;
  document.getElementById("interest_fixed").value = ir + " %";
  verify();
}

function focusoutIR_fixed(newValue) {
  var ir = newValue.replace(/%/gi, '');
  document.getElementById("interest_fixed").value = ir + " %";
  verify();
}

function changedTIME_fixed(newValue) {
  var mt = newValue;
  document.getElementById("terms_fixed").value = mt + " сар";
  verify();
}

function focusoutTIME_fixed(newValue) {
  var mt = newValue.replace(/%/gi, '');
  document.getElementById("terms_fixed").value = mt + " сар";
  verify();
}

function changedTIME_fixed2(newValue) {
  var mt = newValue;
  document.getElementById("time_fixed").value = mt + " сар";
  verify();
}

function focusoutTIME_fixed2(newValue) {
  var mt = newValue.replace(/%/gi, '');
  document.getElementById("time_fixed").value = mt + " сар";
  verify();
}

function calculate() {
  var mt = parseInt((document.getElementById("months_fixed").value).toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  var pp = parseInt((document.getElementById("range_fixed").value).toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  var ir = parseFloat(document.getElementById("interest_fixed").value, 10);
}

function verify() {
  if (document.getElementById("interest").value.trim() != "") {
    document.getElementById("calc").disabled = false;
    show();
  } else {
    document.getElementById("calc").disabled = true;
  }
}

function enterCheck() {
  if (characterCode == 13) {
    show();
  }
}

/**
 * Amort function:
 * Calculates the necessary elements of the loan using the supplied user input
 * and then displays each months updated amortization schedule on the page
 */
function amort(balance, interestRate, terms) {
  //Calculate the per month interest rate
  var monthlyRate = interestRate / 12;

  //Calculate the payment
  var payment =
    balance * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -terms)));

  //begin building the return string for the display of the amort table
  var result = '';
  // var result =
  //   "Loan amount: $" +
  //   balance.toFixed(2) +
  //   "<br />" +
  //   "Interest rate: " +
  //   (interestRate * 100).toFixed(2) +
  //   "%<br />" +
  //   "Number of months: " +
  //   terms +
  //   "<br />" +
  //   "Monthly payment: $" +
  //   payment.toFixed(2) +
  //   "<br />" +
  //   "Total paid: $" +
  //   (payment * terms).toFixed(2) +
  //   "<br /><br />";

  //add header row for table to return string
  result +=
    "<table class='uk-table uk-table-striped uk-table-responsive uk-table-middle uk-table-small'><tr><td>Month #</td><td>Balance</td>" +
    "<td>Interest</td><td>Principal</td>";

  /**
   * Loop that calculates the monthly Loan amortization amounts then adds
   * them to the return string
   */
  for (var count = 0; count < terms; ++count) {
    //in-loop interest amount holder
    var interest = 0;

    //in-loop monthly principal amount holder
    var monthlyPrincipal = 0;

    //start a new table row on each loop iteration
    result += "<tr align=center>";

    //display the month number in col 1 using the loop count variable
    result += "<td>" + (count + 1) + "</td>";

    //code for displaying in loop balance
    result += "<td> $" + balance.toFixed(2) + "</td>";

    //calc the in-loop interest amount and display
    interest = balance * monthlyRate;
    result += "<td> $" + interest.toFixed(2) + "</td>";

    //calc the in-loop monthly principal and display
    monthlyPrincipal = payment - interest;
    result += "<td> $" + monthlyPrincipal.toFixed(2) + "</td>";

    //end the table row on each iteration of the loop
    result += "</tr>";

    //update the balance for each loop iteration
    balance = balance - monthlyPrincipal;
  }

  //Final piece added to return string before returning it - closes the table
  result += "</table>";

  //returns the concatenated string to the page
  return result;
}

function validateInputs(value) {
  //some code here to validate inputs
  if (value == null || value == "") {
    return false;
  } else {
    return true;
  }
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showPurchase(newValue) {
  var pp = newValue
  document.getElementById("range").value = numberWithCommas(pp) + " ₮";
  verify();
}

function changedPP(newValue) {
  var pp = parseInt(newValue.toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  if (isNaN(pp)) {
    pp = "0";
  }
  document.getElementById("range").value = numberWithCommas(pp) + " ₮";
  verify();
}

function changedIR(newValue) {
  var ir = newValue;
  document.getElementById("interest").value = ir + " %";
  verify();
}

function focusoutIR(newValue) {
  var ir = newValue.replace(/%/gi, '');
  document.getElementById("interest").value = ir + " %";
  verify();
}

function changedTIME(newValue) {
  var mt = newValue;
  document.getElementById("months").value = mt + " сар";
  verify();
}

function focusoutTIME(newValue) {
  var mt = newValue.replace(/%/gi, '');
  document.getElementById("months").value = mt + " сар";
  verify();
}

function changedTIME2(newValue) {
  var mt = newValue;
  document.getElementById("time").value = mt + " сар";
  verify();
}

function focusoutTIME2(newValue) {
  var mt = newValue.replace(/%/gi, '');
  document.getElementById("time").value = mt + " сар";
  verify();
}

function calculate() {
  var mt = parseInt((document.getElementById("months").value).toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  var pp = parseInt((document.getElementById("range").value).toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  var ir = parseFloat(document.getElementById("interest").value, 10);
}

function show() {
  var mt = parseInt((document.getElementById("months").value).toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  var pp = parseInt((document.getElementById("range").value).toString().replace(/[^a-zA-Z 0-9]+/g, ''), 10);
  var ir = parseFloat(document.getElementById("interest").value, 10);
  var princ = pp;
  var intRate = (ir / 100);
  var months = mt;
  document.getElementById("range4").innerHTML = numberWithCommas((((princ * intRate) / (1 - Math.pow(1 + intRate, (-1 * months))) * 100) / 100).toFixed(2)) + " ₮";
  document.getElementById("range5").innerHTML = numberWithCommas((princ * months).toFixed(2)) + " ₮";
}

function verify() {
  if (document.getElementById("interest").value.trim() != "") {
    document.getElementById("calc").disabled = false;
    show();
  } else {
    document.getElementById("calc").disabled = true;
  }
}

function enterCheck() {
  if (characterCode == 13) {
    show();
  }
}


// UiKit Slider Adaptive Height

UIkit.util.ready(function() {
  var slider = UIkit.slider("#about-slider", {
    center: true
  });
  if (!slider) {
    return;
  }
  UIkit.util.on(slider.$el, 'itemshown', function(e) {
    var img = UIkit.util.find('p', e.srcElement);
    var container = UIkit.util.find('.uk-slider-container.p0');
    console.log(img);
    console.log(container);
    var setSliderHeight = function(img) {
      var heigth = UIkit.util.height(img);
      UIkit.util.css(container, {
        minHeight: heigth,
        height: heigth,
        transition: "height 0.2s ease-out"
      })
    }
    img.onload = function() {
      setSliderHeight(this);
    }
    setSliderHeight(img);
  });

});

const inputElements = document.querySelectorAll('[type="range"]');

const handleInput = (inputElement) => {
  let isChanging = false;

  const setCSSProperty = () => {
    const percent =
      ((inputElement.value - inputElement.min) /
        (inputElement.max - inputElement.min)) *
      100;
    // Here comes the magic 🦄🌈
    inputElement.style.setProperty("--webkitProgressPercent", `${percent}%`);
  }

  // Set event listeners
  const handleMove = () => {
    if (!isChanging) return;
    setCSSProperty();
  };
  const handleUpAndLeave = () => isChanging = false;
  const handleDown = () => isChanging = true;

  inputElement.addEventListener("mousemove", handleMove);
  inputElement.addEventListener("mousedown", handleDown);
  inputElement.addEventListener("mouseup", handleUpAndLeave);
  inputElement.addEventListener("mouseleave", handleUpAndLeave);
  inputElement.addEventListener("click", setCSSProperty);

  // Init input
  setCSSProperty();
}

inputElements.forEach(handleInput)