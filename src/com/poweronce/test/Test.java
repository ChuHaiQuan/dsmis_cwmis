/**
 * 
 */
package com.poweronce.test;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * @author chuhaiquan
 *
 */
public class Test {

	/**
	 * @param args
	 * @throws ParseException 
	 */
	public static void main(String[] args) throws ParseException {
		// TODO Auto-generated method stub
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		
		System.out.println(format.format(format.parse("2017-01-01 18:00:00")));
	}

}
