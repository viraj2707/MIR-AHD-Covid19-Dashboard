from django.db import models

# Create your models here.

class Ward(models.Model):
    name = models.CharField('Ward Name', max_length=256)
    color = models.CharField('Color', max_length=40)
    patients = models.IntegerField(default=-1)
    risk = models.CharField('Ward Name', max_length=256, default='NA')
    polygon = models.TextField(blank=True)

class TestCenter(models.Model):
    name = models.CharField('Name', max_length=2048)
    lat = models.DecimalField('Lat', max_digits=12, decimal_places=8)
    lng = models.DecimalField('Lat', max_digits=12, decimal_places=8)

class CovidHospital(models.Model):
    name = models.CharField('Name', max_length=2048)
    lat = models.DecimalField('Lat', max_digits=12, decimal_places=8)
    lng = models.DecimalField('Lat', max_digits=12, decimal_places=8)
