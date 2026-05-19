# awk、sed、sort 文本处理

## 作用

`awk`、`sed`、`sort`、`uniq`、`wc` 用于对文本进行提取、截取、统计和排序。运维排查中，经常需要统计访问最多的 IP、查看某几行日志、计算错误次数、提取某一列数据。这些工具可以把日志从“海量文本”变成“可判断的信息”。

## 痛点

- 只能看日志，不能统计。
- 不知道访问最多的 IP 是谁。
- 不知道某个错误出现了多少次。
- 只想看第 100 到 150 行，却不知道怎么截取。
- 直接用编辑器打开大文件，效率低。

## 优点

- 能从文本中提取关键列。
- 能统计重复次数。
- 能按数字或字典排序。
- 能查看指定行范围。
- 能把多条命令组合成简单分析流水线。

## wc

统计行数、字数、字节数：

```bash
wc app.日志
wc -l app.日志
```

常用：

```bash
grep "ERROR" app.日志 | wc -l
```

用于统计错误出现次数。

## sort

排序：

```bash
sort access.日志
sort -n numbers.txt
sort -nr counts.txt
```

参数：

- `-n`：按数字排序。
- `-r`：倒序。
- `-u`：去重排序。

## uniq

统计连续重复行：

```bash
sort access.日志 | uniq -c
```

注意：`uniq` 只统计相邻重复行，所以通常要先 `sort`。

## awk

`awk` 适合按列处理文本。

访问日志第一列通常是 IP：

```bash
awk '{print $1}' access.日志
```

打印第一列和第七列：

```bash
awk '{print $1, $7}' access.日志
```

按条件过滤：

```bash
awk '$9 >= 500 {print $0}' access.日志
```

含义：打印 HTTP 状态码大于等于 500 的行。具体列号要根据日志格式确认。

## sed

`sed` 适合按行处理。

查看第 100 到 150 行：

```bash
sed -n '100,150p' app.日志
```

替换文本并输出到屏幕：

```bash
sed 's/old/new/g' file.txt
```

原地替换：

```bash
sed -i.bak 's/old/new/g' file.txt
```

注意：`sed -i` 会修改文件，建议带备份后缀。

## 常见统计场景

### 统计访问最多的 IP

```bash
awk '{print $1}' access.日志 | sort | uniq -c | sort -nr | head
```

### 统计 500 错误数量

```bash
awk '$9 >= 500 {print $9}' access.日志 | sort | uniq -c | sort -nr
```

### 查看错误关键字出现次数

```bash
grep "ERROR" app.日志 | wc -l
```

### 查看某个时间段日志片段

```bash
grep "2026-05-11 10:" app.日志 | head
grep "2026-05-11 10:" app.日志 | tail
```

### 查看指定行范围

```bash
sed -n '1000,1100p' app.日志
```

## 使用技巧

- `awk` 适合列。
- `sed` 适合行和替换。
- `sort | uniq -c | sort -nr` 是统计高频项的常用组合。
- 对大日志先按时间或关键字过滤，再统计。
- 原地修改前先备份。

## 难点

- 不同日志格式列号不同，不能盲目假设 `$9` 就是状态码。
- `uniq` 前通常要先 `sort`。
- `sed -i` 会直接改文件，风险高。
- 文本中有空格、引号、特殊分隔符时，awk 默认按空白分列可能不够。

## 重点

- `wc -l` 统计行数。
- `awk '{print $1}'` 提取列。
- `sed -n '起始,结束p'` 查看行范围。
- `sort | uniq -c | sort -nr` 统计排行。
- `sed -i` 前必须备份。

## 练习

1. 创建一个访问日志样例，用 `awk` 提取第一列 IP。
2. 用 `sort | uniq -c | sort -nr` 统计出现最多的 IP。
3. 用 `sed -n` 查看第 5 到第 10 行。
4. 用 `grep "ERROR" | wc -l` 统计错误数量。
5. 用 `sed -i.bak` 做一次替换，并确认 `.bak` 备份存在。

