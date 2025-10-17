<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Raw SELECT query
        $services = DB::select("SELECT * FROM services ORDER BY id DESC");
        return response()->json($services);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|string',
            'cost' => 'nullable|numeric',
            'procedure_overview' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'key_benefits' => 'nullable|string',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
        }

        // Raw INSERT query
        DB::insert(
            "INSERT INTO services (name, description, duration, cost, procedure_overview, image, key_benefits, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $validated['name'],
                $validated['description'] ?? null,
                $validated['duration'] ?? null,
                $validated['cost'] ?? null,
                $validated['procedure_overview'] ?? null,
                $imagePath,
                $validated['key_benefits'] ?? null
            ]
        );

        // Get the newly created record
        $service = DB::select("SELECT * FROM services ORDER BY id DESC LIMIT 1");

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'service' => $service[0]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $service = DB::select("SELECT * FROM services WHERE id = ?", [$id]);
        if (empty($service)) {
            return response()->json(['message' => 'Service not found'], 404);
        }
        return response()->json($service[0]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'nullable|string',
            'cost' => 'nullable|numeric',
            'procedure_overview' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'key_benefits' => 'nullable|string',
        ]);

        // Fetch existing record
        $existing = DB::select("SELECT * FROM services WHERE id = ?", [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Service not found'], 404);
        }
        $existing = $existing[0];

        // Handle image update
        $imagePath = $existing->image;
        if ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('services', 'public');
        }

        // Raw UPDATE query
        DB::update(
            "UPDATE services
             SET name = ?, description = ?, duration = ?, cost = ?, procedure_overview = ?, image = ?, key_benefits = ?, updated_at = NOW()
             WHERE id = ?",
            [
                $validated['name'],
                $validated['description'] ?? null,
                $validated['duration'] ?? null,
                $validated['cost'] ?? null,
                $validated['procedure_overview'] ?? null,
                $imagePath,
                $validated['key_benefits'] ?? null,
                $id
            ]
        );

        // Fetch updated record
        $service = DB::select("SELECT * FROM services WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully',
            'service' => $service[0]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Fetch service first
        $service = DB::select("SELECT * FROM services WHERE id = ?", [$id]);
        if (empty($service)) {
            return response()->json(['message' => 'Service not found'], 404);
        }
        $service = $service[0];

        // Delete image if exists
        if ($service->image && Storage::disk('public')->exists($service->image)) {
            Storage::disk('public')->delete($service->image);
        }

        // Raw DELETE query
        DB::delete("DELETE FROM services WHERE id = ?", [$id]);

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }
}
