import django.template.context as ctx
import inspect

try:
    print(inspect.getsource(ctx.BaseContext.__copy__))
except Exception as e:
    print(f"Error getting source: {e}")
