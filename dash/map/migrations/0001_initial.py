# Generated by Django 3.0.5 on 2020-04-24 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Wards',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256, verbose_name='Ward Name')),
                ('color', models.CharField(max_length=40, verbose_name='Color')),
                ('polygon', models.TextField(blank=True)),
            ],
        ),
    ]
