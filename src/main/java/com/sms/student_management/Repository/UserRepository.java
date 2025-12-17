package com.sms.student_management.Repository;

//import com.sms.student_management.Repository.*;
import com.sms.student_management.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}