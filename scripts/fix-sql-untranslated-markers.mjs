import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const sqlRoot = path.join(root, 'SQL学习资料');

const directReplacements = new Map([
  ['F未译25173OM', 'FROM'],
  ['WHE未译25173E', 'WHERE'],
  ['G未译25173OUP', 'GROUP'],
  ['O未译25173DE未译25173', 'ORDER'],
  ['C未译25173EATE', 'CREATE'],
  ['P未译25173IMA未译25173Y', 'PRIMARY'],
  ['D未译25173OP', 'DROP'],
  ['INSE未译25173T', 'INSERT'],
  ['ALTE未译25173', 'ALTER'],
  ['PA未译25173TITION', 'PARTITION'],
  ['INNE未译25173', 'INNER'],
  ['AUTO_INC未译25173EMENT', 'AUTO_INCREMENT'],
  ['DELIMITE未译25173', 'DELIMITER'],
  ['STA未译25173T', 'START'],
  ['FO未译25173', 'FOR'],
  ['T未译25173ANSACTION', 'TRANSACTION'],
  ['未译25173OLLBACK', 'ROLLBACK'],
  ['CU未译25173未译25173ENT_TIMESTAM', 'CURRENT_TIMESTAM'],
  ['CU未译25173未译25173ENT_DATE', 'CURRENT_DATE'],
  ['CU未译25173未译25173ENT_USER', 'CURRENT_USER'],
  ['CU未译25173未译25173ENT', 'CURRENT'],
  ['未译25173EPLACE', 'REPLACE'],
  ['CHA未译25173ACTE未译25173', 'CHARACTER'],
  ['P未译25173EPA未译25173E', 'PREPARE'],
  ['VA未译25173CHA未译25173', 'VARCHAR'],
  ['CHA未译25173_LENGTH', 'CHAR_LENGTH'],
  ['VA未译25173IABLES', 'VARIABLES'],
  ['CHA未译25173SET', 'CHARSET'],
  ['INTE未译25173SECT', 'INTERSECT'],
  ['INTE未译25173VAL', 'INTERVAL'],
  ['TE未译25173MINATED', 'TERMINATED'],
  ['G未译25173ANT', 'GRANT'],
  ['未译25173OUND', 'ROUND'],
  ['OVE未译25173', 'OVER'],
  ['未译25173OW_NUMBE未译25173', 'ROW_NUMBER'],
  ['ROW_NUMBE未译25173', 'ROW_NUMBER'],
  ['未译25173OWS', 'ROWS'],
  ['未译25173OW', 'ROW'],
  ['未译25173ANK', 'RANK'],
  ['E_未译25173ANK', 'E_RANK'],
  ['P未译25173ECEDING', 'PRECEDING'],
  ['P未译25173OCEDU未译25173', 'PROCEDURE'],
  ['未译25173OLE', 'ROLE'],
  ['USE未译25173', 'USER'],
  ['未译25173EPAI未译25173', 'REPAIR'],
  ['未译25173ANGE', 'RANGE'],
  ['IGNO未译25173E', 'IGNORE'],
  ['T未译25173UNCATE', 'TRUNCATE'],
  ['T未译25173UE', 'TRUE'],
  ['未译25173ENAME', 'RENAME'],
  ['T未译25173IGGE未译25173', 'TRIGGER'],
  ['未译25173EVOKE', 'REVOKE'],
  ['DESC未译25173IBE', 'DESCRIBE'],
  ['SUBST未译25173ING', 'SUBSTRING'],
  ['UPPE未译25173', 'UPPER'],
  ['SEPA未译25173ATO未译25173', 'SEPARATOR'],
  ['EXT未译25173ACT', 'EXTRACT'],
  ['AND/O未译25173', 'AND/OR'],
  ['JOIN、未译25173IGHT', 'JOIN、RIGHT'],
  ['JOIN、C未译25173OSS', 'JOIN、CROSS'],
  ['CONST未译25173AINT', 'CONSTRAINT'],
  ['未译25173ECU未译25173SIVE', 'RECURSIVE'],
  ['未译25173EAD', 'READ'],
  ['未译25173EAD|W未译25173ITE', 'READ|WRITE'],
  ['DECLA未译25173E', 'DECLARE'],
  ['DETE未译25173MINISTIC', 'DETERMINISTIC'],
  ['未译25173ETU未译25173NS', 'RETURNS'],
  ['未译25173ETU未译25173N', 'RETURN'],
  ['AFTE未译25173', 'AFTER'],
  ['BEFORE|AFTE未译25173', 'BEFORE|AFTER'],
  ['P未译25173IVILEGES', 'PRIVILEGES'],
  ['YEA未译25173', 'YEAR'],
  ['JSON_A未译25173未译25173AY', 'JSON_ARRAY'],
  ['STO未译25173ED', 'STORED'],
  ['VI未译25173TUAL', 'VIRTUAL'],
  ['INFO未译25173MATION_SCHEM', 'INFORMATION_SCHEM'],
  ['S未译25173ID', 'SRID'],
  ['未译25173eference', 'reference'],
  ['未译25173TO/未译25173PO', 'RTO/RPO'],
  ['未译25173edis', 'Redis'],
  ['O未译25173M', 'ORM'],
  ['C未译25173M', 'CRM'],
  ['O未译25173 REPLACE', 'OR REPLACE'],
  ['O未译25173，', 'OR，'],
  ['O未译25173 employee_name', 'OR employee_name'],
  ['数据未译87073_name', 'database_name'],
  ['未译50816atted_time', 'formatted_time'],
  ['customers_未译87485.csv', 'customers_data.csv'],
  ['--数据未译87073s', '--databases'],
  ['SHA未译25173E', 'SHARE'],
  ['W未译25173ITE', 'WRITE'],
  ['HANDLE未译25173', 'HANDLER'],
  ['未译66984.table', 'db_name.table'],
  ['in未译50816ation_未译30578', 'information_schema'],
  ['table_未译30578', 'table_schema'],
  ['用户_未译87073', 'user_base'],
  ['customer_未译87073', 'customer_base'],
  ['product_未译87073', 'product_base'],
  ['未译87073', 'base'],
  ['未译88447_id', 'request_id'],
  ['用户_未译66984', 'user_shard'],
  ['order_未译66984', 'order_shard'],
  ['支付ment_未译66984', 'payment_shard'],
  ['inventory_未译66984', 'inventory_shard'],
  ['未译66984_首页', 'shard_index'],
  ['未译66984 = shard', 'shard_index = shard'],
  ['支付ment_flow_未译66984', 'payment_flow_shard'],
  ['未译10367_urls', 'image_urls'],
  ['CHA未译25173(3)', 'CHAR(3)'],
]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) result.push(full);
  }
  return result;
}

const files = walk(sqlRoot);
let touchedFiles = 0;
let totalReplacements = 0;
const replacementStats = new Map();
const remaining = [];

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [bad, good] of directReplacements) {
    const count = after.split(bad).length - 1;
    if (count > 0) {
      after = after.split(bad).join(good);
      totalReplacements += count;
      replacementStats.set(`${bad} -> ${good}`, (replacementStats.get(`${bad} -> ${good}`) ?? 0) + count);
    }
  }
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    touchedFiles += 1;
  }

  const left = [...after.matchAll(/未译\d+/g)];
  if (left.length > 0) {
    remaining.push({ file, count: left.length });
  }
}

console.log(`修复文件数: ${touchedFiles}`);
console.log(`替换次数: ${totalReplacements}`);
console.log('高频替换:');
for (const [item, count] of [...replacementStats.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50)) {
  console.log(`${count}\t${item}`);
}
console.log(`剩余含未译文件数: ${remaining.length}`);
console.log('剩余最多的文件:');
for (const item of remaining.sort((a, b) => b.count - a.count).slice(0, 30)) {
  console.log(`${item.count}\t${path.relative(root, item.file).replaceAll(path.sep, '/')}`);
}
