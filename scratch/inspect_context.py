import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

import django.template.context as ctx
from django.test import RequestFactory

rf = RequestFactory()
request = rf.get('/')
c = ctx.RequestContext(request, {'a': 1})
print(f"Attributes of RequestContext: {dir(c)}")
print(f"__dict__ of RequestContext: {c.__dict__ if hasattr(c, '__dict__') else 'No __dict__'}")
