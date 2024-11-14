<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
                'create leads',
                'view leads',
                'update leads',
                'delete leads',
                'schedule followups',
                'view followups',
                'update followup status',
                'delete followups',
                'manage users',
                'assign roles',
                'view users',
                'receive notifications',
            ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Roles and Assign Permissions
        $roleAdmin = Role::create(['name' => 'Admin']);
        $roleSalesManager = Role::create(['name' => 'Sales Manager']);
        $roleSalesRep = Role::create(['name' => 'Sales Rep']);

        // Assign Permissions to Admin Role
        $roleAdmin->givePermissionTo([
            'create leads',
            'view leads',
            'update leads',
            'delete leads',
            'schedule followups',
            'view followups',
            'update followup status',
            'delete followups',
            'manage users',
            'assign roles',
            'view users',
            'receive notifications',
        ]);


        // Assign Permissions to Sales Manager Role
        $roleSalesManager->givePermissionTo([
            'create leads',
            'view leads',
            'update leads',
            'delete leads',
            'schedule followups',
            'view followups',
            'update followup status',
            'receive notifications',
        ]);

        // Assign Permissions to Sales Rep Role
        $roleSalesRep->givePermissionTo([
            'create leads',
            'view leads',
            'schedule followups',
            'view followups',
            'receive notifications',
        ]);
    }
}
