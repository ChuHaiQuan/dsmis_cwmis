package com.poweronce.model;

public class CodeNumberGen {

    public static String gen(int maxlen, String fill_char, long gen_value) {
	String s_gen_value = new Long(gen_value).toString();
	int l = s_gen_value.length();
	String ret = s_gen_value;
	if (l < maxlen) {
	    while (maxlen != l) {
		ret = fill_char + ret;
		l++;
	    }
	}
	return ret;
    }

}
