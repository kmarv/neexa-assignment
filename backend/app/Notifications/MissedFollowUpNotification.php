<?php

namespace App\Notifications;

use App\Models\FollowUp;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MissedFollowUpNotification extends Notification
{
    use Queueable;

    protected $followUp;
    /**
     * Create a new notification instance.
     */
    public function __construct(FollowUp $followUp)
    {
        $this->followUp = $followUp;
    }
    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('A follow-up for lead ' . $this->followUp->lead->name . ' has been marked as missed.')
            ->action('View Lead', url('/'))
            ->line('Please take the necessary action to follow up again.');
    }

    /**
     * Get the database representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'follow_up_id' => $this->followUp->id,
            'lead_id' => $this->followUp->lead_id,
            'status' => $this->followUp->status,
            'message' => 'A follow-up for lead ' . $this->followUp->lead->name . ' has been marked as missed.',
            'created_at' => now(),
        ];
    }
}
