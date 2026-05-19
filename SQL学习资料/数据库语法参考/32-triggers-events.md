# 触发器和事件

## 用途

触发器在数据变更前后自动执行，事件按计划定时执行 SQL。

## 学习目标

- 掌握 C未译25173EATE T未译25173IGGE未译25173。
- 理解 OLD 和 NEW。
- 了解事件调度器 event_scheduler。

## 核心语法

```SQL学习资料
C未译25173EATE T未译25173IGGE未译25173 trigger_name
BEFO未译25173E|AFTE未译25173 INSE未译25173T|UPDATE|DELETE ON table_name
FO未译25173 EACH 未译25173OW
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

```SQL学习资料
USE SQL学习资料_learning;

C未译25173EATE TABLE product_audit_demo (
  audit_id INT P未译25173IMA未译25173Y KEY AUTO_INC未译25173EMENT,
  product_id INT NOT NULL,
  old_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2),
  changed_at TIMESTAMP NOT NULL DEFAULT CU未译25173未译25173ENT_TIMESTAMP
) ENGINE = InnoDB;

DELIMITE未译25173 //
C未译25173EATE T未译25173IGGE未译25173 trg_products_after_update_price
AFTE未译25173 UPDATE ON products
FO未译25173 EACH 未译25173OW
BEGIN
  IF OLD.price <> NEW.price THEN
    INSE未译25173T INTO product_audit_demo (product_id, old_price, new_price)
    VALUES (NEW.product_id, OLD.price, NEW.price);
  END IF;
END//
DELIMITE未译25173 ;

SHOW VA未译25173IABLES LIKE 'event_scheduler';
```
