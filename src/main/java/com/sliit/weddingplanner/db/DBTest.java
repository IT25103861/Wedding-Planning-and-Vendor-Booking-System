package com.sliit.weddingplanner.db;

import java.sql.Connection;

public class DBTest {
    public static void main(String[] args) {
        try {
            Connection con = DBConnection.getInstance().getConnection();

            if (con != null) {
                System.out.println("✅ Database Connected Successfully!");
            } else {
                System.out.println("❌ Connection Failed!");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}