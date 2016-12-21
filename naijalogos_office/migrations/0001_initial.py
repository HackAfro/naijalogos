# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-17 15:02
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Imprest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('amount', models.PositiveIntegerField()),
                ('is_approved', models.BooleanField(default=False)),
                ('raised_by', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='VendorRemittance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('vendor_name', models.CharField(max_length=500)),
                ('bank_name', models.CharField(max_length=500)),
                ('account_details', models.PositiveIntegerField()),
                ('job_description', models.TextField()),
                ('quantity', models.PositiveIntegerField()),
                ('currency', models.CharField(max_length=5)),
                ('amount_due', models.PositiveIntegerField()),
                ('delivery_date', models.DateField()),
                ('current_payment', models.PositiveIntegerField()),
                ('outstanding_balance', models.PositiveIntegerField(blank=True, null=True)),
                ('is_approved', models.BooleanField(default=False)),
                ('prepared_by', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]