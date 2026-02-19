<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // Sandbox URL and merchant code

 private $esewa_sandbox_url = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";





    private $merchant_code = "EPAYTEST"; 

    // Step 1: Redirect user to eSewa
   public function redirectToEsewa($appointmentId)
{
    $appointment = DB::select("SELECT * FROM appointments WHERE id = ?", [$appointmentId]);

    if (empty($appointment)) {
        return redirect()->back()->with('error', 'Appointment not found');
    }

    $appointment = $appointment[0];

    $paymentId = uniqid();

    DB::insert("INSERT INTO payments (appointment_id, transaction_id, amount, payment_gateway, payment_status, created_at, updated_at)
                VALUES (?, ?, ?, 'esewa', 'Pending', NOW(), NOW())",
                [$appointment->id, $paymentId, $appointment->total_cost]);

    $secretKey = "YOUR_SECRET_KEY"; // from eSewa merchant dashboard

    $message = "total_amount={$appointment->total_cost},transaction_uuid={$paymentId},product_code=EPAYTEST";

    $signature = base64_encode(hash_hmac('sha256', $message, $secretKey, true));

    $params = [
        'amount' => $appointment->total_cost,
        'tax_amount' => 0,
        'total_amount' => $appointment->total_cost,
        'transaction_uuid' => $paymentId,
        'product_code' => 'EPAYTEST',
        'product_service_charge' => 0,
        'product_delivery_charge' => 0,
        'success_url' => "https://unaidedly-propublication-marcelo.ngrok-free.dev/payment-success",
        'failure_url' => "https://unaidedly-propublication-marcelo.ngrok-free.dev/payment-failure",
        'signed_field_names' => 'total_amount,transaction_uuid,product_code',
        'signature' => $signature
    ];

    return view('esewa.redirect', compact('params'));
}


    // Step 2: Success callback
   public function success(Request $request)
{
    $pid = $request->pid;
    $amt = $request->amt;
    $refId = $request->refId;

    $url = "https://uat.esewa.com.np/epay/transrec";

    $data = [
        'amt' => $amt,
        'scd' => 'EPAYTEST',
        'pid' => $pid,
        'rid' => $refId
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    if (strpos($response, "Success") !== false) {

        DB::update("UPDATE payments SET payment_status = 'Completed', updated_at = NOW() WHERE id = ?", [$pid]);

        return redirect("http://localhost:5173/payment-success");
    }

    return redirect("http://localhost:5173/payment-failure");
}


    // Step 3: Failure callback
    public function failure()
    {
        return redirect(env('FRONTEND_URL') . "/payment-failure");
    }
}
