<?php

use App\Http\Controllers\UjianController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/monitoring/dashboard', 'monitoring/Dashboard')->name('monitoring.dashboard');
Route::inertia('/monitoring/visitor', 'monitoring/Visitor')->name('monitoring.visitor');
Route::inertia('/monitoring/training', 'monitoring/Training')->name('monitoring.training');
Route::inertia('/monitoring/activity', 'monitoring/Activity')->name('monitoring.activity');

Route::prefix('/monitoring/ujian')
    ->name('monitoring.ujian.')
    ->controller(UjianController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/categories', 'storeCategory')->name('categories.store');
        Route::post('/questions', 'storeQuestion')->name('questions.store');
        Route::patch('/questions/{question}', 'updateQuestion')->name('questions.update');
        Route::delete('/questions/{question}', 'destroyQuestion')->name('questions.destroy');
        Route::post('/exams', 'storeExam')->name('exams.store');
        Route::patch('/exams/{exam}', 'updateExam')->name('exams.update');
        Route::delete('/exams/{exam}', 'destroyExam')->name('exams.destroy');
    });
