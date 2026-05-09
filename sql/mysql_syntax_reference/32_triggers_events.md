# 触发器和事件

## 用途

触发器在数据变更前后自动执行，事件按计划定时执行 SQL。

## 学习目标

- 掌握 CREATE TRIGGER。
- 理解 OLD 和 NEW。
- 了解事件调度器 event_scheduler。

## 核心语法

```sql
CREATE TRIGGER trigger_name
BEFORE|AFTER INSERT|UPDATE|DELETE ON table_name
FOR EACH ROW
BEGIN
  ...
END;
```

## 关键注意点

- 触发器隐式执行，过多会让数据变化难以追踪。
- 事件需要 event_scheduler 开启。
- 触发器和事件都应有清晰审计和维护策略。

## 完整示例

下面的 SQL 片段用于理解语法结构。涉及修改数据或对象的语句，建议先在测试库中执行。

```sql
USE sql_learning;

CREATE TABLE product_audit_demo (
  audit_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  old_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2),
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

DELIMITER //
CREATE TRIGGER trg_products_after_update_price
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  IF OLD.price <> NEW.price THEN
    INSERT INTO product_audit_demo (product_id, old_price, new_price)
    VALUES (NEW.product_id, OLD.price, NEW.price);
  END IF;
END//
DELIMITER ;

SHOW VARIABLES LIKE 'event_scheduler';
```
