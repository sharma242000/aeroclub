# Generated by Django 3.0.5 on 2022-11-21 00:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aero_club', '0002_auto_20221121_0531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aeroblog',
            name='cover_img',
            field=models.ImageField(upload_to='aero/images'),
        ),
        migrations.AlterField(
            model_name='blog',
            name='img',
            field=models.ImageField(upload_to='aero/images/'),
        ),
    ]
