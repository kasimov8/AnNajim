// src/pages/Home.jsx
import {useNavigate} from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {useEffect, useState} from 'react';
import axios from "./axios.js";
import { base_address } from '../api/api_address.js';

const Home = () => {
    const {user} = useAuthStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);
    const [discountedbooks, setDiscountedBooks] = useState([]);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        axios.get(`${base_address}/profile/`)
            .then(res => {
                setProfile(res.data);
            })
            .catch(err => {
                console.error("Xatolik:", err);
                // alert("Token xato yoki foydalanuvchi tizimga kirmagan.");
            });
    }, []);

    console.log(profile)

    useEffect(() => {
        fetch(`${base_address}/books/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Tarmoq xatosi!');
                }
                return response.json();
            })
            .then(books => {
                setBooks(books);
                setLoading(false)

            })
            .catch(error => {
                console.error('Xatolik:', error);
            });
    }, []);

    console.log(books)

    useEffect(() => {
        fetch(`${base_address}/discountedbooks/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Tarmoq xatosi!');
                }
                return response.json();
            })
            .then(discountedbooks => {
                setDiscountedBooks(discountedbooks);
                setLoading(false)

            })
            .catch(error => {
                console.error('Xatolik:', error);
            });
    }, []);

    return (
        <div className='w-full min-h-screen bg-gray-50'>
            <div
                className='w-full h-[50px] py-2 px-2 bg-white shadow-sm sticky top-0 z-10 flex items-center justify-center'>
                <h1 className='md:text-[20px] text-[15px] font-semibold text-gray-800 text-center'>
                    <span className='font-bold  text-green-700'> An-najimga</span> xush
                    kelibsiz, {profile?.username || 'Guest'}
                </h1>
            </div>

            <div className='p-4 md:pb-6 pb-[5rem]'>
                <h1 className='text-[25px] mb-2 mt-2'>Chegirmali Kitoblar</h1>

                {error ? (
                    <div className='w-full h-[70vh] flex justify-center items-center'>
                        <p className='text-red-500 mb-4'>{error}</p>
                    </div>
                ) : loading ? (
                    <div className='w-full flex justify-center items-center h-[70vh]'>
                        <div id="loader"></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2'>
                        {discountedbooks.map((books) => (
                            <div
                                key={books.id}
                                onClick={() => navigate(`/book/${books.id}`)}
                                className='bg-white shadow-sm rounded-xl overflow-hidden transition duration-300 cursor-pointer relative'
                            >
                                <div className='w-full h-[150px] flex items-center justify-center'>
                                    <img
                                        src={`${base_address}${books.image}`}
                                        alt={books.title}
                                        className='w-[90%] h-[90%] object-cover rounded-[10px]'
                                    />
                                </div>
                                <div className='p-[10px]'>
                                    <h2 className='text-sm font-semibold text-black mb-2'>
                                        {books.title
                                            ? books.title
                                            : books.title}
                                    </h2>
                                    <p className='text-black font-bold text-[15px]'>
                                        {books.price} so'm
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='p-4 md:pb-6 pb-[5rem]'>
                <h1 className='text-[25px] mb-2 mt-2'>Barcha Kitoblar</h1>

                {error ? (
                    <div className='w-full h-[70vh] flex justify-center items-center'>
                        <p className='text-red-500 mb-4'>{error}</p>
                    </div>
                ) : loading ? (
                    <div className='w-full flex justify-center items-center h-[70vh]'>
                        <div id="loader"></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2'>
                        {books.map((books) => (
                            <div
                                key={books.id}
                                onClick={() => navigate(`/book/${books.id}`)}
                                className='bg-white shadow-sm rounded-xl overflow-hidden transition duration-300 cursor-pointer relative'
                            >
                                <div className='w-full h-[150px] flex items-center justify-center'>
                                    <img
                                        src={`${base_address}${books.image}`}
                                        alt={books.title}
                                        className='w-[90%] h-[90%] object-cover rounded-[10px]'
                                    />
                                </div>
                                <div className='p-[10px]'>
                                    <h2 className='text-sm font-semibold text-black mb-2'>
                                        {books.title
                                            ? books.title
                                            : books.title}
                                    </h2>
                                    <p className='text-black font-bold text-[15px]'>
                                        {books.price} so'm
                                    </p>
                                </div>
                            </div>
                        ))}
                        {profile?.is_staff && (
                            <button
                                onClick={() => navigate('/add-book')}
                                className="fixed bottom-18 right-4 md:bottom-6 md:right-6 bg-green-600 text-white px-4 py-2 md:px-5 md:py-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300 text-sm md:text-base z-50"
                            >
                                + Yangi kitob qo‘shish
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
