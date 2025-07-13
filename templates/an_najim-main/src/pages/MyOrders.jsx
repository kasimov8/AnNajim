import React, {useEffect, useState} from 'react';
import axios from './axios.js';
import {Link} from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/orders/my/');
                setOrders(res.data);
            } catch (err) {
                console.error('Buyurtmalarni olishda xatolik:', err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-4">
            <div className='mt-2 mb-2 flex'>
                <ChevronLeft />
                <Link to={'/cart'} className='underline text-green-600 ml-2'>Ortga qaytish</Link>
            </div>
            <h1 className="text-xl font-bold mb-4">Mening buyurtmalarim</h1>

            {orders.length === 0 ? (
                <p>Buyurtmangiz hali mavjud emas.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white shadow p-4 rounded cursor-pointer flex items-center"
                        >
                            <img
                                src={order.book_image || "https://via.placeholder.com/80"}
                                alt={order.book}
                                className="w-[80px] h-[80px] object-cover rounded"
                            />
                            <div className="ml-4 text-sm">
                                <p><strong>Kitob:</strong> {order.book}</p>
                                <p><strong>Soni:</strong> {order.quantity}</p>
                                <p><strong>Vaqt:</strong> {new Date(order.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🟨 Modal chiqishi */}
            {selectedOrder && (
                <div
                    className="w-full h-screen fixed top-0 left-0 bg-[#0005] flex items-center justify-center z-50"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="w-[90%] md:w-[60%] lg:w-[40%] bg-white rounded-[10px] p-4 flex flex-col md:flex-row items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedOrder.book_image || "https://via.placeholder.com/250"}
                            alt={selectedOrder.book}
                            className="w-[250px] h-[200px] object-cover rounded-[10px]"
                        />
                        <div className="text-sm w-full">
                            <p className="mt-1"><strong>Kitob:</strong> {selectedOrder.book}</p>
                            <p className="mt-1"><strong>Soni:</strong> {selectedOrder.quantity}</p>
                            <p className="mt-1">
                                <strong>Vaqt:</strong> {new Date(selectedOrder.created_at).toLocaleString()}
                            </p>
                            <p className="mt-1"><strong>Narxi (1 dona):</strong> {Number(selectedOrder.price).toLocaleString()} so'm</p>
                            <p className="mt-1"><strong>Jami:</strong> {Number(selectedOrder.total_price).toLocaleString()} so'm</p>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="block w-full mt-4 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black rounded"
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

export default MyOrders;
