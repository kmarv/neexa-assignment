<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            // Add the 'assigned_to' column (foreign key to the users table)
            $table->unsignedBigInteger('assigned_to')->nullable();

            // Add a foreign key constraint if you are assigning this to a user
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null'); // Adjust based on your requirement (e.g., 'cascade' or 'restrict')
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            // Drop the 'assigned_to' column if rolling back the migration
            $table->dropForeign(['assigned_to']); // Drop the foreign key constraint
            $table->dropColumn('assigned_to'); // Drop the column itself
        });
    }
};
