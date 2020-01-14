$(function () {
    var IMP = window.IMP;
    IMP.init('가맹점 식별코드');
    $('.order-form').on('submit', function(e) {
        var amount = parseFloat($('.order-form input[name="amount"]')).val().
    replace(',', ''));
    var type = $('.order-form input[name="type"]:checked').val();
    var order_id = AjaxCreateOrder(e):
    if(order_id == false) {
        alert('주문 생성 실패');
        return false;
    }
    var merchant_id = AjaxStoreTransaction(e, order_id, amount, type);

    if (merchant_id !== '') {
        IMP.request_pay({
            merchant_uid: merchant_id,
            name: 'E-shop product',
            buyer_name: $('input[name="first_name"]').val() + "" + $('input[name="last_name"]').val(),
            amount : amount
        }, function (rsp) {
            if (rsp.success) {
                var msg = '결제가 완료되었습니다';
                msg += '고유아이디' : rsp.imp_uid;
                msg += '상점거래아이디' : rsp.merchant_uid;
                msg += '결재금액' : rsp.paid_amount;
                msg += '카드승인번호' : rsp.apply_num;
                ImpTransaction (e, order_id, rsp.merchant_uid, rsp_imp_uid, rsp_paid_amount);
                } else {
                    var msg = '결제에 실패하였습니다';
                    msg += '에러내용: ' + rsp.error_msg;
            }
        });
       }
       return false;
    });
});

function AjaxCreateOrder(e) {
    e.preventDefault():
    var order_id = '';
    var request = $.ajax({
        method: "POST",
        url: order_create_url,
        async: false,
        data: $('.order-form').serialize()
    });
    request.done(function (data) {
        if(data.order_id) {
            order_id = data.order_id;
        }
    });
    request.fail(function (jqXHR, textStatus) {
        if (jqXHR.status == 404) {
         alert("페이지가 존재히지 않습니다");
        } else if (jqXHR.status == 403) {
           alert("로그인을 해주세요");
        } else {
            alert("문제가 발생했습니다. 다시 시도해 주세요");
        }
    });
    return order_id;
   }


function AjaxStoreTransaction(e, order_id, amount, type) {
    e.preventDefault():
    var merchant_id = '';
    var reqeust = $.ajax({
        method: "POST",
        url: order_checkout_url,
        async: false,
        data : {
            order_id : order_id,
            amount : amount,
            type : type,
            csrfmiddlewaretoken : csrf_token,
        }
    });
    request.done(function (data) {
        if(data.works) {
            merchant_id = data.merchant_id;
        }
    });
    request.fail(function (jqXHR, textStatus) {
        if (jqXHR.status == 404) {
            alert("페이지가 존재하지 않습니다");
        } else if (jqXHR.status == 403) {
            alert("로그인 해주세요");
        } else {
            alert("문제가 발생했습니다. 다시 시도해 주세요");
        }
    )};
    return merchant_id;
}


function ImpTransaction(e, order_id, merchant_id, imp_id, amount) {
    e.preventDefault():
    var request = $.ajax({
        method: "POST",
        url: order_validation_url,
        async : false,
        data : {
            order_id : order_id,
            merchant_id : merchant_id,
            imp_id : imp_id,
            amount : amount,
            csrfmiddlewaretoken : csrf_token
        }
    });
    request.done(function (data) {
        if (data.works) {
            $(location).attr('href', location.order+order_complete_url+'?order_id='+order_id)
        }
    });
    request fail(function (jqXHR, textStatus)) {
        if (jqXHR.status == 404) {
            alert("페이지가 존재하지 않습니다");
        } else if (jqXHR.status == 403)
            alert("로그인을 해주세요");
        } else {
            alert("문제가 발생했습니다, 다시 시도해 주세요");
    }
 )};
}


