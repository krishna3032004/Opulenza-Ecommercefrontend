import { NextResponse } from "next/server";

// const JAVA_URL = "http://localhost:8080"
const JAVA_URL = process.env.NEXT_PUBLIC_JAVA_BACKEND_URL || "http://localhost:8080";

export const POST = async (req) => {
    let body = await req.formData()
    body = Object.fromEntries(body)

    const res = await fetch(`${JAVA_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            productId: body.productId,
            namereviewer: body.namereviewer,
            review: body.review,
            stars: Number(body.stars),
            starmess: body.starmess
        })
    })

    if (res.ok) {
        return NextResponse.json({ success: true })
    } else {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
