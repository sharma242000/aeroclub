from django.contrib import admin
from aero_club.models import Event, AeroBlog

admin.site.register(Event)

#blogs registerd to backend
admin.site.register(AeroBlog)