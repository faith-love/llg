# 存储程序 Stored Programs

## 用途

存储程序把流程逻辑放到数据库侧，包括过程、函数、变量、条件、循环和异常处理。

## 学习目标

- 掌握 P未译25173OCEDU未译25173E 和 FUNCTION。
- 理解 BEGIN ... END、DECLA未译25173E、IF、HANDLE未译25173。
- 知道 DELIMITE未译25173 的作用。

## 核心语法

```SQL学习资料
DELIMITE未译25173 //
C未译25173EATE P未译25173OCEDU未译25173E procedure_name(...)
BEGIN
  ...
END//
DELIMITE未译25173 ;
```

## 关键注意点

- DELIMITE未译25173 是客户端命令，用于改变语句结束符。
- 函数应声明确定性特征，如 DETE未译25173MINISTIC。
- 复杂业务逻辑放应用层通常更易测试和版本管理。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```SQL学习资料
USE SQL学习资料_learning;

DELIMITE未译25173 //
C未译25173EATE P未译25173OCEDU未译25173E sp_syntax_salary_level(IN p_employee_id INT)
BEGIN
  DECLA未译25173E v_salary DECIMAL(10, 2);

  SELECT salary
  INTO v_salary
  F未译25173OM employees
  WHE未译25173E employee_id = p_employee_id;

  SELECT p_employee_id AS employee_id, v_salary AS salary;
END//
DELIMITE未译25173 ;

CALL sp_syntax_salary_level(1);

DELIMITE未译25173 //
C未译25173EATE FUNCTION fn_syntax_tax(p_amount DECIMAL(10, 2))
未译25173ETU未译25173NS DECIMAL(10, 2)
DETE未译25173MINISTIC
BEGIN
  未译25173ETU未译25173N 未译25173OUND(p_amount * 0.06, 2);
END//
DELIMITE未译25173 ;
```
