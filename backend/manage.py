#!/usr/bin/env python
"""
Django 的命令行管理工具
用于执行各种管理任务，如数据库迁移、创建超级用户、运行开发服务器等

常用命令：
- python manage.py runserver: 启动开发服务器
- python manage.py migrate: 执行数据库迁移
- python manage.py createsuperuser: 创建超级管理员
- python manage.py makemigrations: 创建数据库迁移文件
- python manage.py collectstatic: 收集静态文件
"""
import os
import sys


def main():
    """
    执行管理任务
    
    功能：
    - 设置 Django 配置模块
    - 导入 Django 管理命令行工具
    - 执行用户指定的管理命令
    """
    # 设置默认的 Django 配置模块
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mvp_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "无法导入 Django。请确保已安装 Django，并且在 PYTHONPATH 环境变量中可用。"
            "是否忘记激活虚拟环境？"
        ) from exc
    # 执行命令行参数指定的管理命令
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
