package com.sliit.weddingplanner.controller;

import com.sliit.weddingplanner.dto.payment.PaymentDTO;
import com.sliit.weddingplanner.service.PaymentService;
import com.sliit.weddingplanner.service.impl.PaymentServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service = new PaymentServiceImpl();

    @PostMapping
    public String save(@RequestBody PaymentDTO dto) {
        return service.savePayment(dto)
                ? "Saved successfully"
                : "Failed to save";
    }

    @GetMapping
    public List<PaymentDTO> getAll() {
        return service.getAllPayments();
    }

    @GetMapping("/{paymentId}")
    public PaymentDTO getById(@PathVariable int paymentId) {
        return service.searchPayment(paymentId);
    }

    @PutMapping
    public String update(@RequestBody PaymentDTO dto) {
        return service.updatePayment(dto)
                ? "Updated successfully"
                : "Failed to update";
    }

    @DeleteMapping("/{paymentId}")
    public String delete(@PathVariable int paymentId) {
        return service.deletePayment(paymentId)
                ? "Deleted successfully"
                : "Failed to delete";
    }
}
