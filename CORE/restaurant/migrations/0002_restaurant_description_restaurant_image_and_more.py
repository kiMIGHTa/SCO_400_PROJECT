# Generated by Django 5.1.6 on 2025-02-26 12:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='description',
            field=models.CharField(default='No description provided.', max_length=255),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='restaurant_images/'),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='rating',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
