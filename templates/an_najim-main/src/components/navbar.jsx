// components/Navbar.jsx
import {NavLink} from 'react-router-dom';
import {FaHeart, FaSearch, FaShoppingCart} from "react-icons/fa";
import {FaHouse} from "react-icons/fa6";
import {IoPersonCircleSharp} from "react-icons/io5";
import React, {useEffect, useState} from 'react';
import {BookOpen} from "lucide-react";

const LOCAL_KEY = 'cartProducts';

const Navbar = () => {
    const [cartCount, setCartCount] = useState(0);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('access');

        fetch('http://127.0.0.1:8000/profile/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Token noto‘g‘ri yoki muddati tugagan.");
                return res.json();
            })
            .then(profile => setProfile(profile))

            .catch(err => {
                console.error("Xatolik:", err);
                alert("Token xato yoki foydalanuvchi tizimga kirmagan.");
            });
    }, []);

    // Update badge count on mount and when cart changes
    useEffect(() => {
        const updateCartCount = () => {
            const stored = JSON.parse(localStorage.getItem(LOCAL_KEY));
            if (Array.isArray(stored)) {
                // Sum all quantities if present, else count items
                const count = stored.reduce((sum, item) => sum + (item.quantity || 1), 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        };

        updateCartCount();

        // Listen to storage changes (for multi-tab support)
        window.addEventListener('storage', updateCartCount);

        // Listen to custom event for in-app cart updates
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    return (
        <nav
            className="fixed z-10 flex items-center justify-center md:px-2 px-0 md:w-[80px] md:h-full md:right-0 md:top-0 md:flex-col w-full h-[70px] left-0 bottom-0 flex-row md:left-auto md:bottom-auto">
            <ul
                id="navbar"
                className={`w-full ${profile?.is_staff ? 'md:h-[38%]' : 'md:h-[30%]'} h-full bg-white md:rounded-[10px] justify-center text-center md:py-2 py-0 md:px-2 px-0 shadow-xl flex md:flex-col flex-row items-center`}
            >
                <NavLink to="/home"
                         className="flex items-center justify-center sm:py-2 py-4 sm:px-2 px-4 rounded-[10px] mx-2 md:mx-0 mt-0 md:mt-2"><FaHouse
                    className="text-[#aaa] text-[20px]" id="icon"/></NavLink>
                <NavLink to="/search"
                         className="flex items-center justify-center sm:py-2 py-4 sm:px-2 px-4 rounded-[10px] mx-2 md:mx-0 mt-0 md:mt-2"><FaSearch
                    className="text-[#aaa] text-[20px]" id="icon"/></NavLink>
                <NavLink
                    to="/cart"
                    className="relative flex items-center justify-center sm:py-2 py-4 sm:px-2 px-4 rounded-[10px] mx-2 md:mx-0 mt-0 md:mt-2"
                >
                    <FaShoppingCart className="text-[#aaa] text-[20px]" id="icon"/>
                    {cartCount > 0 && (
                        <span
                            className="absolute top-[6px] right-[4px] md:top-[-6px] md:right-[-6px] bg-red-500 text-white text-[10px] leading-none rounded-full px-[6px] py-[2px] font-bold min-w-[18px] h-[18px] text-center flex items-center justify-center shadow-md">
              {cartCount}
            </span>

                    )}
                </NavLink>

                <NavLink to="/like"
                         className="flex items-center justify-center sm:py-2 py-4 sm:px-2 px-4 rounded-[10px] mx-2 md:mx-0 mt-0 md:mt-2"><FaHeart
                    className="text-[#aaa] text-[20px]" id="icon"/></NavLink>
                {profile?.is_staff && (
                    <NavLink to="/orders"
                         className="flex items-center justify-center sm:py-2 py-4 sm:px-2 px-4 rounded-[10px] mx-2 md:mx-0 mt-0 md:mt-2"><BookOpen
                    className="text-[#aaa] text-[20px]" id="icon"/></NavLink>
                )}
                <NavLink to="/profile"
                         className="flex items-center justify-center sm:py-2 py-4 sm:px-2 px-4 rounded-[10px] mx-2 md:mx-0 mt-0 md:mt-2"><IoPersonCircleSharp
                    className="text-[#aaa] text-[20px]" id="icon"/></NavLink>

            </ul>
        </nav>
    );
};

export default Navbar;
