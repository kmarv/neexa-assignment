<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignRequest;
use App\Models\Lead;
use Illuminate\Http\Request;
use App\Http\Requests\CreateLeadRequest;
use App\Http\Requests\UpdateLeadRequest;

class LeadController extends Controller
{

    public function __construct()
    {
        // Apply authentication middleware to all methods
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of leads.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Get the logged-in user
        $user = auth()->user();

        // If the user is neither an admin nor a sales rep, filter the leads by the 'created_by' field
        if ($user->roles()->first()->name !== 'Admin' && $user->roles()->first()->name !== 'Sales Manager') {
            // Get leads created by the logged-in user
            $leads = Lead::where('created_by', $user->id)->get();
        } else {
            // Admin and sales rep can see all leads
            $leads = Lead::all();
        }

        return response()->json(['leads' => $leads], 200);
    }



    /**
     * Store a newly created lead in the database.
     *
     * @param  \App\Http\Requests\CreateLeadRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CreateLeadRequest $request)
    {
        $lead = Lead::create($request->validated());
        return response()->json(['status' => 'success', 'lead' => $lead], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function assignTo(AssignRequest $request , $id)  {
        $lead = Lead::findOrFail($id);
        $lead->update($request->validated());
        return response()->json(['status' => 'success', 'lead' => $lead], 200);
    }
    

    /**
     * Update an existing lead in the database.
     *
     * @param  \App\Http\Requests\UpdateLeadRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateLeadRequest $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $lead->update($request->validated());
        return response()->json(['status' => 'success', 'lead' => $lead], 200);
    }

    /**
     * Remove the specified lead from the database.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();
        return response()->json(['status' => 'success', 'message' => 'Lead deleted successfully'], 200);
    }

}
