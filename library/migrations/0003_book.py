# Generated by Django 5.2.4 on 2025-07-09 07:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library', '0002_alter_customuser_phone_alter_customuser_username'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50, unique=True)),
                ('author', models.CharField(max_length=50)),
                ('image', models.ImageField(upload_to='')),
                ('description', models.TextField()),
                ('price', models.FloatField()),
                ('category', models.CharField(max_length=20)),
            ],
        ),
    ]
