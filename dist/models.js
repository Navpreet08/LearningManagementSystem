"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vendor {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Vendor = Vendor;
class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
}
exports.User = User;
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
exports.Product = Product;
class Cart {
    constructor(id, quantity, amount) {
        this.id = id;
        this.quantity = quantity;
        this.amount = amount;
    }
}
exports.Cart = Cart;
