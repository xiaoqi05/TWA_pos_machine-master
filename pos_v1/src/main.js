//TODO: Please write code in this file.
//TODO: Please write code in this file.
// Initial Data
//var inputs = [
//    'ITEM000001',
//    'ITEM000001',
//    'ITEM000001',
//    'ITEM000001',
//    'ITEM000001',
//    'ITEM000003-2',
//    'ITEM000005',
//    'ITEM000005',
//    'ITEM000005'
//];
var allItems = loadAllItems();
var promotions = loadPromotions();
var promote_rule = loadPromoteRule()

// Main Handler
function printInventory(inputs) {

    //get goods count
    var goods_count = get_goods_count(inputs);
    var promote_count = get_promote_count(goods_count);

    //get goods information
    var goods_info = get_detail_info(goods_count);
    var promote_info = get_detail_info(promote_count);
    goods_info = get_promoted_goods_info(goods_info,promote_info)

    //get string
    var goods_message = struct_goods_string(goods_info);
    var promote_message = struct_promote_message(promote_info);
    var cost_message = struct_cost_message(goods_info, promote_info);

    //result
    var message =
        '***<没钱赚商店>购物清单***\n' +
        goods_message + '----------------------\n' +
        '挥泪赠送商品：\n' +
        promote_message +
        '----------------------\n' +
        cost_message +
        '**********************';

    console.info(message); //for watching on console
    console.log(message);
}

// Get Goods Count
function get_goods_count(inputs) {
    var all_goods = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].search('-') === 10) {
            var num = parseInt(inputs[i].substring(11));
            inputs[i] = inputs[i].substring(0, 10);
            for (var j = 0; j < num - 1; j++) {
                inputs.push(inputs[i]);
            }
        }
    }
    for (var i = 0; i < inputs.length; i++) {
        var target = inputs[i];
        var count = 0;
        for (var j = 0; j < inputs.length; j++) {
            if (inputs[j] == target) {
                count++;
            }
        }
        var times = inputs.length
        for (var j = times; j > i; j--) {
            if (inputs[j] == target) {
                inputs.splice(j, 1)
            }
        }
        var item = {name: target, count: count};
        all_goods.push(item);
    }
    return all_goods;
//    [
//        {count: 5, name: "ITEM000001"},
//        {count: 3, name: "ITEM000003"},
//        {count: 3, name: "ITEM000005"}
//    ]
}

function get_promote_count(data) {
    var promote_info = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < promotions.length; j++) {
            if (judge_contained_by_array(data[i].name, promotions[j].barcodes)) {
                var count = parseInt(data[i].count / promote_rule[promotions[j].type]);
                var name = data[i].name;
                promote_info.push({name: name, count: count});
            }
        }
    }
    return promote_info;
//    [
//        {count: 1, name: "ITEM000001"},
//        {count: 1, name: "ITEM000005"}
//    ]
}

// Get Goods Information
function get_detail_info(count) {
    for (var i = 0; i < count.length; i++) {
        for (var j = 0; j < allItems.length; j++) {
            if (count[i].name == allItems[j].barcode) {
                count[i].name = allItems[j].name;
                count[i].unit = allItems[j].unit;
                count[i].price = allItems[j].price;
                count[i].totle = allItems[j].price * count[i].count;
            }
        }
    }
    return count;
//    [
//        {
//            count: 5,
//            name: "雪碧",
//            price: 3,
//            totle: 15,
//            unit: "瓶"},
//        {
//            count: 3,
//            name: "荔枝",
//            price: 15,
//            totle: 45,
//            unit: "斤"},
//        {
//            count: 3,
//            name: "方便面",
//            price: 4.5,
//            totle: 13.5,
//            unit: "袋"}
//    ]
}

function get_promoted_goods_info(goods_info,promote_info){
    for(var i=0;i<promote_info.length;i++){
        for(var j=0;j<goods_info.length;j++){
            if(promote_info[i].name == goods_info[j].name){
                goods_info[j].totle-=promote_info[i].totle;
            }
        }
    }
    return goods_info;
}

// Get String
function struct_goods_string(goods_data) {
    var string_array = []
    for (var i = 0; i < goods_data.length; i++) {
        string_array.push(
                '名称：' + goods_data[i].name +
                '，数量：' + goods_data[i].count + goods_data[i].unit +
                '，单价：' + change_to_normal_float(goods_data[i].price) +
                '(元)，小计：' + change_to_normal_float(goods_data[i].totle) + '(元)\n'
        )
    }
    var string = '';
    for (var i = 0; i < string_array.length; i++) {
        string += string_array[i]
    }
    return string;
//    名称：雪碧，数量：5瓶，单价：3(元)，小计：15(元)
//    名称：荔枝，数量：3斤，单价：15(元)，小计：45(元)
//    名称：方便面，数量：3袋，单价：4.5(元)，小计：13.5(元)
}

function struct_promote_message(promote_data) {
    var string_array = [];
    for (var i = 0; i < promote_data.length; i++) {
        string_array.push('名称：' + promote_data[i].name + '，数量：' + promote_data[i].count + promote_data[i].unit + '\n')
    }
    var string = '';
    for (var i = 0; i < string_array.length; i++) {
        string += string_array[i]
    }
    return string;
}

function struct_cost_message(goods_info, promote_info) {
    return '总计：' + change_to_normal_float(get_cost_num(goods_info)) + '(元)\n' + '节省：' + change_to_normal_float(get_cost_num(promote_info)) + '(元)\n'
}

// Operate Helper
function judge_contained_by_array(item, items) {
    var flag = false;
    for (var i = 0; i < items.length; i++) {
        if (items[i] == item) {
            flag = true
        }
    }
    return flag;
}

function get_cost_num(goods_info) {
    var goods_cost = 0;
    for (var i = 0; i < goods_info.length; i++) {
        goods_cost += goods_info[i].totle;
    }
    return goods_cost;
}

function change_to_normal_float(num){
    return parseFloat(num).toFixed(2);
}

// Prepare Data
function loadPromoteRule() {
    return {"BUY_TWO_GET_ONE_FREE": 3}
}