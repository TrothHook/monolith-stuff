const { productModel } = require("../models/index");

const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

// Dealing with database operations
class ProductRepository {
  async CreateProduct({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  }) {
    try {
      const product = new productModel({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });

      const result = await product.save();

      return result;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create product"
      );
    }
  }

  async Products() {
    try {
      const data = await productModel.find({});
      return data;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find the products"
      );
    }
  }

  async getAProduct(id) {
    try {
      return await productModel.findOne({ _id: id });
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find the product"
      );
    }
  }

  async getProductByCategory(category) {
    try {
      return await productModel.find({ type: category });
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find the product by category"
      );
    }
  }

  async FindSelectedProducts(selectedIds) {
    try {
      const products = await ProductModel.find()
        .where("_id")
        .in(selectedIds.map((_id) => _id))
        .exec();
      return products;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Product"
      );
    }
  }
}

module.exports = ProductRepository;