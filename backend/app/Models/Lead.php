<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'created_by',
        'updated_by',
        'assigned_to'
    ];

    // Automatically fill the created_by and updated_by fields
    protected static function booted()
    {
        parent::boot();

        // Set created_by when a lead is created
        static::creating(function ($lead) {
            $lead->created_by = auth()->id();  // Set the currently authenticated user
        });

        // Set updated_by when a lead is updated
        static::updating(function ($lead) {
            $lead->updated_by = auth()->id();  // Set the currently authenticated user
        });
    }

    // Define relationships to User model
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function userAssigned()  {
        return $this->belongsTo(User::class, 'assigned_to');
        
    }
}
