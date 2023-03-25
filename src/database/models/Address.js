const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
},{
    timestamps: true
})

module.exports = mongoose.model('address', addressSchema);