package com.poweronce.common;

import java.io.Serializable;

public class ErrorInfo implements Serializable {
    private int errorCode;
    private String errorInfo;

    public ErrorInfo() {}

    public ErrorInfo(int errorCode, String errorInfo) {
	this.errorCode = errorCode;
	this.errorInfo = errorInfo;
    }

    public String getErrorInfo() {
	return errorInfo;
    }

    public void setErrorInfo(String errorInfo) {
	this.errorInfo = errorInfo;
    }

    public int getErrorCode() {
	return errorCode;
    }

    public void setErrorCode(int errorCode) {
	this.errorCode = errorCode;
    }

    public void setErrorInfo(int errorCode, String errorInfo) {
	this.errorCode = errorCode;
	this.errorInfo = errorInfo;
    }

    public ErrorInfo setGetErrorInfo(int errorCode, String errorInfo) {
	this.errorCode = errorCode;
	this.errorInfo = errorInfo;
	return this;
    }

}
