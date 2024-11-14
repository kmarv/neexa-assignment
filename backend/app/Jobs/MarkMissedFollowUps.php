<?php

namespace App\Jobs;

use Carbon\Carbon;
use App\Models\FollowUp;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Notifications\MissedFollowUpNotification;

class MarkMissedFollowUps implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
       
        // This updates the 'status' of all overdue follow-ups.
        FollowUp::where('scheduled_at', '<', Carbon::now())
            ->where('status', '!=', 'Missed')
            ->where('status', '!=', 'Completed')

            ->update(['status' => 'Missed']);

        // Step 2: Fetch all follow-ups that were marked as 'Missed'.
        // Make sure we are calling `get()` to retrieve the collection of `FollowUp` instances.
        $overdueFollowUps = FollowUp::with('lead.userAssigned')
            ->where('status', 'Missed')  // Get only those that are missed.
            ->get();  // This executes the query and returns actual models.

        // Loop through each `FollowUp` instance and send a notification.
        foreach ($overdueFollowUps as $followUp) {
            $assignedUser = $followUp->lead->userAssigned;

            if ($assignedUser) {
                try {
                    // Send the correct notification (MissedFollowUpNotification)
                    $assignedUser->notify(new MissedFollowUpNotification($followUp));
                } catch (\Exception $e) {
                    // Log any errors for debugging purposes
                    Log::error("Failed to send notification for Follow-up ID {$followUp->id}: " . $e->getMessage());
                }
            }
        }


    }
}
