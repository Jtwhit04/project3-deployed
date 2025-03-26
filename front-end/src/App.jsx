import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { EmployeeProvider } from "./contexts/EmployeeContext";
import { TitleProvider } from "./contexts/TitleContext";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SelfServiceScreen from "./screens/SelfServiceScreen";
import SelfServiceOrderScreen from "./screens/SelfServiceOrderScreen";
import SelfServiceOrderConfirmationScreen from "./screens/SelfServiceOrderConfirmationScreen";
import ManagerLanding from "./screens/ManagerLanding";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import InventoryScreen from "./screens/InventoryScreen";
import MultiPageMenu from "./screens/MultiPageMenu";

import ProtectedPage from "./components/ProtectedPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  document.title = "GooberTea";
  const { ready } = useTranslation();

  if (!ready) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <EmployeeProvider>
        <TitleProvider>
          <Router>
            <div className="body">
              <Navbar />
              <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/home" element={
                  <ProtectedPage>
                    <HomeScreen />
                  </ProtectedPage>} />

                <Route path="/managerLanding" element={
                  <ProtectedPage>
                    <ManagerLanding />
                  </ProtectedPage>} />

                <Route path="/orderHistoryScreen" element={
                  <ProtectedPage>
                    <OrderHistoryScreen />
                  </ProtectedPage>} />

                <Route path="/inventoryScreen" element={
                  <ProtectedPage>
                    <InventoryScreen />
                  </ProtectedPage>
                } />

                <Route path="/self-service" element={<SelfServiceScreen />} />
                <Route path="/self-service/order" element={<SelfServiceOrderScreen />} />
                <Route path="/self-service/order-confirmation" element={<SelfServiceOrderConfirmationScreen />} />
                <Route path="/menu" element={<MultiPageMenu />} />


                <Route path="*" element={
                  <ProtectedPage>
                    <HomeScreen />
                  </ProtectedPage>
                } />
              </Routes>
              <Footer />
            </div>
          </Router>
        </TitleProvider>
      </EmployeeProvider>
    </>
  );
}

export default App;
