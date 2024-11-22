<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use App\Models\FollowUp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\RegisterUserRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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

    public function getStatistics()
    {
        // Get the logged-in user
        $user = auth()->user();

        // Check if the user has the 'Sale Rep' role
        if ($user->roles()->first()->name === 'Sales Rep') {
            // Get stats for the specific Sale Rep
            $leadsCount = Lead::where('created_by', $user->id)->count();
            $followUpsCount = FollowUp::where('created_by', $user->id)->count();
            $followUps = FollowUp::where('created_by', $user->id)
                ->selectRaw("
                COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
                COUNT(CASE WHEN status = 'missed' THEN 1 END) AS missed
            ")
                ->first();

            return response()->json([
                'leads_count' => $leadsCount,
                'follow_ups_count' => $followUpsCount,
                'follow_ups' => $followUps,
            ]);
        } elseif ($user->roles()->first()->name === 'Admin') {
            // Stats for Admin
            $salesRepsCount = User::whereHas('roles', function ($query) {
                $query->where('name', 'Sales Rep');
            })->count();

            $salesManagersCount = User::whereHas('roles', function ($query) {
                $query->where('name', 'Sales Manager');
            })->count();

            $totalLeads = Lead::count();
            $totalFollowUps = FollowUp::count();
            $leadsBySalesReps = Lead::select('created_by', DB::raw('COUNT(*) as total'))
                ->groupBy('created_by')
                ->get();

            $followUpSummary = FollowUp::selectRaw("
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
            COUNT(CASE WHEN status = 'missed' THEN 1 END) AS missed
        ")->first();

            return response()->json([
                'sales_reps_count' => $salesRepsCount,
                'sales_managers_count' => $salesManagersCount,
                'leads_count' => $totalLeads,
                'follow_ups_count' => $totalFollowUps,
                // 'leads_by_sales_reps' => $leadsBySalesReps,
                'follow_ups' => $followUpSummary,
            ]);
        } else {
            // General stats for other roles
            $leadsCount = Lead::count();
            $followUpsCount = FollowUp::count();
            $followUps = FollowUp::selectRaw("
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
            COUNT(CASE WHEN status = 'missed' THEN 1 END) AS missed
        ")->first();

            return response()->json([
                'leads_count' => $leadsCount,
                'follow_ups_count' => $followUpsCount,
                'follow_ups' => $followUps,
            ]);
        }
    }

    public function getPermissions()
    {
        $permissions = Permission::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Permissions fetched successfully',
            'data' => [
                'permissions' => $permissions
            ],
        ], 200);
    }

   
        /**
         * Update the permissions for the specified role.
         *
         * @param Request $request
         * @return \Illuminate\Http\JsonResponse
         */
    public function updateRolePermissions(Request $request)
    {
        try {
            $validated = $request->validate([
                'role_id' => 'required|integer|exists:roles,id',
                'permissions_to_add' => 'array',
                'permissions_to_add.*' => 'integer|exists:permissions,id',
                'permissions_to_remove' => 'array',
                'permissions_to_remove.*' => 'integer|exists:permissions,id',
            ]);

            $role = Role::findOrFail($validated['role_id']);

            // Initialize arrays to track actions
            $addedPermissions = [];
            $removedPermissions = [];

            // Handle permissions to add
            if (!empty($validated['permissions_to_add'])) {
                $permissionsToAdd = Permission::whereIn('id', $validated['permissions_to_add'])->get();

                foreach ($permissionsToAdd as $permission) {
                    if (!$role->hasPermissionTo($permission)) {
                        $role->givePermissionTo($permission);
                        $addedPermissions[] = $permission->name;
                    }
                }
            }

            // Handle permissions to remove
            if (!empty($validated['permissions_to_remove'])) {
                $permissionsToRemove = Permission::whereIn('id', $validated['permissions_to_remove'])->get();

                foreach ($permissionsToRemove as $permission) {
                    if ($role->hasPermissionTo($permission)) {
                        $role->revokePermissionTo($permission);
                        $removedPermissions[] = $permission->name;
                    }
                }
            }

            return response()->json([
                'message' => "Permissions successfully updated for role '{$role->name}'.",
                'added_permissions' => $addedPermissions,
                'removed_permissions' => $removedPermissions,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Role or permission not found.',
                'details' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An unexpected error occurred while updating permissions.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

}
