package com.livio.controller;

import com.livio.entity.Inquiry;
import com.livio.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "*")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<?> submit(@RequestBody Map<String, Object> request) {
        try {
            Long pgId = Long.valueOf(request.get("pgId").toString());
            String name = request.get("name") != null ? request.get("name").toString() : null;
            String email = request.get("email") != null ? request.get("email").toString() : null;
            String phone = request.get("phone") != null ? request.get("phone").toString() : null;
            String message = request.get("message") != null ? request.get("message").toString() : null;

            Inquiry inquiry = inquiryService.submit(pgId, name, email, phone, message);
            return ResponseEntity.ok(inquiry);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/pg/{pgId}")
    public ResponseEntity<List<Inquiry>> getByPgId(@PathVariable Long pgId) {
        return ResponseEntity.ok(inquiryService.getByPgId(pgId));
    }

    @GetMapping
    public ResponseEntity<List<Inquiry>> getAll() {
        return ResponseEntity.ok(inquiryService.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            Inquiry inquiry = inquiryService.updateStatus(id, status);
            return ResponseEntity.ok(inquiry);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
