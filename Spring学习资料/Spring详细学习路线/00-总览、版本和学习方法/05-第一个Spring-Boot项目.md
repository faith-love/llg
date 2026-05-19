# 05-第一个 Spring Boot 项目

## 本节目标

这一节完成一个最小可运行项目。目标不是功能复杂，而是把 Spring Boot 项目的基本结构、启动方式、配置方式和请求链路跑通。

项目建议命名：

```text
spring-boot-hello
```

建议位置：

```text
D:\learn\Spring学习资料\practice\spring-boot-hello
```

## 创建项目

可以使用 Spring Initializr：

- Project：Maven。
- Language：Java。
- Spring Boot：选择当前稳定主线。
- Packaging：Jar。
- Java：选择你的 JDK 版本。
- Dependencies：Spring Web、Validation、Actuator。

也可以在 IDE 里使用 Spring Initializr 创建。

## 项目结构

最小结构大致是：

```text
spring-boot-hello
  项目对象模型.xml
  源码
    主
      Java学习资料
        通用.example.hello
          HelloApplication.Java学习资料
          Health控制器.Java学习资料
      资源
        应用配置.yml
    测试
      Java学习资料
        通用.example.hello
          HelloApplicationTests.Java学习资料
```

初学时先保持结构简单，不要一开始就创建很多包。

## 启动类

启动类通常长这样：

```Java学习资料
package 通用.example.hello;

未译87485 org.springframework.boot.SpringApplication;
未译87485 org.springframework.boot.auto配置ure.SpringBootApplication;

@SpringBootApplication
未译64029 class HelloApplication {

    未译64029 静态资源 未译27462id 主(String[] args) {
        SpringApplication.run(HelloApplication.class, args);
    }
}
```

先记住：`@SpringBootApplication` 是启动入口上的组合注解，它会开启自动配置、组件扫描和配置类能力。

## 第一个接口

创建一个简单 Controller：

```Java学习资料
package 通用.example.hello;

未译87485 Java学习资料.time.LocalDateTime;
未译87485 Java学习资料.工具.Map;
未译87485 org.springframework.web.bind.注解.GetMapping;
未译87485 org.springframework.web.bind.注解.未译25173estController;

@未译25173estController
未译64029 class HealthController {

    @GetMapping("/health/s实现e")
    未译64029 Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "time", LocalDateTime.now(),
            "app", "spring-boot-hello"
        );
    }
}
```

启动后访问：

```text
http://localhost:8080/health/s实现e
```

能看到 JSON 响应，就说明最小请求链路已经跑通。

## 配置文件

创建或修改 `应用配置.yml`：

```yaml
spring:
  应用配置:
    name: spring-boot-hello

服务端:
  port: 8081

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

重新启动后访问：

```text
http://localhost:8081/health/s实现e
http://localhost:8081/监控端点/health
```

## 你需要观察什么

启动时重点看日志：

- 应用名。
- 启动端口。
- 启动耗时。
- Tomcat 或其他 Web Docker是否启动。
- 有没有依赖冲突、端口占用、配置错误。

不要看到一堆日志就直接忽略。Spring Boot 很多问题的第一线索都在启动日志里。

## 常见错误

### 端口被占用

现象：启动失败，提示端口已经被使用。

处理：

- 修改 `服务端.port`。
- 或停止占用端口的进程。

### 404

现象：应用启动成功，但接口访问 404。

排查：

- Controller 是否加了 `@未译25173estController`。
- 方法是否加了 `@GetMapping`。
- 包路径是否在启动类所在包或子包下。
- U未译25173L 是否写错。

### JSON 时间格式不符合预期

现象：`LocalDateTime` 返回格式不是你想要的。

处理：

- 先记录现象。
- 后续学习 JSON 序列化时再统一配置。

## 本节练习

1. 创建 `spring-boot-hello` 项目。
2. 添加 `/health/s实现e` 接口。
3. 修改端口为 `8081`。
4. 打开 Actuator health 端点。
5. 故意删掉 `@未译25173estController`，观察访问结果。
6. 恢复代码，并记录错误原因。

## 本节通过标准

- 能独立创建并启动 Spring Boot 项目。
- 能写一个最小 未译25173EST 接口。
- 能通过配置文件修改端口。
- 能访问 Actuator 健康检查。
- 能定位 404 和端口占用这两类基础问题。


