import React, { useState } from 'react';
import {
  Lock,
  Package,
  ShoppingBag,
  Calendar,
  Clock,
  Plus,
  Search,
  Edit2,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/products';
import { formatCurrency, STANDARD_PICKUP_SLOTS } from '../../utils/cartUtils';
import type { Product } from '../../data/products';
import { useOrderStore } from '../../store/useOrderStore';
import type { Order } from '../../store/useOrderStore';

export const AdminDashboard: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard navigation
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'availability'>('orders');

  // Orders State
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatusGlobal = useOrderStore((state) => state.updateOrderStatus);
  
  const [orderFilter, setOrderFilter] = useState<string>('All');

  // Products State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [productSearch, setProductSearch] = useState('');

  // Availability State (Marking dates / slots blocked)
  const [blockedSlots, setBlockedSlots] = useState<string[]>(['Saturday_11:00 AM - 12:00 PM']);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === 'bakery2026' || pinCode === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid staff authorization PIN. (Try "admin" or "bakery2026")');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatusGlobal(orderId, newStatus);
  };

  const handleToggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p))
    );
  };

  const handleToggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const toggleSlotBlock = (key: string) => {
    setBlockedSlots((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Staff Login Screen
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 bg-bento-black min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/5 rounded-3xl shadow-xl p-8 max-w-md w-full shadow-soft text-center space-y-6">
          <div className="w-16 h-16 bg-bento-yellow text-black rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-bento-yellow" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-white">Bakery Staff Portal</h2>
            <p className="text-xs text-bento-grey font-light mt-1">
              Internal operations dashboard for kitchen staff and order fulfillment.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Enter Staff Access PIN
              </label>
              <input
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="PIN (e.g. admin)"
                className="w-full bg-bento-black border border-bento-grey rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-bento-yellow tracking-widest text-center font-mono"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-bento-yellow text-black rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-soft"
            >
              Sign In to Staff Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-bento-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-bento-yellow font-bold block">
              Bento Cakery & Sweets • Operations
            </span>
            <h1 className="text-2xl font-serif font-bold text-white">
              Staff Operations Portal
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Navigation Tabs */}
            <div className="flex bg-white/10 p-1 rounded-full shadow-inner text-xs font-semibold">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-bento-yellow text-black shadow-xs'
                    : 'text-bento-grey hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Live Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'products'
                    ? 'bg-bento-yellow text-black shadow-xs'
                    : 'text-bento-grey hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products & Stock</span>
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'availability'
                    ? 'bg-bento-yellow text-black shadow-xs'
                    : 'text-bento-grey hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Capacity Manager</span>
              </button>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2.5 rounded-full shadow-md bg-white/5 hover:bg-white/10 text-bento-grey hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE ORDERS PIPELINE */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Status Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'New', 'Confirmed', 'Baking', 'Ready for Pickup', 'Collected', 'Cancelled'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      orderFilter === status
                        ? 'bg-bento-yellow text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {/* Orders Table / Cards */}
            <div className="space-y-4">
              {orders
                .filter((o) => (orderFilter === 'All' ? true : o.status === orderFilter))
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/5 rounded-3xl shadow-xl p-6 shadow-soft space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <span className="font-mono font-bold text-white text-base">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {order.customer.name}
                        </span>
                        <span className="text-xs text-bento-grey font-light">
                          ({order.customer.phone})
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-serif font-bold text-white">
                          {formatCurrency(order.totals.total)}
                        </span>

                        {/* Status Changer Select */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value as any)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-full focus:outline-none ${
                            order.status === 'Baking'
                              ? 'bg-bento-yellow text-black'
                              : order.status === 'Ready for Pickup'
                              ? 'bg-green-500 text-white'
                              : order.status === 'Collected'
                              ? 'bg-gray-600 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          <option value="New">New Order</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Baking">Baking in Kitchen</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Collected">Collected by Customer</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      <div className="md:col-span-8 space-y-1">
                        <span className="text-bento-grey block font-medium">Order Items:</span>
                        <ul className="text-white font-light list-disc list-inside space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.quantity}x {item.name} 
                              {item.size && ` (${item.size})`}
                              {item.flavor && ` - ${item.flavor}`}
                              {item.eggless && ` - Eggless`}
                              {item.message && ` - Msg: "${item.message}"`}
                            </li>
                          ))}
                        </ul>
                        {order.notes && (
                          <p className="text-bento-yellow italic pt-1">Notes: “{order.notes}”</p>
                        )}
                      </div>

                      <div className="md:col-span-4 bg-black/30 p-3 rounded-2xl shadow-inner space-y-1">
                        <div className="flex items-center space-x-1.5 text-white font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-bento-yellow" />
                          <span>Pickup: {order.pickupDate}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-bento-grey">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{order.pickupTimeSlot}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-bento-grey/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter inventory..."
                  className="w-full bg-bento-black border border-bento-grey rounded-full pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-bento-yellow"
                />
              </div>

              <button
                onClick={() => alert('New product form modal: Connects to Cloudflare R2 Worker API.')}
                className="px-6 py-2.5 bg-bento-yellow text-black rounded-full text-xs font-semibold hover:bg-yellow-400 transition-colors flex items-center space-x-1.5 shadow-soft"
              >
                <Plus className="w-4 h-4 text-bento-yellow" />
                <span>Add New Cake Item</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white/5 rounded-3xl shadow-xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-bento-grey/60 text-white font-serif font-bold uppercase tracking-wider text-[10px] ">
                    <tr>
                      <th className="p-4">Cake Item</th>
                      <th className="p-4">Categories</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Lead Time</th>
                      <th className="p-4">Catalog Status</th>
                      <th className="p-4">Kitchen Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-bento-black/40 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img
                              src={product.imageUuids[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-xl border border-bento-grey flex-shrink-0"
                            />
                            <div>
                              <span className="font-bold text-white block">{product.name}</span>
                              <span className="text-[11px] text-bento-grey">{product.sizes.length} sizes configured</span>
                            </div>
                          </td>
                          <td className="p-4 text-bento-grey">{product.categories.join(', ')}</td>
                          <td className="p-4 font-bold text-white font-serif">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="p-4 text-bento-grey">{product.preparationLeadTimeHours}h notice</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStatus(product.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                product.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.active ? 'Active' : 'Hidden'}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStock(product.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                product.inStock
                                  ? 'bg-bento-yellow/20 text-white'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.inStock ? 'In Stock' : 'Sold Out'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                className="p-1.5 text-bento-grey hover:text-white rounded"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAPACITY & PICKUP AVAILABILITY */}
        {activeTab === 'availability' && (
          <div className="bg-white/5 rounded-3xl shadow-xl p-6 sm:p-8 shadow-soft space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">
                Bakery Capacity & Slot Booking Controls
              </h2>
              <p className="text-xs text-bento-grey font-light mt-1">
                Toggle unavailable pickup time slots during kitchen rush hours or kitchen maintenance days.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-white">
                Standard Daily Pickup Slots
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {STANDARD_PICKUP_SLOTS.map((slot) => {
                  const isBlocked = blockedSlots.includes(slot);
                  return (
                    <div
                      key={slot}
                      onClick={() => toggleSlotBlock(slot)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isBlocked
                          ? 'bg-red-50/80 border-red-200 text-red-900'
                          : 'bg-bento-black border-bento-grey text-white hover:border-bento-yellow'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold block">{slot}</span>
                        <span className="text-[10px] text-bento-grey font-light">
                          {isBlocked ? 'Blocked for Booking' : 'Open for Customer Pickup'}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isBlocked ? 'bg-red-200 text-red-900' : 'bg-bento-yellow/20 text-white'
                        }`}
                      >
                        {isBlocked ? 'Blocked' : 'Available'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
