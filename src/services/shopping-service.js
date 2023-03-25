const {ShoppingRepository} = require('../database/index');
const {formatData} = require('../utils/index');

// All Business logic will be here

class ShoppingService{
    constructor(){
        this.repository = new ShoppingRepository();
    }

    async placeOrder(userInput){
        const {_id, txnNumber} = userInput;

        // Verify the txn number with payment logs
        try {
            const orderResult = await this.repository.CreateOrder(_id, txnNumber);
            return formatData(orderResult);
        } catch (error) {
            throw new APIError('Data Not found')
        }
    }

    async getOrders(customerId){
        try {
            const orderResult = await this.repository.Orders(customerId);
            return formatData(orderResult);
        } catch (error) {
            throw new APIError('Data Not found')
        }
    }
}

module.exports = ShoppingService;