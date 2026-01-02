package com.sms.student_management.Entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "parents")
public class Parent {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // getters & setters
   
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}