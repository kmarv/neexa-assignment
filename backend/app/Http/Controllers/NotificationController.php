<?php

namespace App\Http\Controllers;

use Dflydev\DotAccessData\Data;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Notifications\DatabaseNotification;



class NotificationController extends Controller
{
    //
    public function index() {

        // Get the logged-in user
        $user = auth()->user();

        $notifications =  DatabaseNotification::where('notifiable_id', $user->id)->latest()->get();

        return response()->json($notifications);
    }

    public function markAsRead( $id)
    {
       

         DatabaseNotification::where('id', $id)->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        // Mark all notifications as read
        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    /**
     * Get count and status of new notifications.
     */
    public function checkNewNotifications(Request $request)
    {
        // Get the logged-in user
        $user = auth()->user();

        // Count the unread notifications for the logged-in user
        $newNotificationsCount = DatabaseNotification::where('notifiable_id', $user->id)
            ->whereNull('read_at') // Check for unread notifications
            ->count();

        // Return the count and a boolean indicating if there are new notifications
        return response()->json([
            'has_new_notifications' => $newNotificationsCount > 0,
            'new_notifications_count' => $newNotificationsCount,
        ]);
    }
}
