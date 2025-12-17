package com.sms.student_management.Controller;


import com.sms.student_management.Entity.*;
//import com.sms.student_management.Entity.User.Role;
import com.sms.student_management.Service.*;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // @PostMapping
    // public User createUser(
    //         @RequestParam String email,
    //         @RequestParam String password,
    //         @RequestParam Role role) {

    //     return userService.createUser(email, password, role);
    // }

    // create user

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(
                user.getEmail(),
                user.getPasswordHash(),
                user.getRole()
        );
    }

    // update user
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return userService.updateUser(id, user);
    }
// get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


//  @PostMapping
//     public User createUser(@RequestBody User user) {
//         return userService.save(user);
//     }


}
