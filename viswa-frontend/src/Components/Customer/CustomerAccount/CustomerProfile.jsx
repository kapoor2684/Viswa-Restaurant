import React, { useState, useEffect } from 'react'; 
import { ToastContainer, toast } from 'react-toastify';
import "../../../Styles/CustomerProfile.css";
import CustomerApi from '../../../API/CustomerApi';

export default function CustomerProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    image: ""
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CustomerInfo"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        id: storedUser.id || "",  // ✅ Ensure ID is stored
        username: storedUser.username || "",
        email: storedUser.email || "",
        password: storedUser.password || "",
        dob: storedUser.dob || "",
        phone: storedUser.phone || "",
        image: storedUser.image || ""
      });
    }
  }, []);


  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result })); // ✅ Updates `formData.image`
      };
      reader.readAsDataURL(file);
    }
  };
// Inside component
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSaveChanges = async (e) => {
  e.preventDefault();

  if (!user?.id) {
    toast("User ID missing! Cannot update profile.");
    return;
  }

  try {
    const response = await CustomerApi.updateCustomerInfo(user.id, formData);
    toast("Customer information updated successfully!");
    setUser(response);
    localStorage.setItem('CustomerInfo', JSON.stringify(response));
  } catch (error) {
    toast("Failed to update customer information. Please try again.");
  }
};




  return (
    <div className="customer-profile-container">
      <h2>Profile Details</h2>

      <form className="profile-form" onSubmit={handleSaveChanges}>
        <div className="profile-upper-part">
          <div className="profile-left-side">
            <label htmlFor="profile-upload">
              <img
                src={profileImage || formData.image || "https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg"}
                alt="Profile"
                className="profile-image"
              />
            </label>
            <input type="file" id="profile-upload" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="profile-right-side">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          </div>
        </div>
        <div className="profile-lower-part">
          <input type="text" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} />
          <button type="submit" className='profile-submit-btn'>Save Changes</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
