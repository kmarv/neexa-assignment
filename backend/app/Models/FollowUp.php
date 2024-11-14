<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'scheduled_at',
        'status',
        'created_by',
        'updated_by'
    ];

    // Automatically fill the created_by and updated_by fields
    protected static function booted()
    {
        parent::boot();

        // Set created_by when a follow-up is created
        static::creating(function ($followUp) {
            $followUp->created_by = auth()->id();  // Set the currently authenticated user
        });

        // Set updated_by when a follow-up is updated
        static::updating(function ($followUp) {
            $followUp->updated_by = auth()->id();  // Set the currently authenticated user
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

    // Define relationship with Lead
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }


}
