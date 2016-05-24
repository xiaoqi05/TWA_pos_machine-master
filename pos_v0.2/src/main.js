function printInventory(inputs) {
    var cartItems = [];
    inputs.forEach(function (item) {
        if (cartItems[item]) {
            cartItems[item].count++;
        } else {
            var cartItem = getItemAllInfoFromBarCode(item);
            cartItems[item] = {
                barcode: cartItem.barcode,
                name: cartItem.name,
                unit: cartItem.unit,
                price: cartItem.price,
                count: 1
            };
        }
    });
    var resultString = spliceInventoryResultString(cartItems);
    console.log(resultString);
}

function getItemAllInfoFromBarCode(barcode) {
    var allCartItems = loadAllItems();
    var cartItem = [];
    allCartItems.forEach(function (item) {
        if (item.barcode == barcode) {
            cartItem = {
                barcode: item.barcode,
                name: item.name,
                unit: item.unit,
                price: item.price
            }
        }
    })
    return cartItem;


}