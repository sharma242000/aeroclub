from django import forms

from . models import Blog, AeroBlog

class BlogForm(forms.ModelForm):

    class Meta:
        model = Blog
        fields = ['title','content','paragraph1','paragraph2','paragraph3','paragraph4','paragraph5','author','img']

#aero-blog
class AeroBlogCreateForm(forms.ModelForm):
	class Meta:
		model = AeroBlog
		fields = ['title', 'short_description', 'content', 'author', 'cover_img']

class AeroBlogUpdateForm(forms.ModelForm):
    class Meta:
        model = AeroBlog
        fields = ['title', 'short_description', 'content', 'author', 'cover_img']