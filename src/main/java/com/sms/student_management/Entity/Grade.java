package com.sms.student_management.Entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    private Assessment assessment;

    @ManyToOne
    private Student student;

    private int marks;

    // getters & setters    
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public Assessment getAssessment() {
        return assessment;
    }
    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }
    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }
    public int getMarks() {
        return marks;
    }
    public void setMarks(int marks) {
        this.marks = marks;
    }
}
