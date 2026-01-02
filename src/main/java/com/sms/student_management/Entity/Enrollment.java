// package com.sms.student_management.Entity;

// import java.time.LocalDateTime;

// import jakarta.persistence.*;

// @Entity
// @Table(name = "enrollments")
// public class Enrollment {

//     @Id
//     @GeneratedValue
//     private Long id;

//     @ManyToOne
//     @JoinColumn(name = "student_id")
//     private Student student;

//     @ManyToOne
//     @JoinColumn(name = "class_section_id")
//     private ClassSection classSection;

//     // set status
    
//     @Column(name = "status")
//     private String status;

//     // @ManyToOne
//     @Column(name = "enrollment_at", nullable = false)
//     private LocalDateTime enrollmentDate;

 


//     // getters & setters
//     public Long getId() {
//         return id;
//     }       
//     public void setId(Long id) {
//         this.id = id;
//     }
//     public Student getStudent() {
//         return student;
//     }
//     public void setStudent(Student student) {
//         this.student = student;
//     }
//     public ClassSection getClassSection() {
//         return classSection;
//     }
//     public void setClassSection(ClassSection classSection) {
//         this.classSection = classSection;
//     }

//        public String getStatus() {
//         return status;
//     }
//     public void setStatus(String status) {
//         this.status = status;
//     }

//     public LocalDateTime getEnrollmentDate() {
//         return enrollmentDate;
//     }   
//     public void setEnrollmentDate(LocalDateTime enrollmentDate) {
//         this.enrollmentDate = enrollmentDate;
//     }
    
    
// }

package com.sms.student_management.Entity;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Required for the fix
import jakarta.persistence.*;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    // FIX 1: Prevent Infinite Loop (StackOverflow)
    @JsonIgnoreProperties("enrollments") 
    private Student student;

    @ManyToOne
    @JoinColumn(name = "class_section_id")
    // FIX 1: Prevent Infinite Loop (StackOverflow)
    @JsonIgnoreProperties({"enrollments", "students"}) 
    private ClassSection classSection;

    @Column(name = "status")
    private String status;

    @Column(name = "enrollment_at", nullable = false)
    private LocalDateTime enrollmentDate;

    // FIX 2: Auto-generate date before saving (Fixes "Column cannot be null" error)
    @PrePersist
    protected void onCreate() {
        if (this.enrollmentDate == null) {
            this.enrollmentDate = LocalDateTime.now();
        }
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    
    public ClassSection getClassSection() { return classSection; }
    public void setClassSection(ClassSection classSection) { this.classSection = classSection; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDateTime enrollmentDate) { this.enrollmentDate = enrollmentDate; }
}