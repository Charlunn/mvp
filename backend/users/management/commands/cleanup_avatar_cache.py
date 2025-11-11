from django.core.management.base import BaseCommand
from utils.avatar_cache import avatar_cache_manager

class Command(BaseCommand):
    help = '清理过期的头像缓存文件'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='清理多少天前的缓存文件（默认30天）'
        )
    
    def handle(self, *args, **options):
        days = options['days']
        
        self.stdout.write(
            self.style.SUCCESS(f'开始清理 {days} 天前的头像缓存文件...')
        )
        
        try:
            deleted_count = avatar_cache_manager.cleanup_expired_cache(days)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'清理完成！删除了 {deleted_count} 个过期缓存文件。'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'清理缓存时发生错误: {e}')
            )