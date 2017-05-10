package com.poweronce.init;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.poweronce.annotation.FieldAnnotation;
import com.poweronce.annotation.TableAnnotation;
import com.poweronce.dao.mysql.DBConnectionManager;
import com.poweronce.entity.TEmployee;
import com.poweronce.util.Path;

public class entity2ddl_mysql {

    /**
     * 批注是用于Java语言的本机元数据标记。它们的输入严格与Java语言的其他部分类似，可以通过反映被发现，更容易地让IDE和编译器的编写者管理。
     *
     * @throws IOException
     * @throws IOException
     * @throws ClassNotFoundException
     * @throws NoSuchMethodException
     * @throws SecurityException
     * @throws InstantiationException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws SQLException
     */
    /*
     * 1.找到类的相关annotation和所有的属性 2.找到字段的类型，并检查字段是否有annotation
     * 3.没有annotation使用默认长度和字段名(使用属性名)。有annotation找到对应annotation的所有属性值组成一个字段
     * 4.找到主键并建立
     */
    public static void main(String[] args) throws IOException {
        List<String> list = Path.getClasses(Path.getFullPathRelateClass("", TEmployee.class));
        Connection connect = null;
        try {
            for (String entity : list) {
                String classname = "com.poweronce.entity." + entity;
                Class clazz = Class.forName(classname);
                String create_table_sql = "";
                // Class clazz = object.getClass();
                String class_name = clazz.getName();
                String table_name = class_name.substring((class_name.lastIndexOf('.') == -1 ? 0 : class_name.lastIndexOf('.') + 1), class_name.length());
                String id = "id";
                // 获得表的属性
                if (clazz.isAnnotationPresent(TableAnnotation.class)) {
                    TableAnnotation formLabel = (TableAnnotation) clazz.getAnnotation(TableAnnotation.class);
                    id = formLabel.id();
                }
                try {
                    // 获得字段属性
                    for (Field fieldClass : clazz.getDeclaredFields()) {
                        String fieldType = fieldClass.getType().getName();
                        // 有annotation则使用annotation的声明，没有annotation
                        // 使用默认字段类型的默认类型和长度
                        if (fieldClass.isAnnotationPresent(FieldAnnotation.class)) {
                            FieldAnnotation fieldLabel = fieldClass.getAnnotation(FieldAnnotation.class);
                            try {
                                String label = StringUtils.isEmpty(fieldLabel.col_name()) ? fieldClass.getName() : fieldLabel.col_name();
                                String nullable = fieldLabel.nullable();
                                String width = fieldLabel.width();
                                // int类型 long类型
                                if (fieldType.equals("int") || fieldType.equals("java.lang.Integer") || fieldType.equals("long")
                                        || fieldType.equals("java.lang.Long") || fieldType.equals("short") || fieldType.equals("java.lang.Short")) {
                                    create_table_sql += label + " bigint(" + width + ")" + " " + nullable;
                                }
                                // 浮点类型
                                else if (fieldType.equals("float") || fieldType.equals("java.lang.Float") || fieldType.equals("double")
                                        || fieldType.equals("java.lang.Double")) {
                                    create_table_sql += label + " decimal(" + width + ")" + " " + nullable;
                                }
                                // string类型
                                else if (fieldType.equals("java.lang.String")) {
                                    create_table_sql += label + " varchar(" + width + ")" + " " + nullable;
                                } else if (fieldType.equals("java.util.Date")) {
                                    create_table_sql += label + " datetime" + " " + nullable;
                                } else {
                                    create_table_sql += label + " varchar(" + width + ")" + " " + nullable;
                                }
                            } catch (IllegalArgumentException ex) {
                                ex.printStackTrace();
                            }
                        } else {
                            String label = fieldClass.getName();
                            // int类型 long类型
                            if (fieldType.equals("int") || fieldType.equals("java.lang.Integer")) {
                                create_table_sql += label + " int(4)";
                            } else if (fieldType.equals("long") || fieldType.equals("java.lang.Long")) {
                                create_table_sql += label + " bigint(20)";
                            } else if (fieldType.equals("short") || fieldType.equals("java.lang.Short")) {
                                create_table_sql += label + " int(1)";
                            }
                            // 浮点类型
                            else if (fieldType.equals("float") || fieldType.equals("java.lang.Float") || fieldType.equals("double")
                                    || fieldType.equals("java.lang.Double")) {
                                create_table_sql += label + " decimal(16,2)";
                            }
                            // string类型
                            else if (fieldType.equals("java.lang.String")) {
                                create_table_sql += label + " varchar(255)";
                            } else if (fieldType.equals("java.util.Date")) {
                                create_table_sql += label + " datetime";
                            } else {
                                create_table_sql += label + " varchar(255)";
                            }
                        }

                        if (fieldClass.getName().equalsIgnoreCase(id) && (!"java.lang.String".equalsIgnoreCase(fieldClass.getType().getName()))) {
                            create_table_sql += " auto_increment ";
                        }
                        create_table_sql += ",";

                    }

                    if (StringUtils.isNotEmpty(id))
                        create_table_sql += "PRIMARY KEY  (`" + id + "`),";

                    create_table_sql = create_table_sql.substring(0, create_table_sql.length() - 1);
                    create_table_sql = "create table " + table_name + "(" + create_table_sql + ")";
                    System.out.println(create_table_sql);
                    connect = DBConnectionManager.getInstance().getOracleConnection();
                    connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
                    PreparedStatement ps = connect.prepareStatement(create_table_sql);
                    ps.executeUpdate();
                } catch (IllegalArgumentException ex) {
                    ex.printStackTrace();
                }
            }
            connect.commit();
            DBConnectionManager.getInstance().freeOracleConnection(connect);
        } catch (Exception e) {
            // 异常回滚
            e.printStackTrace();
            try {
                connect.rollback();
            } catch (Exception e1) {
                // TODO Auto-generated catch block
                e1.printStackTrace();
            }
        } finally {
            try {
                if (connect != null)
                    DBConnectionManager.getInstance().freeOracleConnection(connect);
            } catch (Exception e1) {
                e1.printStackTrace();
            }
        }
    }
}
