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
        // Identify and update overdue follow-ups.
        $updatedFollowUpIds = FollowUp::where('scheduled_at', '<', Carbon::now())
            ->where('status', 'Pending')
            ->pluck('id');

        FollowUp::whereIn('id', $updatedFollowUpIds)->update(['status' => 'Missed']);

        $updatedFollowUps = FollowUp::with('lead', 'createdBy')->whereIn('id', $updatedFollowUpIds)->get();
         Log::info($updatedFollowUpIds->toArray());
         Log::info($updatedFollowUps->toArray());

        foreach ($updatedFollowUps as $followUp) {
            $creator = $followUp->createdBy;

            Log::info($creator);

            if ($creator) {
                $creator->notify(new MissedFollowUpNotification($followUp));
            }
        }
    }

}
