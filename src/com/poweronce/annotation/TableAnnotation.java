package com.poweronce.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface TableAnnotation {
    String id() default "id";

    String auto_increment() default "yes";

    String seq() default "SEQ_DEFAULT";

    String tablespace() default "SPACE_DEFAULT";
}
