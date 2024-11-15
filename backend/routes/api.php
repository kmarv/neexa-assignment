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


Route::group(
    [
        'prefix' => 'auth'
    ],
    function ($router) {

        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
        Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
        Route::post('me', [AuthController::class, 'me'])->middleware('auth:api');
        Route::get('roles', [AuthController::class, 'getRoles']);
    }
);

Route::group([
    'prefix' => 'users',
    'middleware' => ['auth:api', 'permission:manage users']
], function () {
    Route::post('register', [UserController::class, 'registerUser']);
});

Route::middleware('auth:api')->prefix('followups')->group(function () {
    Route::post('/', [FollowUpController::class, 'store']);
    Route::get('/', [FollowUpController::class, 'index']);
    Route::put('/{id}/status', [FollowUpController::class, 'updateStatus'])->middleware('permission:update followup status');
    Route::put('/${id}/reschedule', [FollowUpController::class, 'reschedule']);
});

Route::middleware('auth:api')->prefix('leads')->group(function () {
    Route::get('/', [LeadController::class, 'index']);           // GET all leads
    Route::post('/', [LeadController::class, 'store']);          // POST new lead
    Route::put('/{id}', [LeadController::class, 'update']);      // PUT update a lead (standard RESTful route)
    Route::put('/{id}/assign', [LeadController::class, 'assignTo']); // PUT assign a lead
    Route::delete('/{id}', [LeadController::class, 'destroy'])->middleware('permission:delete leads'); // DELETE with permission middleware
});
