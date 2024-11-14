<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FollowUpController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group([
    'prefix' => 'auth'
],
    function ($router) {

        Route::post('register', [AuthController::class,'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class,'logout'])->middleware('auth:api');
        Route::post('refresh', [AuthController::class,'refresh'])->middleware('auth:api');
        Route::post('me', [AuthController::class,'me'])->middleware('auth:api');
    }
);

Route::group([
    'prefix'=>'users',
    'middleware'=>['auth:api', 'permission:manage users']
], function ()  {
    Route::post('register', [UserController::class, 'registerUser']);
    
});

Route::middleware('auth:api')->prefix('followups')->group(function () {
    Route::post('/', [FollowUpController::class, 'store']);
    Route::put('/{id}/status', [FollowUpController::class, 'updateStatus'])->middleware('permission:update followup status');
});

Route::group(['middleware' => ['auth:api'], 'prefix'=>'leads'], function () {
    Route::get('/', [LeadController::class, 'index']);
    Route::post('/', [LeadController::class, 'store']);
    Route::put('/{id}/update', [LeadController::class, 'update']);
    Route::put('/{id}/assign', [LeadController::class, 'assignTo']);
    Route::delete('/{id}', [LeadController::class, 'destroy'])->middleware('permission:delete leads');
});