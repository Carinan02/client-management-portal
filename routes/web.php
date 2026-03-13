<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ImportController;
use Illuminate\Support\Facades\DB;


Route::get('/db-test', function () {
    try {
        DB::connection()->getPdo();
        return 'DB Connected! ✅ Database: ' . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return 'DB NOT Connected ❌ Error: ' . $e->getMessage();
    }
});

Route::get('/show-log', function () {
    $log = storage_path('logs/laravel.log');
    if (file_exists($log)) {
        return response()->file($log);
    }
    return 'No log file found';
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


//  Users (Admin only) 
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('users', UserController::class)->except(['show', 'destroy']);
        Route::patch('users/{user}/toggle-active', [UserController::class, 'toggleActive'])
            ->name('users.toggle-active');
    });

// Services (Manager and Admin only)  
    Route::middleware(['role:admin,manager'])->group(function(){
        Route::resource('services',ServiceController::class)->except(['show']);
    });

    //Clients - All can access as long as authenticated
Route::get('clients', [ClientController::class, 'index'])
    ->middleware('auth')->name('clients.index');

    // Clients - (Manager and Admin All) FULL CRUD
Route::middleware('role:admin,manager')->group(function () {
    Route::resource('clients', ClientController::class)->except(['index','show']);
});

//  Imports (Admin + Manager) 
    Route::middleware(['role:admin,manager'])->group(function () {
        Route::post('imports', [ImportController::class, 'store'])->name('imports.store');
        Route::get('imports/template', [ImportController::class, 'template'])->name('imports.template');
        Route::get('imports/latest', [ImportController::class, 'latest'])->name('imports.latest');
    });


require __DIR__.'/auth.php';
