<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Appointment;
use App\Models\Payment;

class KhaltiController extends Controller
{
    // Your React frontend URL
    private string $frontendUrl = 'http://localhost:5173';

    public function initiate($appointment_id)
    {
        Log::info('Khalti initiate called', ['appointment_id' => $appointment_id]);

        $appointment = Appointment::find($appointment_id);

        if (!$appointment) {
            Log::error('Appointment not found in initiate', ['appointment_id' => $appointment_id]);
            return redirect($this->frontendUrl . '/?payment/failed?reason=appointment_not_found');
        }

        if ($appointment->status === 'Confirmed') {
            return redirect($this->frontendUrl . '/?payment/failed?reason=already_paid');
        }

        $payment = Payment::create([
            'appointment_id' => $appointment->id,
            'amount'         => $appointment->total_cost,
            'gateway'        => 'Khalti',
            'status'         => 'Pending'
        ]);

        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret_key'),
        ])->post(config('services.khalti.base_url') . '/epayment/initiate/', [
            "return_url"           => route('khalti.verify'),
            "website_url"          => $this->frontendUrl,
            "amount"               => (int) round($payment->amount * 100),
            "purchase_order_id"    => (string) $payment->id,
            "purchase_order_name"  => "Dental Appointment Payment",
        ]);

        if (!$response->successful()) {
            Log::error('Khalti initiate HTTP failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            $payment->update(['status' => 'Failed']);
            return redirect($this->frontendUrl . '/?payment/failed?reason=initiate_failed');
        }

        $data = $response->json();
        Log::info('Khalti initiate response', $data);

        if (!isset($data['pidx']) || !isset($data['payment_url'])) {
            Log::error('Khalti initiate missing keys', $data);
            $payment->update(['status' => 'Failed']);
            return redirect($this->frontendUrl . '/?payment/failed?reason=invalid_response');
        }

        $payment->update(['pidx' => $data['pidx']]);

        // Send user to Khalti payment page
        return redirect()->away($data['payment_url']);

   dd([
    'secret_key'  => config('services.khalti.secret_key'),
    'base_url'    => config('services.khalti.base_url'),
    'http_status' => $response->status(),
    'response'    => $response->json(),
]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'pidx' => 'required|string',
        ]);

        $payment = Payment::where('pidx', $request->pidx)->first();

        if (!$payment) {
            return redirect($this->frontendUrl . '/?payment/failed?reason=payment_not_found');
        }

        // Early exit if Khalti already tells us it failed
        if ($request->status && $request->status !== 'Completed') {
            $payment->update(['status' => 'Failed']);
            return redirect($this->frontendUrl . '/?payment/failed?reason=payment_cancelled');
        }

        $response = Http::withHeaders([
            'Authorization' => 'Key ' . config('services.khalti.secret_key'),
        ])->post(config('services.khalti.base_url') . '/epayment/lookup/', [
            'pidx' => $request->pidx
        ]);

        if (!$response->successful()) {
            Log::error('Khalti lookup HTTP failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            $payment->update(['status' => 'Failed']);
            return redirect($this->frontendUrl . '/?payment/failed?reason=lookup_failed');
        }

        $data = $response->json();
        Log::info('Khalti lookup response', $data);

        if (($data['status'] ?? null) === 'Completed') {
            $payment->update([
                'transaction_id' => $data['transaction_id'] ?? null,
                'status'         => 'Completed'
            ]);

            $payment->appointment->update(['status' => 'Confirmed']);

            return redirect(
                $this->frontendUrl . '/?payment/success?appointment_id=' . $payment->appointment_id
            );
        }

        $payment->update(['status' => 'Failed']);
        return redirect($this->frontendUrl . '/?payment/failed?reason=payment_failed');
    }
}