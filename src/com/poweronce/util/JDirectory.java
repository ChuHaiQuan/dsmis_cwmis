package com.poweronce.util;

import java.io.File;

public class JDirectory {

    private File dir;
    private int fileCount;

    private int dirCount;

    private String[] filter;

    public JDirectory(String dir, String... filter) {
        this(new File(dir), filter);
    }

    public JDirectory(File dir, String... filter) {
        if (dir == null || !dir.exists() || dir.isFile()) {
            System.out.println("a null reference or not exist or not a directory!");
            return;
        }
        this.dir = dir;
    }

    public static void DeleteAllFileInDirecory(String directory) {
        try {
            File dir = new File(directory);
            if (!dir.isDirectory()) {
                System.out.println(dir.getName() + " is not a directory!");
            } else {
                File dirList[] = dir.listFiles();
                for (int i = 0; i < dirList.length; i++) {
                    boolean ret = dirList[i].delete();
                    if (ret)
                        System.out.println(dirList[i].getName() + " is deleted!");
                    else
                        System.out.println(dirList[i].getName() + " delete fail!");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
