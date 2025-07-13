import { create } from 'zustand';
import { base_address } from '../api/api_address';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    set({ user: null });
  },

  deleteAccount: async () => {
    const token = localStorage.getItem('access');
    try {
      const response = await fetch(`${base_address}/delete/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        set({ user: null });
        alert("Hisob o‘chirildi.");
      } else {
        const data = await response.json();
        alert("Xatolik: " + (data.detail || "Hisobni o‘chirishda muammo"));
      }
    } catch (err) {
      console.error("Server xatosi:", err);
      alert("Tizim bilan bog‘lanib bo‘lmadi.");
    }
  },
}));

export default useAuthStore;
