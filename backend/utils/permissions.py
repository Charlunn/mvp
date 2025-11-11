from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    自定义权限类：只允许管理员用户访问
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (
                request.user.user_type == 'admin'
                or request.user.is_staff
                or request.user.is_superuser
            )
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    自定义权限类：只允许对象所有者或管理员访问
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # 管理员可以访问所有对象
        if (
            request.user.user_type == 'admin'
            or request.user.is_staff
            or request.user.is_superuser
        ):
            return True
        
        # 检查对象是否有user属性（所有者）
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'author'):
            return obj.author == request.user
        
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    自定义权限类：所有者可以编辑，其他人只能读取
    """
    def has_permission(self, request, view):
        # 读取权限对所有人开放
        if request.method in permissions.SAFE_METHODS:
            return True
        # 写入权限需要认证
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # 读取权限对所有人开放
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # 管理员可以编辑所有对象
        if (
            request.user.user_type == 'admin'
            or request.user.is_staff
            or request.user.is_superuser
        ):
            return True
        
        # 检查对象是否有user属性（所有者）
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'author'):
            return obj.author == request.user
        
        return False
