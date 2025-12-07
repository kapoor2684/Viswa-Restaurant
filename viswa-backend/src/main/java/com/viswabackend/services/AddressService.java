package com.viswabackend.services;

import com.viswabackend.model.Address;
import com.viswabackend.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository repository;

    public List<Address> findByCustomerId(Integer customerId) {
        return repository.findByCustomerId(customerId);
    }

    public Optional<Address> findById(Long id) {
        return repository.findById(id);
    }

    public Address save(Address address) {
        return repository.save(address);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Address update(Long id, Address updatedAddress) {
        return repository.findById(id)
                .map(address -> {
                    address.setCustomerId(updatedAddress.getCustomerId());
                    address.setAddressLine1(updatedAddress.getAddressLine1());
                    address.setAddressLine2(updatedAddress.getAddressLine2());
                    address.setCity(updatedAddress.getCity());
                    address.setState(updatedAddress.getState());
                    address.setPostalCode(updatedAddress.getPostalCode());
                    address.setCountry(updatedAddress.getCountry());
                    address.setIsDefault(updatedAddress.getIsDefault());
                    return repository.save(address);
                })
                .orElseThrow(() -> new RuntimeException("Address not found with id " + id));
    }
}
