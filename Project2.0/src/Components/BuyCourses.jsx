import React, { useState } from "react";
import Loader from './Loader'; // Import Loader component

const BuyCourses = ({ contract, account, addToCart, buyCourse, setLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(""); // State to store the YouTube link

  const courses = [
    { id: 1, name: "Web Development", description: "Learn to build websites", image: "/images/web-dev.jpg", price: "Tkn 10" },
    { id: 2, name: "Blockchain Basics", description: "Understand the fundamentals of blockchain", image: "/images/blockchain.jpg", price: "Tkn 50" },
    { id: 3, name: "Data Science", description: "Analyze data with Python", image: "/images/data-science.jpg", price: "Tkn 20" },
    { id: 4, name: "Digital Marketing", description: "Grow your business online", image: "/images/digital-marketing.jpg", price: "Tkn 30" },
  ];

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuyClick = (course) => {
    setSelectedCourse(course);
    setName('');
    setAddress('');
    setContact('');
    setQuantity(1);
  };
  const handleBuyCourse = async (e) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet to proceed.");
      return;
    }
  
    // setLoading(true); // Show loader
    try {
      await buyCourse(selectedCourse, quantity, name, address, contact); // Call with appropriate params
      // setCartMessage(`${selectedCourse.name} purchased successfully!`);
      
      // Fetch the YouTube link after purchase
      const courseDetails = await contract.methods.courses(selectedCourse.id).call();
      setYoutubeLink(courseDetails.youtubeLink); // Set the YouTube link
  
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error buying course:", error.message);
      setCartMessage(`Error buying ${selectedCourse.name}.`);
    } finally {
      // setLoading(false); // Hide loader
      // setTimeout(() => setCartMessage(""), 3000);
    }
  };
  
  const handleAddToCart = (course) => {
    setLoading(true); // Show loader
    setCartMessage(`Adding ${course.name} to cart...`);
    addToCart(course)
      .then(() => {
        setCartMessage(`${course.name} added to cart!`);
        setTimeout(() => setCartMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error adding course to cart:", error.message);
        setCartMessage(`Failed to add ${course.name} to cart.`);
        setTimeout(() => setCartMessage(""), 3000);
      })
      .finally(() => {
        setLoading(false); // Hide loader
      });
  };

  return (
    <div className="container mx-auto py-12 px-6 flex flex-col items-center bg-gray-100">
      <Loader />
      {cartMessage && <div className="text-yellow-600 mb-4">{cartMessage}</div>}
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Buy Courses</h2>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search courses"
        className="mb-4 w-full max-w-lg px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {selectedCourse && (
        <form onSubmit={handleBuyCourse} className="space-y-4 w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-400 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="w-full px-4 py-2 border border-gray-400 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact"
            className="w-full px-4 py-2 border border-gray-400 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            placeholder="Quantity"
            min="1"
            className="w-full px-4 py-2 border border-gray-400 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Confirm Purchase
            </button>
            <button
              type="button"
              onClick={() => setSelectedCourse(null)}
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {youtubeLink && (
        <div className="mt-6 w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Video</h3>
          <iframe
            width="560"
            height="315"
            src={youtubeLink}
            title="Course Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center hover:shadow-xl transition-shadow duration-300"
          >
            <img src={course.image} alt={course.name} className="w-32 h-32 object-cover rounded-lg" />
            <div className="flex flex-col justify-between items-start md:ml-6 mt-4 md:mt-0">
              <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{course.description}</p>
              <p className="text-blue-600 font-bold">{course.price}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleBuyClick(course)}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Buy
                </button>
                <button
                  onClick={() => handleAddToCart(course)}
                  className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>  
    
  );
};

export default BuyCourses;
