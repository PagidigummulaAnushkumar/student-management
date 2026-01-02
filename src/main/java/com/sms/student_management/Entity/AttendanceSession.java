package com.sms.student_management.Entity;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "attendance_sessions")
public class AttendanceSession {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "class_section_id")
    private ClassSection classSection;

    private LocalDate sessionDate;

    // getters & setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public ClassSection getClassSection() {
        return classSection;
    }
    public void setClassSection(ClassSection classSection) {
        this.classSection = classSection;
    }
    public LocalDate getSessionDate() {
        return sessionDate;
    }
    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }
    
}
