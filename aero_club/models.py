from django.db import models

class Event(models.Model):
	title = models.CharField(max_length=140)
	happeningdate = models.DateTimeField()
	smalldescription = 	models.TextField()
	largedescription = models.TextField()
	imagelink = models.CharField(max_length=500)
	drivelink = models.CharField(max_length=500)
	date = models.DateTimeField()
	def __str__(self):
		return self.title

class Blog(models.Model):
	title = models.CharField(max_length=30)
	content = models.TextField()
	paragraph1 = models.TextField()
	paragraph2 = models.TextField()
	paragraph3 = models.TextField()
	paragraph4 = models.TextField()
	paragraph5 = models.TextField()
	img = models.ImageField(upload_to = "aero/images/") 
	author = models.CharField(max_length=100)

class AeroBlog(models.Model):
	title = models.CharField(max_length=100)
	cover_img = models.ImageField(upload_to = "aero/images")
	short_description = models.TextField()
	content = models.TextField()
	author = models.CharField(max_length=100)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.title + " by " + self.author #to show in the django amdin backend
