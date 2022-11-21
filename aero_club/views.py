from django.shortcuts import render, redirect, get_object_or_404

from . forms import BlogForm

from . models import AeroBlog

from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView

from . forms import AeroBlogCreateForm, AeroBlogUpdateForm

from django.urls import reverse_lazy

def revamp(request):
    return render(request,'aero/revamp.html')

def index(request):
    return render(request,'aero/main_page.html')

def gallery(request):
    return render(request,'aero/gallery.html')

def events(request):
	return render(request,'aero/events_page.html')

def teampage(request):
	return render(request,'aero/teampage.html')

def about(request):
    return render(request, 'aero/about.html')

class ListBlogView(ListView):
    model = AeroBlog
    template_name = 'aero/blogs/list.html'

class SingleBlogView(DetailView):
    model = AeroBlog
    template_name = 'aero/blogs/single.html'

class CreateBlogView(CreateView):
    model =  AeroBlog
    form_class = AeroBlogCreateForm
    template_name = 'aero/blogs/new.html'
    success_url = reverse_lazy('aero-blogs')

class UpdateBlogView(UpdateView):
    model = AeroBlog
    form_class = AeroBlogUpdateForm
    template_name = 'aero/blogs/edit.html'
    success_url = reverse_lazy('aero-blogs')

class DeleteBlogView(DeleteView):
    model = AeroBlog
    template_name = 'aero/blogs/delete.html'
    success_url = reverse_lazy('aero-blogs')

#added istp and other project url, added on 03/08
def itsp_projects(request):
    return render(request, 'aero/itsp.html')

def other_projects(request):
    return render(request, 'aero/project1.html')
def glider_projects(request):
    return render(request, 'aero/glider.html')
