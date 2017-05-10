package com.poweronce.entity;

import java.io.Serializable;
import java.util.List;

public class TPower implements Serializable {
    private int id;
    private String power_name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPower_name() {
        return power_name;
    }

    public void setPower_name(String power_name) {
        this.power_name = power_name;
    }

    public static class TPowerVo extends TPower {
        private List<TPowerOperation> operations;

        public List<TPowerOperation> getOperations() {
            return operations;
        }

        public void setOperations(List<TPowerOperation> operations) {
            this.operations = operations;
        }

    }
}
