import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Público
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Público
const getProductById = asyncHandler(async (req, res) => {
  // NOTA: la verificación de ObjectId válido para prevenir CastError se movió a un middleware separado.
  // Ver el README para más información.

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    // NOTA: esto se ejecutará si hay un ObjectId válido pero no se encontró el producto
    // es decir, el producto puede ser nulo
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Crear un producto
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Nombre de ejemplo',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Marca de ejemplo',
    category: 'Categoría de ejemplo',
    countInStock: 0,
    numReviews: 0,
    description: 'Descripción de ejemplo',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Privado/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Crear una nueva reseña
// @route   POST /api/products/:id/reviews
// @access  Privado
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Producto ya reseñado');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Reseña agregada' });
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Obtener los productos mejor valorados
// @route   GET /api/products/top
// @access  Público
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};