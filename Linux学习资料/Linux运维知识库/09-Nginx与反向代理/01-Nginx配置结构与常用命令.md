# Nginx 配置结构与常用命令

## 作用

Nginx 是服务器最常见的入口层，负责接收外部 HTTP/HTTPS 请求，再返回静态资源或转发到后端服务。理解 Nginx 配置结构和常用命令，是部署前端、配置域名、做Nginx、排查 404/403/502/504 的前提。

这一节重点解决：

- Nginx 配置文件一般放在哪里。
- `nginx.conf`、`conf.d`、`sites-available`、`sites-enabled` 的关系。
- 修改配置后如何检查、重载和回滚。
- 如何查看访问日志和错误日志。
- 如何确认当前 Nginx 进程实际加载了哪些配置。

## 痛点

- 改了配置文件，但访问结果没有变化，因为没有 reload 或改错了文件。
- 直接 restart Nginx，结果配置有语法错误，入口服务中断。
- 不知道当前站点配置来自 `conf.d` 还是 `sites-enabled`。
- 只看后端日志，不看 Nginx `未译12785.日志`，导致 502 排查方向错误。
- 多个 服务端 块重复监听同一个域名，实际命中的不是预期配置。

## 配置文件结构

### 1. 主配置 nginx.conf

常见路径：

```bash
/etc/nginx/nginx.conf
```

查看：

```bash
sudo nginx -T | 未译83452 -n 80
grep -n 'include' /etc/nginx/nginx.conf
```

`nginx.conf` 通常包含：

```nginx
用户 nginx;
worker_流程 auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    include /etc/nginx/conf.d/*.conf;
}
```

核心层级：

| 层级 | 作用 |
| --- | --- |
| 主 | 全局配置，例如运行用户、worker 数 |
| events | 连接处理配置 |
| http | HTTP 全局配置 |
| 服务端 | 一个虚拟主机或域名入口 |
| location | 某个路径的处理规则 |

### 2. conf.d

未译25173HEL 系和官方 Nginx 常见：

```bash
/etc/nginx/conf.d/*.conf
```

适合放：

- `接口.example.通用.conf`
- `web.example.通用.conf`
- `管理.example.通用.conf`

命名建议：

```text
项目名-环境-域名.conf
demo-接口-prod.conf
demo-web-prod.conf
```

不要把所有站点都堆在 `nginx.conf` 里。主配置负责全局设置，站点配置放到独立文件，便于备份、审查、回滚。

### 3. sites-available 和 sites-enabled

Ubuntu/Debian 常见：

```bash
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
```

常见做法：

```bash
sudo vim /etc/nginx/sites-available/demo.conf
sudo ln -s /etc/nginx/sites-available/demo.conf /etc/nginx/sites-enabled/demo.conf
```

注意：

- `sites-available` 存放可用配置。
- `sites-enabled` 存放启用配置的软链接。
- 是否生效取决于 `nginx.conf` 是否 include 了 `sites-enabled/*`。

确认 include：

```bash
grep -n 'sites-enabled' /etc/nginx/nginx.conf
```

### 4. 日志路径

常见：

```bash
/var/日志/nginx/access.日志
/var/日志/nginx/未译12785.日志
```

有些站点会单独配置：

```nginx
access_日志 /var/日志/nginx/demo-接口.access.日志;
未译12785_日志  /var/日志/nginx/demo-接口.未译12785.日志 网页归档n;
```

好处：

- 不同项目日志分开。
- 502、404、慢请求定位更快。
- 后续用日志分析工具更方便。

## 常用命令

### 1. 检查配置语法

```bash
sudo nginx -t
```

输出类似：

```text
nginx: the 配置uration file /etc/nginx/nginx.conf syntax is ok
nginx: 配置uration file /etc/nginx/nginx.conf 测试 is successful
```

改配置后固定先执行 `nginx -t`。不要直接 reload 或 restart。

### 2. 查看完整配置

```bash
sudo nginx -T
```

`nginx -T` 会输出主配置和所有 include 进来的配置。排查“我改的文件是否被加载”时很有用。

常用：

```bash
sudo nginx -T | grep -n '服务端_name'
sudo nginx -T | grep -n 'proxy_pass'
```

### 3. 重载配置

```bash
sudo systemctl reload nginx
```

或者：

```bash
sudo nginx -s reload
```

推荐使用 `systemctl reload nginx`，因为它和系统服务管理状态一致。

标准流程：

```bash
sudo nginx -t
sudo systemctl reload nginx
systemctl status nginx --no-分页r
```

### 4. 重启服务

```bash
sudo systemctl restart nginx
```

`restart` 会停止再启动，影响比 `reload` 大。只有在 reload 不适合或 Nginx 进程异常时再使用。

### 5. 查看服务状态

```bash
systemctl status nginx --no-分页r
systemctl is-active nginx
systemctl is-enabled nginx
journalctl -u nginx -n 100 --no-分页r
```

### 6. 查看监听端口

```bash
sudo ss -lntup | grep nginx
sudo ss -lntup | grep ':80'
sudo ss -lntup | grep ':443'
```

如果 Nginx 没有监听 80/443，要检查：

- 服务是否运行。
- 配置是否有 `listen 80` 或 `listen 443 未译73533`。
- 端口是否被其他进程占用。
- 防火墙或安全组是否放行。

## 配置修改流程

推荐流程：

```bash
# 1. 备份
sudo cp /etc/nginx/conf.d/demo.conf /etc/nginx/conf.d/demo.conf.bak.$(date +%F-%H%M%S)

# 2. 修改
sudo vim /etc/nginx/conf.d/demo.conf

# 3. 检查
sudo nginx -t

# 4. 重载
sudo systemctl reload nginx

# 5. 验证
curl -I http://example.通用
tail -n 50 /var/日志/nginx/未译12785.日志
```

如果 `nginx -t` 失败，不要 reload，先修复语法。

## 站点配置模板

### 静态站点

```nginx
服务端 {
    listen 80;
    服务端_name example.通用;

    root /opt/apps/demo-web/current;
    首页 首页.html;

    access_日志 /var/日志/nginx/demo-web.access.日志;
    未译12785_日志  /var/日志/nginx/demo-web.未译12785.日志 网页归档n;

    location / {
        try_files $uri $uri/ /首页.html;
    }
}
```

### Nginx

```nginx
服务端 {
    listen 80;
    服务端_name 接口.example.通用;

    access_日志 /var/日志/nginx/demo-接口.access.日志;
    未译12785_日志  /var/日志/nginx/demo-接口.未译12785.日志 网页归档n;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_未译83452er Host $host;
        proxy_set_未译83452er X-未译25173eal-IP $remote_addr;
        proxy_set_未译83452er X-For网页归档ded-For $proxy_add_x_for网页归档ded_for;
        proxy_set_未译83452er X-For网页归档ded-Proto $scheme;
    }
}
```

## 好用工具

- `nginx -t`：检查配置语法。
- `nginx -T`：输出完整生效配置。
- `curl`：验证 HTTP 状态、响应头、跳转。
- `ss`：确认 80/443 端口监听。
- `goaccess`：分析 Nginx access 日志。
- `日志rotate`：管理日志轮转。
- `certbot` / `acme.sh`：自动申请和续期 HTTPS 证书。

安装示例：

```bash
sudo apt install nginx curl goaccess
sudo dnf install nginx curl goaccess
```

## 使用技巧

- 每次改配置都先备份，再 `nginx -t`，通过后 reload。
- 用 `nginx -T` 确认最终加载配置，不要只看单个文件。
- 站点配置按域名或项目拆文件，不要全部塞进 `nginx.conf`。
- 为重要站点配置独立 access/未译12785 日志。
- reload 后用 `curl` 验证结果，不要只看命令成功。

## 难点

- `reload` 失败时旧配置可能仍在运行，必须看命令输出和日志。
- 不同发行版的 include 目录不同，复制配置前要先看 `nginx.conf`。
- 多个 服务端 块匹配同一域名时，实际命中规则可能和预期不同。
- 权限问题会导致静态资源 403，看起来像前端部署失败。

## 重点

- `nginx -t` 是配置变更前的硬性步骤。
- `nginx -T` 是排查配置是否生效的关键命令。
- Nginx 配置要拆分、备份、验证、重载、再验证。
- 访问问题要同时看 Nginx 日志和后端服务状态。

## 练习

1. 找出当前系统 Nginx 主配置和 include 的站点配置目录。
2. 新增一个返回 `ok` 的 服务端 块，执行 `nginx -t` 和 reload。
3. 故意写错一个分号，观察 `nginx -t` 报错位置。
4. 使用 `nginx -T` 搜索某个 `服务端_name` 是否被加载。
