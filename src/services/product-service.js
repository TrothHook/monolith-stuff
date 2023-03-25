const { productRepository } = require("../database/index");
const { formatData } = require("../utils/index");
const { APIError } = require("../utils/app-errors");

// All Business logic will be here

class ProductService {
  constructor() {
    this.repository = new productRepository();
  }

  async createProduct(productInputs) {
    try {
      const productResult = await this.repository.CreateProduct(productInputs);
      return formatData(productResult);
    } catch (error) {
      throw new APIError("Data not found");
    }
  }

  async getProducts() {
    try {
      const products = await this.repository.Products();

      let categories = {};

      products.map(({ type }) => {
        categories[type] = type;
      });

      return formatData({
        products,
        categories: Object.keys(categories),
      });
    } catch (error) {
      throw new APIError("Data not found");
    }
  }

  async getProductDescription(productId) {
    try {
      const product = await this.repository.getAProduct(productId);
      return formatData(product);
    } catch (error) {
      throw new APIError("Data Not found");
    }
  }

  async getProductsByCategory(category) {
    try {
      const products = await this.repository.getProductByCategory(category);

      return formatData(products);
    } catch (error) {
      throw new APIError("Data not found");
    }
  }

  async getSelectedProducts(selectedIds) {
    try {
      const selectedProducts = await this.repository.FindSelectedProducts(
        selectedIds
      );

      return formatData(selectedProducts);
    } catch (error) {
      throw new APIError("Data Not found");
    }
  }

  async getProductByIds(productId) {
    try {
      return await this.repository.getAProduct(productId);
    } catch (error) {
      throw new APIError("Data Not found");
    }
  }
}

module.exports = ProductService;
