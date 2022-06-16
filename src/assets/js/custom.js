$(document).ready(function () {
  // $('#carousel-related-product').slick({
  //   infinite: true,
  //   arrows: false,
  //   slidesToShow: 4,
  //   slidesToScroll: 3,
  //   dots: true,
  //   responsive: [{
  //     breakpoint: 1024,
  //     settings: {
  //       slidesToShow: 3,
  //       slidesToScroll: 3
  //     }
  //   },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 3
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 3
  //       }
  //     }
  //   ]
  // });
  $('.display-form-chat').each(function (index, element) {
    $(this).click(function (e) {
      alert("sadada")
      $('.display-form-chat form.comment-form').removeClass('active');
      let reply_box = $(e.currentTarget).find('.comment-form');
      $(reply_box).addClass('active');
    });
  });


  // quatity
  // $('div.button .btn-numberr').click(function (e) {
  //
  //   e.preventDefault();
  //   fieldName = $(e.currentTarget).attr('data-field');
  //   type = $(e.currentTarget).attr('data-type');
  //   var input = $(".input-number");
  //   var currentVal = parseInt(input.val);
  //   alert(currentVal)
  //   if (!isNaN(currentVal)) {
  //     if (type === 'minus') {
  //       if (currentVal > input.attr('data-min')) {
  //         input.val(currentVal - 1).change();
  //       }
  //       if (parseInt(input.val()) === input.attr('data-min')) {
  //         $(this).attr('disabled', true);
  //       }
  //
  //     } else if (type === 'plus') {
  //       if (currentVal < input.attr('data-max')) {
  //         input.val(currentVal + 1).change();
  //       }
  //       if (parseInt(input.val()) == input.attr('data-max')) {
  //         $(this).attr('disabled', true);
  //       }
  //
  //     }
  //   } else {
  //     input.val(0);
  //   }
  // });
  //
  // $('.input-number').focusin(function () {
  //   $(this).data('oldValue', $(this).val());
  // });
  // $('.input-number').change(function () {
  //
  //   minValue = parseInt($(this).attr('data-min'));
  //   maxValue = parseInt($(this).attr('data-max'));
  //   valueCurrent = parseInt($(this).val());
  //
  //   name = $(this).attr('name');
  //   if (valueCurrent >= minValue) {
  //     $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
  //   } else {
  //     alert('Sorry, the minimum value was reached');
  //     $(this).val($(this).data('oldValue'));
  //   }
  //   if (valueCurrent <= maxValue) {
  //     $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
  //   } else {
  //     alert('Sorry, the maximum value was reached');
  //     $(this).val($(this).data('oldValue'));
  //   }
  //
  //
  // });
  // $(".input-number").keydown(function (e) {
  //   // Allow: backspace, delete, tab, escape, enter and .
  //   if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
  //     // Allow: Ctrl+A
  //     (e.keyCode == 65 && e.ctrlKey === true) ||
  //     // Allow: home, end, left, right
  //     (e.keyCode >= 35 && e.keyCode <= 39)) {
  //     // let it happen, don't do anything
  //     return;
  //   }
  //   // Ensure that it is a number and stop the keypress
  //   if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
  //     e.preventDefault();
  //   }
  // });

  $('#menu li.nav-item').each(function (index, element) {
    $(this).click(function (e) {
      $('#menu li.nav-item').find('a').removeClass('router-link-active');
      $(e.currentTarget).find('a').addClass('router-link-active');
    });
  });
});
