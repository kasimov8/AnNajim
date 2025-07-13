import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditBook = () => {
  const { id } = useParams();
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

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ma'lumotni yuklab olish
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/booksdetail/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title || '',
          author: data.author || '',
          image: null,
          description: data.description || '',
          price: data.price || '',
          numberOfbooks: data.numberOfbooks || '',
          discount: data.discount || '',
        });
        setPreviewImage(`http://127.0.0.1:8000${data.image}`);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Xatolik:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const selectedFile = files[0];
      setFormData((prev) => ({ ...prev, image: selectedFile }));
      if (selectedFile) {
        setPreviewImage(URL.createObjectURL(selectedFile));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append('title', formData.title);
    updatedData.append('author', formData.author);
    if (formData.image) {
      updatedData.append('image', formData.image);
    }
    updatedData.append('description', formData.description);
    updatedData.append('price', formData.price);
    updatedData.append('numberOfbooks', formData.numberOfbooks);
    updatedData.append('category', formData.category);
    updatedData.append('discount', formData.discount);



    try {
      const response = await fetch(`http://127.0.0.1:8000/booksdetail/${id}/`, {
        method: 'PUT',
        body: updatedData,
      });

      if (response.ok) {
        navigate(`/book/${id}`);
      } else {
        alert("❌ Xatolik: Kitob yangilanmadi.");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("❌ Server bilan bog‘lanishda xatolik yuz berdi.");
    }
  };

  if (loading) return <p className="text-center mt-10">Yuklanmoqda...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Kitobni tahrirlash</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Sarlavha"
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Muallif"
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tavsif"
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Narx"
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          name="numberOfbooks"
          value={formData.numberOfbooks}
          onChange={handleChange}
          placeholder="Kitoblar soni"
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Chegirma"
          className="w-full border rounded px-3 py-2"
          required
        />

        <div>
          <label className="block mb-1 font-medium">Yangi rasm (ixtiyoriy):</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Kitob rasmi"
              className="w-32 h-32 object-cover mt-3 rounded border"
            />
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Saqlash
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
