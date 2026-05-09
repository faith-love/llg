# 存储程序 Stored Programs

## 用途

存储程序把流程逻辑放到数据库侧，包括过程、函数、变量、条件、循环和异常处理。

## 学习目标

- 掌握 PROCEDURE 和 FUNCTION。
- 理解 BEGIN ... END、DECLARE、IF、HANDLER。
- 知道 DELIMITER 的作用。

## 核心语法

```sql
DELIMITER //
CREATE PROCEDURE procedure_name(...)
BEGIN
  ...
END//
DELIMITER ;
```

## 关键注意点

- DELIMITER 是客户端命令，用于改变语句结束符。
- 函数应声明确定性特征，如 DETERMINISTIC。
- 复杂业务逻辑放应用层通常更易测试和版本管理。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

DELIMITER //
CREATE PROCEDURE sp_syntax_salary_level(IN p_employee_id INT)
BEGIN
  DECLARE v_salary DECIMAL(10, 2);

  SELECT salary
  INTO v_salary
  FROM employees
  WHERE employee_id = p_employee_id;

  SELECT p_employee_id AS employee_id, v_salary AS salary;
END//
DELIMITER ;

CALL sp_syntax_salary_level(1);

DELIMITER //
CREATE FUNCTION fn_syntax_tax(p_amount DECIMAL(10, 2))
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
  RETURN ROUND(p_amount * 0.06, 2);
END//
DELIMITER ;
```
