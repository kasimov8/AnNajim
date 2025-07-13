import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterBannerImg from '../assets/images/books.world.jpg';
import useAuthStore from '../store/useAuthStore';
import { base_address } from '../api/api_address';


const Register = () => {
  const [username, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetch(`${base_address}/register/`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Xatolik:", err));
  }, []);

  const phonenumbers = data.map(item => item.phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim()) {
      alert("Ismingizni kiriting!");
      return;
    }
    if (!/^\+998\d{9}$/.test(phone)) {
      alert("Telefon raqamni to'g'ri kiriting! (+998XXXXXXXXX)");
      return;
    }


    const newUser = { username, phone, email, password, };

    if (!phonenumbers.includes(phone)) {
      try {
        const response = await fetch(`${base_address}/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newUser)
        });

        const data = await response.json();
        if (response.ok) {
          alert("Muvaffaqiyatli ro‘yxatdan o‘tildi!");
          navigate('/login');
        } else {
          alert("Xatolik: " + JSON.stringify(data));
        }
      } catch (error) {
        console.error("Xatolik:", error);
        alert("Tarmoqda xatolik yuz berdi.");
      }
    } else {
      alert("Bu telefon raqami bilan foydalanuvchi allaqachon mavjud!");
    }
  };


  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center">
      <div className="hidden lg:block lg:w-1/2 w-[50%] h-screen">
        <img
          src={RegisterBannerImg}
          alt="register-banner-img"
          className="w-full h-full object-cover"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 py-10"
      >
        <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[75%] xl:w-[60%] bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="py-6 px-4 flex justify-center">
            <h1 className="text-2xl text-green-600 font-bold text-center">Ro'yxatdan o'tish</h1>
          </div>

          {/* Form Inputs */}
          <div className="bg-green-600 rounded-tl-[3rem] py-8 px-4 sm:px-6">

            <div className="mb-4">
              <label className="text-white block">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
                className="w-full h-[40px] bg-white px-3 mt-2 rounded-md outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-white block">Telefon raqamingiz:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon raqam"
                className="w-full h-[40px] bg-white px-3 mt-2 rounded-md outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-white block">Emailingiz:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-[40px] bg-white px-3 mt-2 rounded-md outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-white block">Parol yarating:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full h-[40px] bg-white px-3 mt-2 rounded-md outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-[40px] bg-white text-green-600 font-bold rounded-md cursor-pointer"
            >
              Ro'yxatdan o'tish
            </button>


            <p className="mt-5 text-gray-300 text-sm text-center">
              Accauntingiz bormi?{' '}
              <Link to="/login" className="text-white underline">Tizimga kirish</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
