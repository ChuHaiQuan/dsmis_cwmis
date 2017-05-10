package com.poweronce.entity;

import java.io.Serializable;

public class TPowerOperation implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private int PopedomCode;
    private int OperationCode;

    public int getOperationCode() {
        return OperationCode;
    }

    public void setOperationCode(int operationCode) {
        OperationCode = operationCode;
    }

    public int getPopedomCode() {
        return PopedomCode;
    }

    public void setPopedomCode(int popedomCode) {
        PopedomCode = popedomCode;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
