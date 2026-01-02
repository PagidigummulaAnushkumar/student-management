package com.sms.student_management.Entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @ManyToOne
    private ClassSection classSection;

    private int maxMarks;

    // getters & setters
    public Long getId() {
        return id;
    }                   

    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ClassSection getClassSection() {
        return classSection;
    }
    public void setClassSection(ClassSection classSection) {
        this.classSection = classSection;
    }
    public int getMaxMarks() {
        return maxMarks;
    }
    public void setMaxMarks(int maxMarks) {
        this.maxMarks = maxMarks;
    }
}