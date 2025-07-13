import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import {MapPin, User2} from 'lucide-react';
import {ToastContainer, toast} from "react-toastify";
import {Phone, Mail} from 'lucide-react';
import axios from './axios.js';


const LOCAL_PROFILE_KEY = 'profileData';

// Modal Component
const Modal = ({open, onClose, children}) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                    className="absolute top-0 right-2 text-gray-400 py-2 px-3 cursor-pointer text-2xl"
                    onClick={onClose}
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

const Profile = () => {
    const {user, logout, deleteAccount} = useAuthStore();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [editOpen, setEditOpen] = useState(false);


    const [editUsername, setEditUsername] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');



    useEffect(() => {
        axios.get('http://127.0.0.1:8000/profile/')
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error("Xatolik:", err);
                // alert("Token xato yoki foydalanuvchi tizimga kirmagan.");
            });
    }, []);


    console.log(data)

    if (!data) return <p>Yuklanmoqda...</p>;


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Rostdan ham akkauntingizni o‘chirmoqchimisiz?");
        if (confirmed) {
            await deleteAccount(); // backenddan ham o‘chadi
            navigate('/register');
        }
    };

    const handleEditOpen = () => {
        setEditOpen(true);
        setEditUsername(data.username || '');
        setEditPhone(data.phone || '');
        setEditEmail(data.email || '');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access');
        const updatedData = {
            username: editUsername,
            phone: editPhone,
            email: editEmail,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/profile/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setData(updatedUser);
                setEditOpen(false);
                toast.success(<p className='text-green-500 text-[12px]'>Ma'lumot yangilandi.</p>)
            } else {
                const err = await response.json();
                toast.error(<p className='text-red-500 text-[12px]'>Nimadir xato ketdi!</p>)
            }
        } catch (err) {
            console.error("Tarmoq xatosi:", err);
            toast.error(<p className='text-red-500 text-[12px]'>Tizim bilan bog‘lanishda xatolik!</p>)
        }
    };


    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
            <ToastContainer/>
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center relative">
                <div className="bg-green-600 p-6 text-[50px] rounded-full mb-4">
                    <User2 className='text-white w-12 h-12'/>
                </div>
                <h2 className="text-2xl font-bold mb-2">{data.username || 'Guest'}</h2>
                <p className="text-gray-600 mb-2 flex"><Phone
                    className='py-[3px] px-[3px] mr-2'/> {data.phone || 'No phone number'}</p>
                <p className="text-gray-600 mb-2 flex"><Mail
                    className='py-[3px] px-[3px] mr-2'/> {data.email || 'No email'}</p>

                {data?.is_staff && (
                    <p className="text-white text-[12px] rounded-[5px] mb-2 flex absolute top-[10px] right-[10px] py-[3px] px-2 bg-green-600">Admin</p>
                )}

                {data?.map && (
                    <div className="w-full mb-4">
                        <iframe
                            src={data.map}
                            title="Map"
                            className="w-full h-40 rounded"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <button
                        onClick={handleEditOpen}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        Logout
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Delete Account
                    </button>
                </div>

                {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
            </div>

            {/* Edit Modal */}
            <Modal open={editOpen} onClose={() => setEditOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Username:</label>
                        <input
                            type="text"
                            value={editUsername}
                            onChange={e => setEditUsername(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Phone:</label>
                        <input
                            type="text"
                            value={editPhone}
                            onChange={e => setEditPhone(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Email:</label>
                        <input
                            type="text"
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Saqlash
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Profile;
