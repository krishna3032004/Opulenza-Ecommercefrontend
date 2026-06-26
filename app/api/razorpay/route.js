import { NextResponse } from "next/server";

const JAVA_URL = "http://localhost:8080"

export const POST = async (req) => {
    let body = await req.formData()
    body = Object.fromEntries(body)

    const res = await fetch(`${JAVA_URL}/api/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            razorpayOrderId: body.razorpay_order_id,
            razorpayPaymentId: body.razorpay_payment_id,
            razorpaySignature: body.razorpay_signature,
            email: body.email || "",
            fromCart: body.fromCart === "true"
        })
    })

    const data = await res.json()

    if (data.success) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL2}/receipt/${body.razorpay_order_id}?paymentdone=true`)
    } else {
        return NextResponse.json({ success: false, message: data.message || "Payment Verification Failed" })
    }
}
