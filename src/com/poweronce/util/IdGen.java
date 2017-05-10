package com.poweronce.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class IdGen {
    public static void main(String[] args) {
        getId("c:\\id.gen2");
    }

    public synchronized static long getId(String file) {
        return gen(file);
    }

    private static long gen(String file) {
        long lid = 0;
        FileReader fileReader = null;
        BufferedReader mBufReader = null;
        FileWriter fileWriter = null;
        BufferedWriter mBufWriter = null;
        try {
            if (!createFile(file))
                return 168;

            fileReader = new FileReader(file);
            mBufReader = new BufferedReader(fileReader);
            String id = mBufReader.readLine();
            if (id == null || id.length() == 0)
                id = "0";
            lid = new Long(id).longValue();
            mBufReader.close();
            fileReader.close();

            fileWriter = new FileWriter(file);
            mBufWriter = new BufferedWriter(fileWriter);
            fileWriter.write(new Long(lid + 1).toString());

            mBufWriter.flush();
            mBufWriter.close();
        } catch (Throwable e) {
            try {
                fileReader.close();
                mBufReader.close();
                fileWriter.close();
                mBufWriter.close();
            } catch (Throwable t) {
            }
            ;
        }
        return lid;

    }

    public static boolean createFile(String fileName) throws IOException, Exception {
        File file = new File(fileName);
        if (file.exists()) /* does file exist? If so, can it be written to */ {
            if (file.canWrite() == false)
                return false;
        } else {
            String path = null; /* Does not exist. Create the directories */

            int firstSlash = fileName.indexOf(File.separatorChar);
            int finalSlash = fileName.lastIndexOf(File.separatorChar);

            if (finalSlash == 0) { /* error, not valid path */} else if (finalSlash == 1) /*
                                               * UNIX
											   * root
											   * dir
											   */ {
                path = File.separator;
            } else if (firstSlash == finalSlash) { /*
                            * for example c:\ Then make
						    * sure slash is part of path
						    */
                path = fileName.substring(0, finalSlash + 1);
            } else {
                path = fileName.substring(0, finalSlash);
            }

            File dir = new File(path);
            dir.mkdirs();
        }
        return true;
    }
}
