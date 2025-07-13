import React, {useEffect, useState} from 'react';
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";

const LOCAL_KEY = 'cartProducts';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [location, setLocation] = useState('');
    const [showLocationInput, setShowLocationInput] = useState(false);
    const navigate = useNavigate();


    // Load cart from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(LOCAL_KEY));
        setCart(Array.isArray(stored) ? stored : []);
    }, []);

    const saveCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Remove item from cart
    const handleRemove = (id) => {
        const updated = cart.filter(item => item.id !== id);
        saveCart(updated);
    };

    // Clear cart
    const handleClearCart = () => {
        saveCart([]);
    };

    // Increase quantity
    const handleIncrease = (id) => {
        const updated = cart.map(item =>
            item.id === id ? {...item, quantity: (item.quantity || 1) + 1} : item
        );
        saveCart(updated);
    };

    // Decrease quantity
    const handleDecrease = (id) => {
        const updated = cart
            .map(item => {
                if (item.id === id) {
                    const newQty = (item.quantity || 1) - 1;
                    return newQty > 0 ? {...item, quantity: newQty} : null;
                }
                return item;
            })
            .filter(item => item !== null);

        saveCart(updated);
    };

    const handleSubmitOrder = async () => {
        const token = localStorage.getItem('access');

        if (!token) {
            toast.error("Buyurtma berish uchun tizimga kiring.");
            return;
        }

        if (!location.trim()) {
            toast.error("Manzilni kiriting.");
            return;
        }

        const orders = cart.map(item => ({
            book: item.id,
            quantity: item.quantity || 1
        }));

        try {
            await axios.post(
                'http://127.0.0.1:8000/orders/',
                {orders, location},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            toast.success("Buyurtma yuborildi!");
            handleClearCart();
            setLocation('');
            setShowLocationInput(false);
        } catch (err) {
            console.error(err);
            toast.error("Xatolik yuz berdi.");
        }
    };


    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    return (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-4">
            <ToastContainer/>
            <h1 className="text-2xl font-bold mb-6">Savat</h1>
            {cart.length === 0 ? (
                <div className="text-gray-500">Savat bo'sh.</div>
            ) : (
                <>
                    <div className="flex flex-col gap-4 mb-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center bg-white rounded-lg shadow p-3 gap-4">
                                <img
                                    src={`http://127.0.0.1:8000${item.image}`}
                                    alt={item.title}
                                    className="w-16 h-16 object-contain rounded"
                                />
                                <div className="flex-1">
                                    <div
                                        className="font-bold">{item.title.slice(0, 40)}{item.title.length > 40 && '...'}</div>
                                    <div className="text-blue-500 font-semibold">{item.price} so'm</div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center mt-2 gap-2 text-sm">
                                        <button
                                            onClick={() => handleDecrease(item.id)}
                                            className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                                        >
                                            −
                                        </button>
                                        <div>Soni: {item.quantity || 1}</div>
                                        <button
                                            onClick={() => handleIncrease(item.id)}
                                            className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    O‘chirish
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Total + clear */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="font-bold text-lg">Jami: {total.toFixed(2)} so'm</div>
                        <button
                            onClick={handleClearCart}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Savatni tozalash
                        </button>
                    </div>

                    {/* Buyurtma berish */}
                    {showLocationInput ? (
                        <>
                            {/* Manzil kiritish inputi */}
                            <div className="mb-4">
                                <label className="block font-semibold mb-1">Manzil kiriting:</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Masalan: Toshkent, Chilonzor 5, uy 12"
                                />
                            </div>

                            {/* Buyurtmani yuborish tugmasi */}
                            <button
                                onClick={handleSubmitOrder}
                                className="w-full h-12 bg-green-600 text-white rounded font-bold text-lg hover:bg-green-700 transition"
                            >
                                Yuborish
                            </button>
                        </>
                    ) : (

                        <button
                            onClick={() => setShowLocationInput(true)}
                            className="w-full h-12 bg-blue-500 text-white rounded font-bold text-lg hover:bg-blue-600 transition"
                            disabled={cart.length === 0}
                        >
                            Buyurtma berish
                        </button>


                    )}
                </>
            )}

            <button
                onClick={() => navigate('/my-orders')}
                className="w-full h-12 bg-blue-500 text-white rounded font-bold text-lg hover:bg-blue-600 transition mt-2"
            >
                Buyurtmalarim
            </button>
        </div>
    );
};

export default Cart;
