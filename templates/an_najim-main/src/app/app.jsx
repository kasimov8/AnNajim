import {Routes, Route, Navigate} from 'react-router-dom';
import {Register, Login, Home, Layout, Search, Like, Cart, Profile, BookDetail} from '../constant';
import useAuthStore from '../store/useAuthStore';
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AddBook from "../pages/AddBook.jsx"
import EditBook from "../pages/EditBook.jsx";
import Orders from "../pages/Orders.jsx";

const App = () => {
    const {user} = useAuthStore(); // HOOK ICHIDAN USERNI OL!

    return (
        <Routes>
            {/* Foydalanuvchiga qarab boshlang‘ich sahifani ko‘rsat */}
            <Route path="/" element={<Navigate to="/home"/>}/>

            <Route element={<Layout/>}>
                <Route path="/home" element={<Home/>}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/like" element={<Like/>}/>
                <Route path="/orders/" element={<Orders/>} />
                <Route path="/profile" element={<Profile/>}/>
            </Route>

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                }
            />

            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/book/:id" element={<BookDetail/>}/>
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/edit-book/:id" element={<EditBook />} />


        </Routes>
    );
};

export default App;
