package com.poweronce.util;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2002
 * </p>
 * <p>
 * Company:
 * </p>
 *
 * @author unascribed
 * @version 1.0
 */

public class Tools {
    /**
     * 字符串替换函数
     *
     * @param sAll  String 原来的字符串
     * @param older String 要替换掉的字符串
     * @param newer String 新的字符串
     * @return String 替换后的结果
     */
    public synchronized static String strReplace(String sAll, String sOld, String sNew) {
        int iT = 0;
        String sF = null, sH = null;
        // 如果新串中包括旧串,不让替多只让替少
        if (sNew.indexOf(sOld) != -1)
            return sAll;
        if (sAll == null || sOld == null || sNew == null)
            return sAll;
        iT = sAll.indexOf(sOld);
        int i = 0;
        while (iT != -1) {
            sF = sAll.substring(0, iT);
            sH = sAll.substring(iT + sOld.length());
            sAll = sF + sNew + sH;
            iT = sAll.indexOf(sOld);
        }
        return sAll;
    }

    /**
     * 过滤接收字符{MO}
     *
     * @param sMo String 转换前字符
     * @return boolean 转换后字符
     * @说明
     */
    public synchronized static String convertMoString(String sMo) {
        String sReturn = sMo;
        if (sReturn == null)
            return sReturn;
        try {
            sReturn = sReturn.toUpperCase();
            sReturn = sReturn.replace('，', ',');
            sReturn = sReturn.replace('。', '.');
            sReturn = sReturn.replace('；', ';');
            sReturn = sReturn.replace('！', '!');
            sReturn = sReturn.replace('？', '?');
            sReturn = sReturn.replace('：', ':');
            sReturn = sReturn.replace('"', '＂');
            sReturn = sReturn.replace('“', '＂');
            sReturn = sReturn.replace('”', '＂');
            sReturn = sReturn.replace('-', ' ');
            sReturn = sReturn.replace('_', ' ');
            sReturn = sReturn.replace('，', ',');
            sReturn = sReturn.replace('０', '0');
            sReturn = sReturn.replace('１', '1');
            sReturn = sReturn.replace('２', '2');
            sReturn = sReturn.replace('３', '3');
            sReturn = sReturn.replace('４', '4');
            sReturn = sReturn.replace('５', '5');
            sReturn = sReturn.replace('６', '6');
            sReturn = sReturn.replace('７', '7');
            sReturn = sReturn.replace('８', '8');
            sReturn = sReturn.replace('９', '9');
            sReturn = strReplace(sReturn, "‘", "'");
        } catch (Exception ex) {
            return sMo;
        }
        return sReturn;
    }

    /**
     * 过滤接收字符{MT}
     *
     * @param sMo String 转换前字符
     * @return boolean 转换后字符
     * @说明
     */
    public synchronized static String convertMtString(String sMt) {
        String sReturn = sMt;
        if (sReturn == null)
            return sReturn;
        try {
            sReturn = strReplace(sReturn, "‘", "'");
            sReturn = sReturn.replace('，', ',');
            sReturn = sReturn.replace('。', '.');
            sReturn = sReturn.replace('；', ';');
            sReturn = sReturn.replace('！', '!');
            sReturn = sReturn.replace('？', '?');
            sReturn = sReturn.replace('：', ':');
            sReturn = sReturn.replace('"', '＂');
            sReturn = sReturn.replace('“', '＂');
            sReturn = sReturn.replace('”', '＂');
        } catch (Exception ex) {
            return sMt;
        }
        return sReturn;
    }

    public synchronized static boolean isNumeric(String msg) {
        try {
            Integer.parseInt(msg);
        } catch (Exception ex) {
            return false;
        }
        return true;
    }

    private static String HexCode[] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"};

    public synchronized static String byteToHexString(byte b) {
        int n = b;
        if (n < 0)
            n = 256 + n;
        int d1 = n / 16;
        int d2 = n % 16;
        return HexCode[d1] + HexCode[d2];
    }

    // 从字节流中获得/0结束的字符串
    public synchronized static String intToHexString(int i) {
        byte bt[] = int2byte(i);
        return byteArrayToHexString(bt);
    }

    // 从字节流中获得/0结束的字符串
    public synchronized static String byteToString(byte b[]) {
        if (b == null || b.length == 0 || b[0] == 0)
            return "";
        int i = 0;
        for (i = 0; i < b.length; i++) {
            if (b[i] == 0)
                break;
        }
        byte rb[] = new byte[i];

        System.arraycopy(b, 0, rb, 0, i);
        return new String(rb);
    }

    public synchronized static String byteArrayToHexString(byte b[]) {
        String result = "";
        for (int i = 0; i < b.length; i++)
            result = result + byteToHexString(b[i]);
        return result;
    }

    public synchronized static int byte2int(byte b[], int offset) {
        return b[offset + 3] & 0xff | (b[offset + 2] & 0xff) << 8 | (b[offset + 1] & 0xff) << 16 | (b[offset] & 0xff) << 24;
    }

    public static int byte2int(byte b[]) {
        return b[3] & 0xff | (b[2] & 0xff) << 8 | (b[1] & 0xff) << 16 | (b[0] & 0xff) << 24;
    }

    public synchronized static long byte2long(byte b[]) {
        return (long) b[7] & (long) 255 | ((long) b[6] & (long) 255) << 8 | ((long) b[5] & (long) 255) << 16 | ((long) b[4] & (long) 255) << 24
                | ((long) b[3] & (long) 255) << 32 | ((long) b[2] & (long) 255) << 40 | ((long) b[1] & (long) 255) << 48 | (long) b[0] << 56;
    }

    public synchronized static long byte2long(byte b[], int offset) {
        return (long) b[offset + 7] & (long) 255 | ((long) b[offset + 6] & (long) 255) << 8 | ((long) b[offset + 5] & (long) 255) << 16
                | ((long) b[offset + 4] & (long) 255) << 24 | ((long) b[offset + 3] & (long) 255) << 32 | ((long) b[offset + 2] & (long) 255) << 40
                | ((long) b[offset + 1] & (long) 255) << 48 | (long) b[offset] << 56;
    }

    public synchronized static byte[] int2byte(int n) {
        byte b[] = new byte[4];
        b[0] = (byte) (n >> 24);
        b[1] = (byte) (n >> 16);
        b[2] = (byte) (n >> 8);
        b[3] = (byte) n;
        return b;
    }

    /* 16进制输出byte[] */// 例如 byte[0] = 1 byte[1] = 2 ----> 0x3132
    static synchronized public String rhex(byte[] in) {
        DataInputStream data = new DataInputStream(new ByteArrayInputStream(in));
        String str = "0x";
        try {
            for (int j = 0; j < in.length; j++) {
                String tmp = Integer.toHexString(data.readUnsignedByte());
                if (tmp.length() == 1) {
                    tmp = "0" + tmp;
                }
                str = str + tmp;
            }
        } catch (Exception ex) {
        }
        return str;
    }

    /**
     * n 为待转数据，buf[]为转换后的数据，offset为buf[]中转换的起始点 转换后数据从低到高位
     */
    public synchronized static void int2byte(int n, byte buf[], int offset) {
        buf[offset] = (byte) (n >> 24);
        buf[offset + 1] = (byte) (n >> 16);
        buf[offset + 2] = (byte) (n >> 8);
        buf[offset + 3] = (byte) n;
    }

    public synchronized static byte[] short2byte(int n) {
        byte b[] = new byte[2];
        b[0] = (byte) (n >> 8);
        b[1] = (byte) n;
        return b;
    }

    public synchronized static void short2byte(int n, byte buf[], int offset) {
        buf[offset] = (byte) (n >> 8);
        buf[offset + 1] = (byte) n;
    }

    public synchronized static byte[] long2byte(long n) {
        byte b[] = new byte[8];
        b[0] = (byte) (int) (n >> 56);
        b[1] = (byte) (int) (n >> 48);
        b[2] = (byte) (int) (n >> 40);
        b[3] = (byte) (int) (n >> 32);
        b[4] = (byte) (int) (n >> 24);
        b[5] = (byte) (int) (n >> 16);
        b[6] = (byte) (int) (n >> 8);
        b[7] = (byte) (int) n;
        return b;
    }

    public synchronized static void long2byte(long n, byte buf[], int offset) {
        buf[offset] = (byte) (int) (n >> 56);
        buf[offset + 1] = (byte) (int) (n >> 48);
        buf[offset + 2] = (byte) (int) (n >> 40);
        buf[offset + 3] = (byte) (int) (n >> 32);
        buf[offset + 4] = (byte) (int) (n >> 24);
        buf[offset + 5] = (byte) (int) (n >> 16);
        buf[offset + 6] = (byte) (int) (n >> 8);
        buf[offset + 7] = (byte) (int) n;
    }

    public synchronized static long hexString2Long(String hexString) {
        long l = 0;
        if (hexString == null || hexString.length() == 0)
            return l;
        String lowHexString = hexString.toUpperCase();
        int len = lowHexString.length();
        for (int i = 0; i < len; i++) {
            int chr = lowHexString.charAt(len - i - 1);
            if (chr >= 0x30 && chr <= 0x39)
                l += (chr - 0x30) * java.lang.Math.pow(16, i);
            else if (chr >= 0x41 && chr <= 0x46)
                l += (chr - 0x41 + 10) * java.lang.Math.pow(16, i);
            else
                return 0;
        }
        return l;
    }

    static public void main(String args[]) throws Exception {
        Tools.hexString2Long("F8002200");
        String dd = Tools.addZero(String.valueOf(11), 4, Tools.ALIGN_RIGHT);
        String ddd = "";

    }

    /*
     * 前面加0到长度为len
     */
    public static final int ALIGN_LEFT = 1;
    public static final int ALIGN_RIGHT = 2;

    public synchronized static String addZero(String info, int len, int align) {
        if (info == null)
            return null;
        String str = new String(info);
        int nLen = str.length();
        while (nLen < len) {
            if (align == ALIGN_LEFT)
                str = str + "0";
            else if (align == ALIGN_RIGHT)
                str = "0" + str;
            nLen++;
        }
        return str;
    }

    /*
     * 补空格
     */
    public synchronized static String addSpace(String info, int len, int align) {
        if (info == null)
            return null;
        String str = new String(info);
        int nLen = str.length();
        while (nLen < len) {
            if (align == ALIGN_LEFT)
                str = str + " ";
            else if (align == ALIGN_RIGHT)
                str = " " + str;
            nLen++;
        }
        return str;
    }

}
