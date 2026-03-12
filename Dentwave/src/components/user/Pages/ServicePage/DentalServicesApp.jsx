import React, { useState } from "react";
import BookingPage from "./BookingPage";
import ServiceDetailsPage from "./ServiceDetail";
import ServicesPage from "./Service";


const DentalServicesApp = ({
  appointmentServices,
  onAddService,
  onRemoveService,
  onClearServices,
}) => {
  const [currentPage, setCurrentPage]         = useState("services");
  const [selectedService, setSelectedService] = useState(null);

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setCurrentPage("details");
  };

  const handleAddToAppointment = (service) => {
    onAddService(service);       
    setCurrentPage("booking");
  };

  const handleRemoveService = (serviceId) => {
    onRemoveService(serviceId);   // ✅ updates state in App.jsx
    if (appointmentServices.length === 1) {
      setCurrentPage("services"); // last service removed → go back
    }
  };

  const handleConfirmBooking = () => {
    onClearServices();            // ✅ clears state in App.jsx
    setCurrentPage("services");
  };

  const handleBackToServices = () => setCurrentPage("services");

  return (
    <>
      {currentPage === "services" && (
        <ServicesPage onLearnMore={handleLearnMore} />
      )}

      {currentPage === "details" && (
        <ServiceDetailsPage
          service={selectedService}
          onBack={handleBackToServices}
          onAddToAppointment={handleAddToAppointment}
        />
      )}

      {currentPage === "booking" && (
        <BookingPage
          selectedServices={appointmentServices}
          onRemoveService={handleRemoveService}
          onConfirm={handleConfirmBooking}
          onBack={handleBackToServices}
        />
      )}
    </>
  );
};

export default DentalServicesApp;