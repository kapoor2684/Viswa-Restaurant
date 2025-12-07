import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage"
import RestaurateurDashboard from "./Components/Restaurants/RestaurateurDashboard"
import CustomerDasboard from "./Components/Customer/customerDashboard/CustomerDasboard"
import RegistrationForm from "./Components/commonComponents/RegistrationForm"
import CustomerAccount from "./Components/Customer/CustomerAccount/CustomerAccount"
import SelectedFoodByCategory from "./Components/Customer/SelectedFoodByCategory"
import Index from "./Components/Customer/Index"
import BookingOptions from "./Components/Customer/Reservation/BookingOptions"
import Cart from "./Components/commonComponents/Cart"
function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer" element={<CustomerDasboard />} />
          <Route path="/registrationform" element={<RegistrationForm />} />
          <Route path="/customeraccount" element={<CustomerAccount />} />
          <Route path="/selectedcategory/" element={<SelectedFoodByCategory />} />
          <Route path="/indexpage" element={<Index />} />
          <Route path="/bookingoption" element={<BookingOptions />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/restaurateur" element={<RestaurateurDashboard />} />
        </Routes>
      </BrowserRouter>

    </React.Fragment>
  );
}

export default App;
