<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // Sandbox URL and merchant code
 private $esewa_sandbox_url = "https://esewatest.com.np/epay/main";


    private $merchant_code = "EPAYTEST"; 

    // Step 1: Redirect user to eSewa
    public function redirectToEsewa($appointmentId)
    {
        $appointment = DB::select("SELECT * FROM appointments WHERE id = ?", [$appointmentId]);

        if (empty($appointment)) {
            return redirect()->back()->with('error', 'Appointment not found');
        }

        $appointment = $appointment[0];

        // Save initial payment record
        DB::insert("INSERT INTO payments (appointment_id, amount, payment_gateway, payment_status, created_at, updated_at)
                    VALUES (?, ?, 'esewa', 'Pending', NOW(), NOW())",
                    [$appointment->id, $appointment->total_cost]);

        $payment = DB::select("SELECT * FROM payments WHERE appointment_id = ? ORDER BY id DESC LIMIT 1", [$appointment->id])[0];

        // eSewa parameters
        $params = [
            'amt' => $appointment->total_cost,
            'pdc' => 0,
            'psc' => 0,
            'txAmt' => 0,
            'tAmt' => $appointment->total_cost,
            'pid' => $payment->id,
            'scd' => $this->merchant_code,
            'su' => route('payment.success'),
            'fu' => route('payment.failure')
        ];

        $query = http_build_query($params);

        return redirect($this->esewa_sandbox_url . '?' . $query);
    }

    // Step 2: Success callback
    public function success(Request $request)
    {
        $pid = $request->input('pid'); // Payment ID in our DB
        $amt = $request->input('amt');
        $tAmt = $request->input('tAmt');

        // Validate with eSewa verification endpoint
        $data = [
    'amt' => $amt,
    'pdc' => 0,
    'psc' => 0,
    'txAmt' => 0,
    'tAmt' => $tAmt,
    'pid' => $pid,
    'scd' => $this->merchant_code
];


        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://esewatest.com.np/epay/transrec");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        if (strpos($response, "Success") !== false) {
            // Update payment status
            DB::update("UPDATE payments SET payment_status = 'Completed', updated_at = NOW() WHERE id = ?", [$pid]);

            // Update appointment status
            $payment = DB::select("SELECT * FROM payments WHERE id = ?", [$pid])[0];
            DB::update("UPDATE appointments SET status = 'Confirmed', updated_at = NOW() WHERE id = ?", [$payment->appointment_id]);

            return redirect(env('FRONTEND_URL') . "/payment-success?appointment_id=" . $payment->appointment_id);
        }

        return redirect(env('FRONTEND_URL') . "/payment-failure");
    }

    // Step 3: Failure callback
    public function failure()
    {
        return redirect(env('FRONTEND_URL') . "/payment-failure");
    }
}
