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

class UserController extends Controller
{
    public function registerUser(RegisterUserRequest $request)
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

    public function getUsers()
    {
        $user = User::with('roles')->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Users fetched successfully',
            'data' => [
                'users' => $user
            ],
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['status' => 'success', 'message' => 'User deleted successfully'], 200);
    }


    /**
     * Assign a role to the user.
     */
    public function assignRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Get the role
        $role = Role::where('name', $request->role)->first();

        if ($role) {
            $user->removeRole($user->roles()->first()->name);
            // Revoke current roles and assign the new role
            $user->syncRoles([$role]); // This will remove the current role(s) and assign the new one

            return response()->json([
                'message' => 'Role replaced successfully',
                'user' => $user->load('roles'), // Return user with the assigned role
            ]);
        }

        return response()->json([
            'message' => 'Role not found',
        ], 404);
    }


}
