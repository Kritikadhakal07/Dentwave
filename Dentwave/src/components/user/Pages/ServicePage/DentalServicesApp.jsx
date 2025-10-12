import React, { useState } from 'react';
import BookingPage from './BookingPage';
import ServiceDetailsPage from './ServiceDetail';
import ServicesPage from './Service';



const DentalServicesApp = () => {
  const [currentPage, setCurrentPage] = useState('services');
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentServices, setAppointmentServices] = useState([]);

  const handleLearnMore = (service) => {
    setSelectedService(service);
    setCurrentPage('details');
  };

  const handleAddToAppointment = (service) => {
    if (!appointmentServices.find(s => s.id === service.id)) {
      setAppointmentServices([...appointmentServices, service]);
    }
    setCurrentPage('booking');
  };

  const handleRemoveService = (serviceId) => {
    setAppointmentServices(appointmentServices.filter(s => s.id !== serviceId));
    if (appointmentServices.length === 1) {
      setCurrentPage('services');
    }
  };

  const handleConfirmBooking = () => {
    setAppointmentServices([]);
    setCurrentPage('services');
  };

  const handleBackToServices = () => {
    setCurrentPage('services');
  };

  return (
    <>
      {/* <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      /> */}
    

      {currentPage === 'services' && (
        <ServicesPage onLearnMore={handleLearnMore} />
      )}
      
      {currentPage === 'details' && (
        <ServiceDetailsPage 
          service={selectedService}
          onBack={handleBackToServices}
          onAddToAppointment={handleAddToAppointment}
        />
      )}
      
      {currentPage === 'booking' && (
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