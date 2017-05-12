/**
 * Created by wac92 on 2017/5/8.
 */
var $orderControl = $('.order-control');//所有訂購欄之容器
var $goodsSelected = $('.goods-chooser-control');//品名下拉選單
var $setUnitPrice = $('.unit-price');//單價欄位
var $total =  $('#total'); //總計欄位


function loadFinish() {//品名讀入後新增一個空白訂購欄
    $('#add-goods').click();
}

function  countSubtotal() { //計算小計
    var $closetParent =  $(this).closest('.form-field');
    var unitPrice = parseInt($closetParent.find('.quantity').prevAll('.unit-price').text());
    var quantity = parseInt($closetParent.find('.quantity').val());

    $closetParent.find('span.subtotal').text(unitPrice*quantity);
    countTotal();
}

function countTotal() {//計算總計
    var sub = [];
    var total = 0;
    $('.subtotal').each(function (index, elem) {
        sub.push(parseInt(elem.innerHTML));
    });
    for(var i = 1 ; i<sub.length ; i++){
        total += sub[i];
    }
    $total.text(total);
    countTotalPrice();
}

function removeOrder() {//清除該欄
    $(this).closest('.form-field').remove();
    countTotal();
}

function countTotalPrice() {//計算應付金額
    var totalPrice =  parseInt($total.text());
    var freightExpenseSpan = $('#freight-expense');
    var amountPayableSpan = $('#amount-payable');

    if (totalPrice < 2000 && totalPrice > 0){
        freightExpenseSpan.text(150);
    }else{
        freightExpenseSpan.text(0);
    }
    var countAmountPayable = totalPrice + parseInt(freightExpenseSpan.text());
    // if(countAmountPayable >= 0){
    amountPayableSpan.text(countAmountPayable);
    // }
}

$('#add-goods').click(function (event) {//新增訂購欄位
    event.preventDefault();
    $orderControl
        .find('div.form-field.hidden')
        .clone(true)
        .removeClass('hidden')
        .addClass('act')
        .appendTo($orderControl);
});

// 讀取完才觸發增加訂購欄位(loadFinish)
$goodsSelected.load('php/tanfen-order-goods.php',loadFinish)
    .change(function () { //讀取選單及選單改變時顯示單價
        var $this = $(this);
        $.getJSON('unit-price.json',function (data) {
           var value = data[$this.val()];
            $this.closest('.form-field').find('.unit-price').text(value);
        });
});

$orderControl.on('click','.field-remover',removeOrder);//清除該欄位

$('#quantity').change(countSubtotal);//數量變化即時計算小計額

$goodsSelected.change(function () {//品名變化清空之前的數量及小計
    $(this).closest('.form-field').find('.quantity').val(0).focus().end().find('span.subtotal').text(0);
    countTotal();
});

$('#order-form input:reset').click(function () {//重置鍵，移除所有訂購項
    $('.order-control .form-field.act').find('.field-remover').click();
    $('#add-goods').click();
});



// function executeAjax(url,func,myTarget,context) {
//     var oAjax = new XMLHttpRequest();
//     var xhr = null;
//     oAjax.open('GET', url, true);
//     oAjax.send();
//     oAjax.onreadystatechange = function () {
//         if (this.readyState == 4) {
//             if (this.status == 200) {
//              func(this,myTarget);
//             }
//         }
//     };
// }
//
// function getData(xhr,myTarget) {
//     var obj = JSON.parse(xhr.responseText);
//     var value = obj[myTarget.value];
// }

// function getJson(url) {
//     console.log('getjson');
//     var oAjax = new XMLHttpRequest();
//     var oJson;
//     oAjax.open('GET',url,true);
//     oAjax.send();
//     oAjax.onreadystatechange=function () {
//         if(oAjax.readyState == 4 ){
//             if (oAjax.status == 200){
//                oJson = JSON.parse(this.responseText);
//                console.log(oJson['b-02']);
//             }
//         }
//     }
// }
