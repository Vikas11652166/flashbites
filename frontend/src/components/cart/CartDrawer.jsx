import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toggleCart } from '../../redux/slices/uiSlice';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';
import { calculateCartTotal } from '../../utils/helpers';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState(new Set());
  const { cartOpen } = useSelector((state) => state.ui);
  const { items, restaurant } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const subtotal = calculateCartTotal(items);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      dispatch(toggleCart());
      return;
    }
    navigate('/checkout');
    dispatch(toggleCart());
  };

  const toggleItemExpand = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:z-40"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Drawer - Full screen on mobile (above nav), side drawer on desktop */}
      <div className="fixed top-0 left-0 right-0 bottom-20 sm:inset-0 sm:right-0 sm:top-0 sm:h-full sm:bottom-auto sm:w-96 bg-white z-40 sm:z-50 shadow-xl flex flex-col">
        {/* Header - Hidden on mobile, visible on desktop */}
        <div className="hidden sm:flex p-4 sm:p-4 border-b sticky top-0 bg-white items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">Your Cart</h2>
            {restaurant && (
              <p className="text-xs sm:text-sm text-gray-600 truncate">{restaurant.name}</p>
            )}
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
            aria-label="Close cart"
          >
            <XMarkIcon className="h-6 w-6 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {items.length === 0 ? (
            <div className="text-center py-16 sm:py-12 flex flex-col items-center justify-center h-full">
              <div className="text-5xl sm:text-6xl mb-4">🛒</div>
              <p className="text-gray-600 text-base sm:text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {items.map((item) => (
                <div 
                  key={item._id} 
                  className="flex gap-3 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Item Image - Larger on mobile */}
                  {item.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded"
                      />
                    </div>
                  )}

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-xs sm:text-xs text-primary-600 font-semibold mt-1">
                      Subtotal: {formatCurrency(item.price * item.quantity)}
                    </p>

                    {/* Quantity Controls - Larger on mobile for easier touch */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ 
                          itemId: item._id, 
                          quantity: item.quantity - 1 
                        }))}
                        className="w-9 h-9 sm:w-8 sm:h-8 border-2 border-primary-600 text-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-50 active:bg-primary-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ 
                          itemId: item._id, 
                          quantity: item.quantity + 1 
                        }))}
                        className="w-9 h-9 sm:w-8 sm:h-8 border-2 border-primary-600 text-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-50 active:bg-primary-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="ml-auto p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={() => {
                  if (window.confirm('Clear entire cart?')) {
                    dispatch(clearCart());
                  }
                }}
                className="w-full mt-4 py-2 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Footer - Bill Summary - Sticky on mobile */}
        {items.length > 0 && (
          <div className="border-t p-3 sm:p-4 space-y-3 sm:space-y-3 sticky bottom-0 bg-white">
            {/* Price Breakdown */}
            <div className="space-y-2 text-xs sm:text-sm bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-semibold">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout Button - Large on mobile */}
            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 sm:py-3 text-base sm:text-base font-semibold rounded-lg active:scale-95 transition-transform"
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="w-full py-2 px-4 text-primary-600 border border-primary-600 hover:bg-primary-50 text-sm sm:text-sm font-medium rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;