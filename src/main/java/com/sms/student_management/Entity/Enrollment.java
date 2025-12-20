package com.sms.student_management.Entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "class_section_id")
    private ClassSection classSection;

    // getters & setters
    public Long getId() {
        return id;
    }       
    public void setId(Long id) {
        this.id = id;
    }
    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }
    public ClassSection getClassSection() {
        return classSection;
    }
    public void setClassSection(ClassSection classSection) {
        this.classSection = classSection;
    }
}