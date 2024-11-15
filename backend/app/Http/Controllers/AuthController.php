<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\RegisterUserRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     * 
     * @param  \App\Http\Requests\RegisterUserRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function register(RegisterUserRequest $request)
    {
        try {

            //  Create the new user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password), // Encrypt the password
            ]);


            // Check if a role is provided, if not assign 'Sales Rep' by default
            $role = $request->role ?? 'Sales Rep'; // Use 'Sales Rep' as the default role

            //  Check if the role exists in the roles table (you can change this if needed)
            if (Role::where('name', $role)->exists()) {
                // Assign the specified role
                $user->assignRole($role);
            } else {
                // If the role doesn't exist, assign the default role
                $user->assignRole('Sales Rep');
            }



            // Return the user data and token in the response
            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully',
                'user' => $user,
            ], 201);
        } catch (QueryException $e) {
            // Handle database query errors (e.g., duplicate entries, constraint violations)
            Log::error('Database error during registration: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'error' => 'There was an issue with the database. Please try again later.',
            ], 500); // HTTP 500 Internal Server Error

        } catch (\Exception $e) {
            // Handle any other unexpected errors
            Log::error('Unexpected error during registration: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'error' => 'An unexpected error occurred. Please try again later.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        // Validate input
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        // If validation fails, return errors
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'error_messages' => $validator->errors(),
            ], 422);  // Return 422 Unprocessable Entity status code for validation errors
        }

        try {
            // Attempt to authenticate the user
            if (! $token = auth()->attempt($credentials)) {
                return response()->json(['error' => 'Inavlid email or Password'], 401);  // Unauthorized if credentials are incorrect
            }

            // Return the token with user details
            return $this->respondWithToken($token);
        } catch (JWTException $e) {
            // Log the JWT error (if any)
            Log::error('JWT creation failed: ' . $e->getMessage());

            return response()->json(['error' => 'Could not create token'], 500);  // Handle token creation errors
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $user = auth()->user(); // Get the authenticated user

        // Load the roles and permissions with the user
        $user->load('roles.permissions');
        return response()->json([
            'status' => 'success',
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60, // seconds
            'user' => $user,
        ]);
    }


    public function getRoles()
    {
        $roles = Role::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Roles fetched successfully',
            'data' => [
                'roles' => $roles
            ],
        ], 200);
    }

   
}
