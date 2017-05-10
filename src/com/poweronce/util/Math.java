package com.poweronce.util;

public class Math {

    public static float add(float a1, float a2) {
        return a1 + a1;
    }

    public static long add(long a1, long a2) {
        return a1 + a1;
    }

    public static float multi(float f1, long l1) {
        return new Float(ObjectFormat.formatCurrency(f1 * l1, "###.00")).floatValue();
    }
}
