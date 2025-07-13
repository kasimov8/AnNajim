import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { base_address } from '../api/api_address';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // 🟢 Modal uchun tanlangan order
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${base_address}/orders/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Buyurtmalarni olishda xatolik:', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Barcha Buyurtmalar</h1>

      {orders.length === 0 ? (
        <p>Buyurtmalar mavjud emas.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)} // 🔥 Tanlash
              className="bg-white p-2 rounded shadow flex items-center cursor-pointer"
            >
              <img
                src={order.book_image}
                alt={order.book}
                className="w-[80px] h-[80px] rounded-[10px]"
              />
              <div className="ml-4">
                <p className="text-sm"><strong>Kitob:</strong> {order.book}</p>
                <p className="text-sm"><strong>Soni:</strong> {order.quantity}</p>
                <p className="text-sm"><strong>Buyurtmachi:</strong> {order.user}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟨 Modal chiqishi */}
      {selectedOrder && (
        <div
          className="w-full h-screen fixed top-0 left-0 bg-[#0005] flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)} // 🔙 Modalni yopish
        >
          <div
            className="w-[90%] md:w-[60%] lg:w-[40%] bg-white rounded-[10px] p-4 flex flex-col md:flex-row items-center gap-4"
            onClick={(e) => e.stopPropagation()} // Modal ichini bosganda yopilmasin
          >
            <img
              src={selectedOrder.book_image}
              alt={selectedOrder.book}
              className="w-[250px] h-[250px] object-cover rounded-[10px]"
            />
            <div className="text-sm w-full">
              <p className="mt-1"><strong>Kitob:</strong> {selectedOrder.book}</p>
              <p className="mt-1"><strong>Soni:</strong> {selectedOrder.quantity}</p>
              <p className="mt-1"><strong>Buyurtmachi:</strong> {selectedOrder.user}</p>
              <p className="mt-1"><strong>Manzil:</strong> {selectedOrder.location}</p>
              <p className="mt-1">
                <strong>Vaqt:</strong> {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
              <p className="mt-1"><strong>Narxi (1 dona):</strong> {Number(selectedOrder.price).toLocaleString()} so'm</p>
              <p className="mt-1"><strong>Jami:</strong> {Number(selectedOrder.total_price).toLocaleString()} so'm</p>
              <Link
                to={`tel:${selectedOrder.phone_number}`}
                className="block w-full text-center mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Qo‘ng‘iroq qilish: {selectedOrder.phone_number}
              </Link>
              <button
                onClick={() => setSelectedOrder(null)}
                className="block w-full mt-2 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
