import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';




const AddBook = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image: null,
    description: '',
    price: '',
    numberOfbooks: '',
    discount: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Rasm yuklash majburiy!');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('image', formData.image);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('numberOfbooks', formData.numberOfbooks);
    data.append('category', formData.discount);

    try {
      const response = await fetch('http://127.0.0.1:8000/add_books/', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setFormData({
          title: '',
          author: '',
          description: '',
          price: '',
          number_of_books: '',
          discount: '',
          image: null,
        });
        navigate('/home')
      } else {
        alert('Xatolik yuz berdi!');
      }
    } catch (error) {
      alert('Tarmoq xatosi!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow-md rounded-xl">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-block text-sm text-green-600 hover:underline"
        >
          ← Bosh sahifaga qaytish
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📘 Yangi Kitob Qo‘shish</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kitob nomi */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Kitob nomi</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {/* Muallif */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Muallif</label>
          <input
            type="text"
            name="author"
            id="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {/* Tavsif */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Tavsif</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="form-input"
          ></textarea>
        </div>

        {/* Narx */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Narxi (so'mda)</label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {/* Nusxalar soni */}
        <div>
          <label htmlFor="numberOfbooks" className="block text-sm font-medium text-gray-700">Nusxalar soni</label>
          <input
            type="number"
            name="numberOfbooks"
            id="numberOfbooks"
            value={formData.numberOfbooks || ''}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>


        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Chegirma qilasizmi? </label>
          <input
            type="number"
            name="discount"
            id="discount"
            value={formData.discount || ''}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {/* Rasm */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Rasm (jpg/png)</label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="form-input file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Qo‘shish
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
