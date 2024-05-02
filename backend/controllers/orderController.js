// Importar el manejador asíncrono para controlar las funciones asíncronas
import asyncHandler from '../middleware/asyncHandler.js';
// Importar el modelo de orden
import Order from '../models/orderModel.js';
// Importar el modelo de producto
import Product from '../models/productModel.js';
// Importar la función para calcular precios
import { calcPrices } from '../utils/calcPrices.js';
// Importar las funciones para verificar y procesar pagos de PayPal
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Crear nueva orden
// @route   POST /api/orders
// @access  Privado
const addOrderItems = asyncHandler(async (req, res) => {
  // Obtener los datos de los elementos de la orden, dirección de envío y método de pago del cuerpo de la solicitud
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  // Verificar si hay elementos en la orden
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No hay elementos en la orden');
  } else {
    // Obtener los artículos ordenados de nuestra base de datos
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Mapear sobre los elementos de la orden y utilizar el precio de nuestros artículos de la base de datos
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // Calcular precios
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    // Crear una nueva orden con los datos proporcionados
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Guardar la orden en la base de datos
    const createdOrder = await order.save();

    // Responder con la orden creada
    res.status(201).json(createdOrder);
  }
});

// @desc    Obtener órdenes del usuario logueado
// @route   GET /api/orders/myorders
// @access  Privado
const getMyOrders = asyncHandler(async (req, res) => {
  // Buscar órdenes del usuario logueado
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Obtener orden por ID
// @route   GET /api/orders/:id
// @access  Privado
const getOrderById = asyncHandler(async (req, res) => {
  // Buscar orden por ID y poblar información del usuario
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  // Verificar si la orden existe
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Orden no encontrada');
  }
});

// @desc    Actualizar orden a pagada
// @route   PUT /api/orders/:id/pay
// @access  Privado
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // NOTA: aquí necesitamos verificar que el pago se haya realizado a PayPal antes de marcar
  // la orden como pagada
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error('Pago no verificado');

  // Verificar si esta transacción ha sido utilizada antes
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error('La transacción ha sido utilizada antes');

  // Buscar la orden por ID
  const order = await Order.findById(req.params.id);

  if (order) {
    // Verificar que se haya pagado la cantidad correcta
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error('Cantidad pagada incorrecta');

    // Actualizar el estado de la orden a pagada y guardar los detalles del pago
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // Guardar la orden actualizada
    const updatedOrder = await order.save();

    // Responder con la orden actualizada
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Orden no encontrada');
  }
});

// @desc    Actualizar orden a entregada
// @route   GET /api/orders/:id/deliver
// @access  Privado/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  // Buscar la orden por ID
  const order = await Order.findById(req.params.id);

  if (order) {
    // Actualizar el estado de la orden a entregada y guardar la fecha de entrega
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    // Guardar la orden actualizada
    const updatedOrder = await order.save();

    // Responder con la orden actualizada
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Orden no encontrada');
  }
});

// @desc    Obtener todas las órdenes
// @route   GET /api/orders
// @access  Privado/Admin
const getOrders = asyncHandler(async (req, res) => {
  // Obtener todas las órdenes y poblar información del usuario
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// Exportar las funciones para ser utilizadas en otros archivos
export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};