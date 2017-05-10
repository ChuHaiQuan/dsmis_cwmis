package com.poweronce.entity;

import java.io.Serializable;

public class TProductType implements Serializable {
    /**
     *
     */
    // private static final long serialVersionUID = 1L;
    private long id;
    private String product_type_name;
    private String product_type_name_cn;
    private String code;
    private long parent_id;
    private int level;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getProduct_type_name() {
        return product_type_name;
    }

    public void setProduct_type_name(String product_type_name) {
        this.product_type_name = product_type_name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public long getParent_id() {
        return parent_id;
    }

    public void setParent_id(long parent_id) {
        this.parent_id = parent_id;
    }

    public String getProduct_type_name_cn() {
        return product_type_name_cn;
    }

    public void setProduct_type_name_cn(String product_type_name_cn) {
        this.product_type_name_cn = product_type_name_cn;
    }

    public static class TProductTypeTreeNode extends TProductType {
        private String cls = "folder";

        public String getCls() {
            return cls;
        }

        public void setCls(String cls) {
            this.cls = cls;
        }
    }
}
