<?php

namespace App\Listeners;

use App\Events\FollowUpStatusChanged;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Notifications\MissedFollowUpNotification;

class SendNotificationForMissedFollowUp
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(FollowUpStatusChanged $event): void
    {
        //

        if ($event->followUp->status  == 'Missed') {
            $event->followUp->lead->userAssigned->notify(new MissedFollowUpNotification($event->followUp));
        }
    }
}
