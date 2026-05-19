import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const file = path.join(root, 'Linux学习资料/Linux运维知识库/14-安全加固/03-端口暴露与防火墙基线.md')
const original = fs.readFileSync(file, 'utf8')
const updated = original.replace(/^```Java学习资料script\s*$/gm, '```javascript')

if (updated !== original) {
  fs.writeFileSync(file, updated, 'utf8')
  console.log('Fixed Java学习资料script fence.')
} else {
  console.log('No Java学习资料script fence found.')
}
