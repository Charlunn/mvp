import os
import requests
import hashlib
from urllib.parse import urlparse
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import logging

logger = logging.getLogger(__name__)

class AvatarCacheManager:
    """
    头像缓存管理器
    负责第三方头像的下载、缓存和本地化存储
    """
    
    def __init__(self):
        self.cache_dir = getattr(settings, 'AVATAR_CACHE_DIR', 'avatars/cached/')
        self.max_file_size = getattr(settings, 'AVATAR_MAX_SIZE', 5 * 1024 * 1024)  # 5MB
        self.timeout = getattr(settings, 'AVATAR_DOWNLOAD_TIMEOUT', 10)  # 10秒
        self.allowed_formats = getattr(settings, 'AVATAR_ALLOWED_FORMATS', ['jpg', 'jpeg', 'png', 'gif', 'webp'])
    
    def generate_cache_key(self, url):
        """
        根据URL生成缓存键
        """
        return hashlib.md5(url.encode('utf-8')).hexdigest()
    
    def get_file_extension(self, url, content_type=None):
        """
        获取文件扩展名
        """
        # 首先尝试从URL获取扩展名
        parsed_url = urlparse(url)
        path = parsed_url.path.lower()
        
        for ext in self.allowed_formats:
            if path.endswith(f'.{ext}'):
                return ext
        
        # 如果URL中没有扩展名，尝试从Content-Type获取
        if content_type:
            content_type = content_type.lower()
            if 'jpeg' in content_type or 'jpg' in content_type:
                return 'jpg'
            elif 'png' in content_type:
                return 'png'
            elif 'gif' in content_type:
                return 'gif'
            elif 'webp' in content_type:
                return 'webp'
        
        # 默认返回jpg
        return 'jpg'
    
    def is_valid_image_url(self, url):
        """
        验证是否为有效的图片URL
        """
        if not url or not isinstance(url, str):
            return False
        
        try:
            parsed = urlparse(url)
            return parsed.scheme in ['http', 'https'] and parsed.netloc
        except Exception:
            return False
    
    def download_avatar(self, url):
        """
        下载头像文件
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(
                url, 
                headers=headers, 
                timeout=self.timeout,
                stream=True
            )
            response.raise_for_status()
            
            # 检查文件大小
            content_length = response.headers.get('content-length')
            if content_length and int(content_length) > self.max_file_size:
                raise ValueError(f"文件大小超过限制: {content_length} bytes")
            
            # 读取内容
            content = b''
            for chunk in response.iter_content(chunk_size=8192):
                content += chunk
                if len(content) > self.max_file_size:
                    raise ValueError(f"文件大小超过限制: {len(content)} bytes")
            
            content_type = response.headers.get('content-type', '')
            
            return content, content_type
            
        except requests.RequestException as e:
            logger.error(f"下载头像失败 {url}: {e}")
            raise
        except Exception as e:
            logger.error(f"处理头像下载时出错 {url}: {e}")
            raise
    
    def cache_avatar(self, url):
        """
        缓存头像到本地存储
        返回本地文件路径
        """
        if not self.is_valid_image_url(url):
            logger.warning(f"无效的头像URL: {url}")
            return None
        
        try:
            # 生成缓存键和文件名
            cache_key = self.generate_cache_key(url)
            
            # 检查是否已经缓存
            for ext in self.allowed_formats:
                cached_path = f"{self.cache_dir}{cache_key}.{ext}"
                if default_storage.exists(cached_path):
                    logger.info(f"头像已缓存: {cached_path}")
                    return cached_path
            
            # 下载头像
            content, content_type = self.download_avatar(url)
            
            # 确定文件扩展名
            file_ext = self.get_file_extension(url, content_type)
            
            # 保存到本地存储
            file_path = f"{self.cache_dir}{cache_key}.{file_ext}"
            
            # 确保目录存在
            os.makedirs(os.path.dirname(default_storage.path(file_path)), exist_ok=True)
            
            # 保存文件
            saved_path = default_storage.save(file_path, ContentFile(content))
            
            logger.info(f"头像缓存成功: {url} -> {saved_path}")
            return saved_path
            
        except Exception as e:
            logger.error(f"缓存头像失败 {url}: {e}")
            return None
    
    def get_cached_avatar_url(self, original_url):
        """
        获取缓存头像的URL
        如果没有缓存，尝试缓存后返回
        """
        if not original_url:
            return None
        
        # 尝试缓存头像
        cached_path = self.cache_avatar(original_url)
        
        if cached_path:
            # 返回可访问的URL
            return default_storage.url(cached_path)
        
        # 如果缓存失败，返回原始URL
        return original_url
    
    def cleanup_expired_cache(self, days=30):
        """
        清理过期的缓存文件
        """
        try:
            import time
            from datetime import datetime, timedelta
            
            cutoff_time = time.time() - (days * 24 * 60 * 60)
            
            # 获取缓存目录中的所有文件
            cache_files = default_storage.listdir(self.cache_dir)[1]  # [1] 是文件列表
            
            deleted_count = 0
            for filename in cache_files:
                file_path = f"{self.cache_dir}{filename}"
                
                try:
                    # 获取文件修改时间
                    file_time = default_storage.get_modified_time(file_path).timestamp()
                    
                    if file_time < cutoff_time:
                        default_storage.delete(file_path)
                        deleted_count += 1
                        logger.info(f"删除过期缓存文件: {file_path}")
                        
                except Exception as e:
                    logger.error(f"处理缓存文件时出错 {file_path}: {e}")
            
            logger.info(f"清理完成，删除了 {deleted_count} 个过期缓存文件")
            return deleted_count
            
        except Exception as e:
            logger.error(f"清理缓存时出错: {e}")
            return 0

# 创建全局实例
avatar_cache_manager = AvatarCacheManager()