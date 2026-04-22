package com.sliit.weddingplanner.repository;

import com.sliit.weddingplanner.db.DBConnection;
import org.springframework.stereotype.Repository;

import java.sql.Connection;

@Repository
public class PaymentRepository {

    private final Connection connection;


    public PaymentRepository() {
        this.connection = DBConnection.getInstance().getConnection();
    }


}
