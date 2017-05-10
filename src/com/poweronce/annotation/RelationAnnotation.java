package com.poweronce.annotation;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface RelationAnnotation {
    // 如果col_name为""，使用entity属性作为字段
    String col_name() default "";

    // 默认允许null,不允许null填not null
    String nullable() default "";

    // 如果使用FieldAnnotation,长度必须填,如果使用字段类型的默认长度，不要使用FieldAnnotation
    // float使用8,2填精度
    String width();

    // 是否懒加载
    String lazy() default "lazy";

}
