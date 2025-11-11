from rest_framework.renderers import JSONRenderer
import json
import datetime

class UnicodeJSONRenderer(JSONRenderer):
    """
    自定义JSON渲染器，确保中文字符不被转义
    """
    media_type = 'application/json'
    format = 'json'
    charset = 'utf-8'
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        渲染数据为JSON，确保中文字符不被转义
        """
        if data is None:
            return b''
        
        def datetime_serializer(obj):
            if isinstance(obj, (datetime.datetime, datetime.date)):
                return obj.isoformat()
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

        ret = json.dumps(
            data, 
            ensure_ascii=False,
            indent=2 if getattr(self, 'json_underscoreize_names', False) else None,
            separators=(',', ': '),
            default=datetime_serializer
        )
        
        return ret.encode('utf-8')