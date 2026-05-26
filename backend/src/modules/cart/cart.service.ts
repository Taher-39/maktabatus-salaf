import { Cart, ICart, ICartItem } from './cart.model';
import { Book } from '../book/book.model';
import { AppError } from '../../utils/sendResponse';

// Get user's cart
export const getCartService = async (userId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ user: userId }).populate('items.book');

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: []
    });
    await cart.save();
  }

  return cart;
};

// Add item to cart
export const addToCartService = async (
  userId: string,
  bookId: string,
  quantity: number
): Promise<ICart> => {
  // Check if book exists and get its price
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError('Book not found', 404);
  }

  // Check stock
  if (book.stock < quantity) {
    throw new AppError('Insufficient stock available', 400);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [
        {
          book: bookId,
          quantity,
          price: book.price
        }
      ]
    });
  } else {
    // Check if book already in cart
    const existingItem = cart.items.find((item) => item.book.toString() === bookId);

    if (existingItem) {
      // Update quantity
      if (existingItem.quantity + quantity > 100) {
        throw new AppError('Quantity cannot exceed 100', 400);
      }
      if (book.stock < existingItem.quantity + quantity) {
        throw new AppError('Insufficient stock available', 400);
      }
      existingItem.quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        book: bookId,
        quantity,
        price: book.price
      });
    }
  }

  await cart.save();
  return await getCartService(userId);
};

// Update cart item quantity
export const updateCartItemService = async (
  userId: string,
  itemId: string,
  quantity: number
): Promise<ICart> => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new AppError('Item not found in cart', 404);
  }

  // Verify stock
  const book = await Book.findById(item.book);
  if (!book) {
    throw new AppError('Book not found', 404);
  }

  if (book.stock < quantity) {
    throw new AppError('Insufficient stock available', 400);
  }

  item.quantity = quantity;
  await cart.save();

  return await getCartService(userId);
};

// Remove item from cart
export const removeFromCartService = async (userId: string, itemId: string): Promise<ICart> => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  await cart.save();

  return await getCartService(userId);
};

// Clear entire cart
export const clearCartService = async (userId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: []
    });
  } else {
    cart.items = [];
  }

  await cart.save();
  return cart;
};
