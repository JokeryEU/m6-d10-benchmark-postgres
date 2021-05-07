import sequelize from "sequelize";
const { Sequelize, DataTypes } = sequelize;

export const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  { port: process.env.PGPORT, host: process.env.PGHOST, dialect: "postgres" }
);
import ProductModel from "./Product.js";
import UserModel from "./User.js";
import CategoryModel from "./Category.js";
import ReviewModel from "./Review.js";

export const Product = ProductModel(sequelize, DataTypes);
export const User = UserModel(sequelize, DataTypes);
export const Category = CategoryModel(sequelize, DataTypes);
export const Review = ReviewModel(sequelize, DataTypes);

User.hasMany(Review);
Review.belongsTo(User);

Product.hasMany(Review);
Review.belongsTo(Product);

Category.hasMany(Product);
Product.belongsTo(Category);

sequelize
  .authenticate()
  .then(() => console.log("Connection established"))
  .catch((e) => console.log(e));

export default { sequelize, Product, User, Category, Review };
