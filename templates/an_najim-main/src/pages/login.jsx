import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import RegisterBannerImg from '../assets/images/books.world.jpg';
import {ToastContainer, toast} from 'react-toastify'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, password})
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                toast.success(<p className='text-green-500 text-[12px]'>Muvaffaqiyatli tizimga kirdingiz!</p>)
                setTimeout((() => {
                    navigate("/home");
                }), 1000)
            } else {
                setError(data.detail || "Login ma’lumotlari noto‘g‘ri");
                toast.error(<p className='text-red-500 text-[12px]'>Login ma’lumotlari noto‘g‘ri</p>)
            }
        } catch (error) {
            console.error("Server bilan bog‘lanishda xatolik:", error);
            setError("Server bilan bog‘lanishda xatolik yuz berdi.");
            toast.error(<p className='text-red-500 text-[12px]'>Server bilan bog‘lanishda xatolik yuz berdi.</p>)

        }
    };


    return (
        <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center">
            <form onSubmit={handleLogin} className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 py-10">
                <div
                    className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[75%] xl:w-[60%] bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="py-6 px-4 flex justify-center">
                        <h1 className="text-2xl text-blue-500 font-bold text-center">Tizimga kirish</h1>
                    </div>

                    <div className="bg-[#2970ff] rounded-tl-[3rem] py-8 px-4 sm:px-6">
                        <ToastContainer/>
                        <div className="mb-4">
                            <label className="text-white block">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='Username'
                                className='w-full h-[40px] bg-white px-3 mt-2 rounded-md outline-none'
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-white block">Parolingiz:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='********'
                                className='w-full h-[40px] bg-white px-3 mt-2 rounded-md outline-none'
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[40px] bg-white text-[#2970ff] font-bold rounded-md cursor-pointer"
                        >
                            Tizimga kirish
                        </button>

                        <p className="mt-5 text-gray-300 text-sm text-center">
                            Akkountingiz yo‘qmi? <Link to="/register" className="text-white underline">Ro'yxatdan
                            o'tish</Link>
                        </p>
                    </div>
                </div>
            </form>

            {/* Chap taraf - Rasm */}
            <div className="hidden lg:block lg:w-1/2 w-[50%] h-screen">
                <img
                    src={RegisterBannerImg}
                    alt="register-banner-img"
                    className="w-full h-full object-cover"
                />
            </div>

        </div>
    );
};

export default Login;
