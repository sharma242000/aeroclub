"""stab URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from gallery import urls as gallery_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^gallery/', include(gallery_urls))
"""
from django.conf.urls import url,include
from . import views
from django.views.generic import ListView, DetailView
from aero_club.models import Event
from django.urls import path
from . views import ListBlogView, SingleBlogView, CreateBlogView, UpdateBlogView, DeleteBlogView

urlpatterns = [
    url(r'^$',views.index,name='index'),
    url(r'events/$',views.events ,name='aero-events'),
    url(r'gallery/$',views.gallery ,name='aero-gallery'),
    path('about/',views.about , name='aero-about'),
    #aero-blog
    path('blogs/', ListBlogView.as_view(), name="aero-blogs"),
    path('blogs/<int:pk>', SingleBlogView.as_view(), name="single"),
    path('blogs/new', CreateBlogView.as_view(), name="new"),
    path('blogs/<int:pk>/edit', UpdateBlogView.as_view(), name="edit"),
    path('blogs/<int:pk>/delete', DeleteBlogView.as_view(), name='delete'),
    path('team/',views.teampage, name='aero-teampage'),
    #project urls
    path('itsp-projects/', views.itsp_projects, name="aero-itsp"),
    path('other-projects/', views.other_projects, name="aero-other"),
    path('glider-projects/', views.glider_projects, name="aero-glider"),
]
