/**
 * Created by wac92 on 2017/5/8.
 */
var $orderControl = $('.order-control');//所有訂購欄之容器
var $goodsSelected = $('.goods-chooser-control');//品名下拉選單
var $setUnitPrice = $('.unit-price');//單價欄位
var $total =  $('#total'); //總計欄位
var $resetbtn =$('#order-form input:reset');

// function loadFinish() {//品名讀入後新增一個空白訂購欄
//     $('#add-goods').click();
// }

function  countSubtotal() { /*計算小計函數*/
    var $closetParent =  $(this).closest('.form-field');
    var unitPrice = parseInt($closetParent.find('.quantity').prevAll('.unit-price').text());
    var quantity = parseInt($closetParent.find('.quantity').val());
    // console.log(quantity);
    // console.log(unitPrice);
    $closetParent.find('span.subtotal').text(unitPrice*quantity);
    // console.log('succ');
    countTotal();
}

function countTotal() {/*計算總計函數*/
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

function removeOrder() {/*清除該欄函數*/
    var $this = $(this);
    var $thisParent = $this.closest('.act');
    var getOrderIndex = $thisParent.index();
    $this.closest('.form-field').remove();
    console.log(getOrderIndex);
    $('.cart-list-items.act').eq(getOrderIndex-1).remove();//刪除清單上對應商品
    cart.splice(getOrderIndex-1,1);
    $('#cart-counter').text(cart.length);
    countTotal();
    console.table(cart);
}

function countTotalPrice() {/*計算應付金額函數*/
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
function cloneOrder() {/*複製訂購欄位函數*/
   return $orderControl
        .find('div.form-field.hidden')
        .clone(true)
        .removeClass('hidden')
        .addClass('act');
}

$('#add-goods').click(function (event) {/*新增訂購欄位*/
    event.preventDefault();
    cloneOrder()
        .appendTo($orderControl);
});

/* 讀取完才觸發增加訂購欄位(loadFinish)*/
$goodsSelected.load('php/tanfen-order-goods.php')
    .change(function () { //讀取選單及選單改變時顯示單價
        var $this = $(this);
        $.getJSON('unit-price.json',function (data) {
           var value = data[$this.val()];
            $this.closest('.form-field').find('.unit-price').text(value);
            $('.quantity').change();/*單價讀入後才取得數量計算小計*/
        });
});

$orderControl.on('click','.field-remover',removeOrder);/*清除該欄位事件*/

$('.quantity').change(countSubtotal);/*數量變化即時計算小計額*/

$goodsSelected.change(function () {/*品名選擇變化事件，清空之前的數量及小計*/
    $(this).closest('.form-field')
        .find('.quantity')
        .val(0)
        .focus()
        .end()
        .find('span.subtotal')
        .text(0);

    countTotal();
});

$resetbtn.click(function (event) {/*重置鍵，移除所有訂購項*/
    // event.preventDefault();
    $('.order-control .form-field.act').find('.field-remover').click();
    // $('#add-goods').click();
    // $('.order-control .form-field.act').remove();
    // cart.length = 0;
    // $('.cart-list-items.act').remove();
    // $('#add-goods').click();
    countTotal();
});


/*get products 產品介紹頁*/
var $tbody = $('tbody');
$.getJSON('products-table.json',function (data) {
    // console.dir(data);
    $.each(data,function (key,value) {
       var data= $('.tr-products.tr-origin')
            .clone()
            .removeClass('tr-origin hidden')
            .data('belong',value.image)
            .find('td')
            .each(function (index, elem) {
                // console.log(elem.dataset.td);
                switch (elem.dataset.td){
                    case 'name':
                        elem.innerHTML = value['name'];
                        var image = document.createElement('img');
                        var imgDiv = document.createElement('div');
                        image.setAttribute('src','img/'+value['image']+'.jpg')
                        image.setAttribute('alt',value['image']);//給該列加個可辨認產品的參數，之後操作可用
                        imgDiv.appendChild(image);
                        this.appendChild(imgDiv);
                        break;
                    case 'description':
                        elem.innerHTML = value['description'];
                        break;
                    case 'made-from':
                        elem.innerHTML = value['made-from'];
                        break;
                    case 'price':
                        elem.innerHTML = value['price'];
                        break;
                    // default:
                    //     console.log('fail');
                }
                // console.log('complete loop');
            })
            .end()
            .appendTo($tbody);
    });
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
