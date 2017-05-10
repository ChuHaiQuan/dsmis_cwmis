package com.poweronce.util;

import java.io.*;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

class FileHandle {
    /**
     * 新建目录
     *
     * @param folderPath String 如 c:/fqf
     * @return boolean
     */
    public void newFolder(String folderPath) {
        try {
            String filePath = folderPath;
            filePath = filePath.toString();
            java.io.File myFilePath = new java.io.File(filePath);
            if (!myFilePath.exists()) {
                myFilePath.mkdir();
            }
        } catch (Exception e) {
            System.out.println("新建目录操作出错");
            e.printStackTrace();
        }
    }

    /**
     * 新建文件
     *
     * @param filePathAndName String 文件路径及名称 如c:/fqf.txt
     * @param fileContent     String 文件内容
     * @return boolean
     */
    public void newFile(String filePathAndName, String fileContent) {
        FileWriter resultFile = null;
        PrintWriter myFile = null;
        try {
            String filePath = filePathAndName;
            filePath = filePath.toString();
            File myFilePath = new File(filePath);
            if (!myFilePath.exists()) {
                myFilePath.createNewFile();
            }
            resultFile = new FileWriter(myFilePath);
            myFile = new PrintWriter(resultFile);
            String strContent = fileContent;
            myFile.println(strContent);

        } catch (Exception e) {
            System.out.println("新建目录操作出错");
            e.printStackTrace();
        } finally {
            try {
                if (myFile != null) {
                    myFile.close();
                }
                if (resultFile != null) {
                    resultFile.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    /**
     * 删除文件
     *
     * @param filePathAndName String 文件路径及名称 如c:/fqf.txt
     * @return boolean
     */
    public void delFile(String filePathAndName) {

        String filePath = filePathAndName;
        filePath = filePath.toString();
        java.io.File myDelFile = new java.io.File(filePath);
        myDelFile.delete();

    }

    /**
     * 删除文件夹
     *
     * @param folderPath String 文件夹路径 如c:/fqf
     * @return boolean
     */
    public void delFolder(String folderPath) {

        delAllFile(folderPath); // 删除完里面所有内容
        String filePath = folderPath;
        filePath = filePath.toString();
        java.io.File myFilePath = new java.io.File(filePath);
        System.out.println("=========" + myFilePath.getName());
        myFilePath.delete(); // 删除空文件夹

    }

    /**
     * 删除文件夹里面的所有文件
     *
     * @param path String 文件夹路径 如 c:/fqf
     */
    public void delAllFile(String path) {
        File file = new File(path);
        if (!file.exists()) {
            return;
        }
        if (!file.isDirectory()) {
            return;
        }
        String[] tempList = file.list();
        File temp = null;
        for (int i = 0; i < tempList.length; i++) {
            if (path.endsWith(File.separator)) {
                temp = new File(path + tempList[i]);
            } else {
                temp = new File(path + File.separator + tempList[i]);
            }
            if (temp.isFile()) {
                System.out.println("=========" + temp.getName());
                temp.delete();
            }
            if (temp.isDirectory()) {
                delAllFile(path + File.separator + tempList[i]);// 先删除文件夹里面的文件
                delFolder(path + File.separator + tempList[i]);// 再删除空文件夹
            }
        }
    }

    /**
     * 复制单个文件
     *
     * @param oldPath String 原文件路径 如：c:/fqf.txt
     * @param newPath String 复制后路径 如：f:/fqf.txt
     * @return boolean
     * @throws IOException
     */
    public void copyFile(String oldPath, String newPath) throws IOException {

        int bytesum = 0;
        int byteread = 0;
        InputStream inStream = null;
        FileOutputStream fs = null;
        try {
            File oldfile = new File(oldPath);
            if (oldfile.exists()) { // 文件存在时
                inStream = new FileInputStream(oldPath); // 读入原文件
                fs = new FileOutputStream(newPath);
                byte[] buffer = new byte[1024 * 4];
                while ((byteread = inStream.read(buffer)) != -1) {
                    bytesum += byteread; // 字节数 文件大小
                    System.out.println("文件大小:" + bytesum);
                    fs.write(buffer, 0, byteread);
                }

            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("拷贝文件" + oldPath + "时出错");
        } finally {
            try {
                if (fs != null) {
                    fs.close();
                }
                if (inStream != null) {
                    inStream.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    /**
     * 复制整个文件夹内容
     *
     * @param oldPath String 原文件路径 如：c:/fqf
     * @param newPath String 复制后路径 如：f:/fqf/ff
     * @return boolean
     * @throws Exception
     */
    public void copyFolder(String oldPath, String newPath) throws Exception {
        FileInputStream input = null;
        FileOutputStream output = null;
        try {
            (new File(newPath)).mkdirs(); // 如果文件夹不存在 则建立新文件夹
            File a = new File(oldPath);
            String[] file = a.list();
            File temp = null;
            for (int i = 0; i < file.length; i++) {
                if (oldPath.endsWith(File.separator)) {
                    temp = new File(oldPath + file[i]);
                } else {
                    temp = new File(oldPath + File.separator + file[i]);
                }

                if (temp.isFile()) {
                    input = new FileInputStream(temp);
                    output = new FileOutputStream(newPath + File.separator + (temp.getName()).toString());
                    byte[] b = new byte[1024 * 5];
                    int len;
                    while ((len = input.read(b)) != -1) {
                        output.write(b, 0, len);
                    }
                    output.flush();
                }
                if (temp.isDirectory()) {
                    if (!temp.getAbsolutePath().contentEquals(new StringBuffer(newPath.replace('/', '\\'))))
                        copyFolder(oldPath + "/" + file[i], newPath + "/" + file[i]);
                }
            }
        } catch (Exception e) {
            System.out.println("复制整个文件夹内容操作出错");
            e.printStackTrace();
            throw new Exception("把" + oldPath + "拷贝到" + newPath + "时出错");

        } finally {
            try {
                if (output != null) {
                    output.close();
                }
                if (input != null) {
                    input.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    /**
     * 移动文件到指定目录
     *
     * @param oldPath String 如：c:/fqf.txt
     * @param newPath String 如：d:/fqf.txt
     * @throws IOException
     */
    public void moveFile(String oldPath, String newPath) throws IOException {
        copyFile(oldPath, newPath);
        delFile(oldPath);

    }

    /**
     * 移动文件到指定目录
     *
     * @param oldPath String 如：c:/fqf
     * @param newPath String 如：d:/fqf
     * @throws Exception
     */
    public void moveFolder(String oldPath, String newPath) throws Exception {
        copyFolder(oldPath, newPath);
        delFolder(oldPath);

    }

    /**
     * 修改属性文件
     *
     * @param propFile   要修改的属性文件
     * @param modifyProp 要修改的属性
     * @throws IOException
     */
    public void modifyProp(String propFile, Map modifyProp) throws IOException {
        Properties proper = new Properties();

        FileInputStream finPut = new FileInputStream(propFile);
        proper.load(finPut);
        Iterator keys = (Iterator) modifyProp.keySet().iterator();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            String value = (String) modifyProp.get(key);
            System.out.println("key==" + key);
            System.out.println("value==" + value);
            proper.put(key, value);

        }

        FileOutputStream foutPut = new FileOutputStream(propFile);
        proper.store(foutPut, "");

    }

    public void modifyFile(String propFile, Map modifyProp) throws IOException {
        FileReader fr = null;
        BufferedReader br = null;
        try {
            fr = new FileReader(propFile);
            br = new BufferedReader(fr);
            StringBuffer allProp = new StringBuffer();
            String temp;
            String key;
            String value;
            int end;
            // 执行修改和删除
            while (true) {
                temp = br.readLine();
                if (temp == null)
                    break;
                end = temp.indexOf("=");
                if (end != -1) {
                    key = temp.substring(0, end);
                    value = (String) modifyProp.get(key);
                    if (value != null && !"#delete;".equals(value)) {
                        temp = key + "=" + value;
                        modifyProp.remove(key);
                    } else if ("#delete;".equals(value)) {
                        temp = "";
                        modifyProp.remove(key);
                    }
                }
                allProp.append(temp);
                allProp.append("\r\n");
                // System.out.println(temp);
            }
            // 执行增加
            Iterator ite = modifyProp.keySet().iterator();
            while (ite.hasNext()) {
                key = (String) ite.next();
                value = (String) modifyProp.get(key);
                if (!"#delete;".equals(value)) {
                    allProp.append(key + "=" + value);
                    allProp.append("\r\n");
                }
                // System.out.println(key + "==" + value);
            }
            // System.out.println(allProp.toString());
            PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter(propFile)));
            pw.write(allProp.toString());
            pw.close();
        } catch (IOException e) {
            throw new IOException("修改文件" + propFile + "出错");
        } finally {
            if (br != null) {
                br.close();
            }
            if (fr != null) {
                fr.close();
            }
        }
    }

}
