package com.sms.student_management.Service;

import com.sms.student_management.Entity.Parent;
import com.sms.student_management.Entity.User;
import com.sms.student_management.Repository.ParentRepository;
import com.sms.student_management.Repository.UserRepository; // Assuming you have this
import org.springframework.stereotype.Service;

@Service
public class ParentService {

    private final ParentRepository parentRepository;
    private final UserRepository userRepository;

    public ParentService(ParentRepository parentRepository, UserRepository userRepository) {
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
    }

    // Create
    public Parent createParent(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Parent parent = new Parent();
        parent.setUser(user);

        return parentRepository.save(parent);
    }

    // Read All
    public Iterable<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    // Read One
    public Parent getParentById(Long id) {
        return parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parent not found with ID: " + id));
    }

    // Update
    public Parent updateParent(Long id, Long userId) {
        Parent parent = getParentById(id);

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            parent.setUser(user);
        }

        return parentRepository.save(parent);
    }

    // Delete
    public void deleteParent(Long id) {
        parentRepository.deleteById(id);
    }
}