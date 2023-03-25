const CustomerService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CustomerService();

  app.post("/api/v1/customer/signup", async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.signUp({ email, password, phone });
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/v1/customer/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.signIn({ email, password });

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/v1/customer/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { street, postalCode, city, country } = req.body;
      const { data } = await service.addNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.status(201).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/v1/customer/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const data = await service.getProfile({ _id });

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get(
    "/api/v1/customer/shopping-details",
    UserAuth,
    async (req, res, next) => {
      try {
        const { _id } = req.user;

        const data = await service.getShoppingDetails(_id);

        return res.status(200).json({
          status: "success",
          data,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("/api/v1/customer/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const data = await service.getWishList(_id);

      return res.status(200).json({
        status: "success",
        data,
      });
    } catch (error) {
      next(error);
    }
  });
};
