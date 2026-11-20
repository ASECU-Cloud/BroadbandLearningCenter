<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/monitoring/dashboard', 'monitoring/Dashboard')->name('monitoring.dashboard');
Route::inertia('/monitoring/visitor', 'monitoring/Visitor')->name('monitoring.visitor');
Route::inertia('/monitoring/training', 'monitoring/Training')->name('monitoring.training');
Route::inertia('/monitoring/activity', 'monitoring/Activity')->name('monitoring.activity');
