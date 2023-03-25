const ProductService = require("../services/product-service");
const CustomerService = require("../services/customer-service");
const userAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ProductService();
  const customerService = new CustomerService();

  app.post("/api/v1/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, supplier, banner } =
        req.body;

      // validation
      const data = await service.createProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });

      res.status(201).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api/v1/product/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const data = await service.getProductsByCategory(type);

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/v1/product/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const data = await service.getProductDescription(productId);

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  });
};
