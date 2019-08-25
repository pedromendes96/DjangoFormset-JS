from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('create/', views.FormSetCreateDemoView.as_view()),
    path('delete/', views.FormSetCreateDeleteDemoView.as_view()),
    path('order/', views.FormSetCreateOrderDemoView.as_view()),
    path('deleteorder/', views.FormSetCreateOrderDeleteDemoView.as_view()),
]
