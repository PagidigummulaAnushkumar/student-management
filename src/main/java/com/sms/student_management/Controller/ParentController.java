package com.sms.student_management.Controller;

import com.sms.student_management.Entity.Parent;
import com.sms.student_management.Service.ParentService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/parents")
public class ParentController {

    private final ParentService parentService;

    public ParentController(ParentService parentService) {
        this.parentService = parentService;
    }

    // CREATE
    @PostMapping
    public Parent createParent(@RequestBody Map<String, Object> payload) {
        
        if (payload.get("userId") == null) {
            throw new RuntimeException("Error: 'userId' is required.");
        }

        Long userId = Long.valueOf(payload.get("userId").toString());

        return parentService.createParent(userId);
    }

    // READ ALL
    @GetMapping
    public Iterable<Parent> getAllParents() {
        return parentService.getAllParents();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Parent getParentById(@PathVariable Long id) {
        return parentService.getParentById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Parent updateParent(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        
        Long userId = payload.get("userId") != null ? 
                      Long.valueOf(payload.get("userId").toString()) : null;

        return parentService.updateParent(id, userId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteParent(@PathVariable Long id) {
        parentService.deleteParent(id);
    }
}