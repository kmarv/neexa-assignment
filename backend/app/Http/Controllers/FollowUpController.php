<?php

// app/Http/Controllers/FollowUpController.php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\FollowUp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\CreateFollowUpRequest;
use App\Http\Requests\UpdateFollowUpRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FollowUpController extends Controller
{

    public function index()
    {
        try {
            // Get all follow-ups
            $followUps = FollowUp::with('lead')->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Follow-ups fetched successfully.',
                'follow_ups' => $followUps,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while fetching follow-ups.',
            ]);
        }
    }
    // Schedule a follow-up
    public function store(CreateFollowUpRequest $request)
    {
        try {
            $followUp = FollowUp::create([
                'lead_id' => $request->lead_id,
                'scheduled_at' => $request->scheduled_at,
                'notes' => $request->notes,
                'status' => 'Pending',
            ]);

            // Fetch the lead associated with the follow-up
            $lead = Lead::findOrFail($followUp->lead_id);
            // status update 
            $lead->update([
                'is_followup_scheduled' => true,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Follow-up scheduled successfully.',
                'follow_up' => $followUp,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while scheduling the follow-up.',
            ], 500);
        }
    }

    // Update follow-up status
    public function updateStatus(UpdateFollowUpRequest $request, $id)
    {
        try {
            // Fetch the follow-up by ID
            $followUp = FollowUp::findOrFail($id);

            // Update the follow-up status
            $followUp->status = $request->status;
            $followUp->save();

            // Return success response
            return response()->json([
                'status' => 'success',
                'message' => 'Follow-up status updated successfully.',
                'follow_up' => $followUp,
            ]);
        } catch (ModelNotFoundException $e) {
            // Handle case where the FollowUp ID is not found
            return response()->json([
                'status' => 'error',
                'message' => 'Follow-up not found.',
            ], 404); // Not Found
        } catch (\Exception $e) {
            // General error handling
            Log::error('Error updating follow-up status: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the follow-up status.',
            ], 500); // Internal Server Error
        }
    }

    public function reschedule(Request $request, $id)
    {
        try {
            $followUp = FollowUp::findOrFail($id);
            if ($followUp->status === "Completed") {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot reschedule completed folowup'
                ]);
            }
            $followUp->update($request->validated());
            return response()->json(['status' => 'success','message'=>'Reschedule Complete' , 'follow_up' => $followUp], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Follow-up not found.'], 404);
        }
    }
}
