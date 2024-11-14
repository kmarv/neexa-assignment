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
        $leads = Lead::all();  // You can modify this to include role-based filtering
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
