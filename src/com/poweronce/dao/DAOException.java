/**
 *
 */
package com.poweronce.dao;

/**
 * @author Administrator
 */
public final class DAOException extends Exception {
    public String getType() {
        return "DAOException";
    }

    public DAOException() {
        super();
    }

    public DAOException(String message, Throwable cause) {
        super(message, cause);
    }

    public DAOException(String message) {
        super(message);
    }

    public DAOException(Throwable cause) {
        super(cause);
    }
}
