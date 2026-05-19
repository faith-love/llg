import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const indexes = [
  {
    file: path.join(root, 'SQL学习资料', '数据库表拆分方法论', '说明.md'),
    heading: '## 文档目录',
    entries: [
      ['01-决策标准.md', '什么情况下必须拆、建议拆、不用拆'],
      ['02-拆分类型.md', '表拆分类型、适用场景、优缺点和业务匹配'],
      ['03-按拆分类型设计.md', '每种拆分方式的字段、主键、外键、关联设计'],
      ['04-最佳实践清单.md', '库表拆分最佳实践和避坑清单'],
      ['05-普通业务案例.md', '案例 1，普通业务系统该不该拆、怎么拆'],
      ['06-订单流水高并发案例.md', '案例 2，订单/流水高并发怎么拆'],
      ['07-宽表垂直拆分案例.md', '案例 3，大宽表字段臃肿如何垂直拆分'],
      ['08-快速决策模板.md', '可直接套用的拆分决策模板'],
    ],
  },
  {
    file: path.join(root, 'SQL学习资料', '数据库语法参考', '说明.md'),
    heading: '## 文件顺序',
    entries: [
      ['01-SELECT查询.md', 'SELECT 查询基础'],
      ['02-函数.md', 'Functions 常用函数'],
      ['03-SELECT-WHERE.md', 'SELECT .. WHERE 条件筛选'],
      ['04-SELECT-GROUP-BY.md', 'SELECT .. GROUP BY 分组聚合'],
      ['05-SELECT-JOIN.md', 'SELECT .. JOIN 多表连接'],
      ['06-SELECT-subquery.md', 'SELECT .. SELECT 子查询'],
      ['07-INSERT-values.md', 'INSERT .. VALUES 插入数据'],
      ['08-INSERT-SELECT.md', 'INSERT .. SELECT 查询结果插入'],
      ['09-更新.md', 'UPDATE 更新数据'],
      ['10-DELETE.md', 'DELETE 删除数据'],
      ['11-create-表.md', 'CREATE TABLE 创建表'],
      ['12-create-view.md', 'CREATE VIEW 创建视图'],
      ['13-create-索引.md', 'CREATE INDEX 创建索引'],
      ['14-drop.md', 'DROP 删除数据库对象'],
      ['15-alter.md', 'ALTER 修改表结构'],
      ['16-union.md', 'UNION 合并结果集'],
      ['17-left-JOIN.md', 'LEFT JOIN 左连接'],
      ['18-null.md', 'NULL 空值处理'],
      ['19-数据-类型.md', '数据类型 Data Types'],
      ['20-operators-expressions.md', '运算符和表达式'],
      ['21-SELECT-clauses-订单-limit.md', 'SELECT 子句补充'],
      ['22-案例-conditional.md', 'CASE、IF 和条件表达式'],
      ['23-with-cte.md', 'WITH / CTE 公用表表达式'],
      ['24-window-函数.md', '窗口函数 Window Functions'],
      ['25-Set-operations.md', '集合运算 Set Operations'],
      ['26-replace-values-表.md', 'REPLACE、VALUES、TABLE'],
      ['27-Load-数据-import-export.md', 'LOAD DATA、LOAD XML、导入导出'],
      ['28-事务-savepoints.md', '事务、COMMIT、ROLLBACK、SAVEPOINT'],
      ['29-锁.md', '锁 Locks'],
      ['30-prepared-statements.md', '预处理语句 Prepared Statements'],
      ['31-stored-programs.md', '存储程序 Stored Programs'],
      ['32-triggers-events.md', '触发器和事件'],
      ['33-variables-Set-show.md', '变量、SET、SHOW'],
      ['34-users-roles-privileges.md', '用户、角色、权限'],
      ['35-describe-EXPLAIN-utility.md', 'USE、DESCRIBE、EXPLAIN 等工具语句'],
      ['36-表-maintenance.md', '表维护语句'],
      ['37-partitioning.md', '分区表 Partitioning'],
      ['38-JSON.md', 'JSON 类型和函数'],
      ['39-generated-columns.md', '生成列 Generated Columns'],
      ['40-charset-collation.md', '字符集和排序规则'],
      ['41-information-schema.md', 'INFORMATION_SCHEMA 元数据查询'],
      ['42-fulltext-spatial.md', '全文索引和空间类型'],
    ],
  },
];

for (const item of indexes) {
  const content = fs.readFileSync(item.file, 'utf8').replace(/\r\n/g, '\n');
  const lines = content.split('\n');
  const headingIndex = lines.findIndex((line) => line.trim() === item.heading);
  if (headingIndex === -1) {
    throw new Error(`未找到标题: ${item.heading} in ${item.file}`);
  }

  let endIndex = headingIndex + 1;
  while (endIndex < lines.length && !/^##\s+/.test(lines[endIndex])) endIndex += 1;

  const replacement = [
    item.heading,
    '',
    ...item.entries.map(([fileName, title], index) => `${index + 1}. [${fileName}](./${fileName})：${title}`),
    '',
  ];

  const next = [...lines.slice(0, headingIndex), ...replacement, ...lines.slice(endIndex)].join('\n');
  fs.writeFileSync(item.file, next, 'utf8');
  console.log(`已重建目录: ${path.relative(root, item.file).replaceAll(path.sep, '/')}`);
}
