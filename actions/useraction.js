'use client'

const BASE_URL = "http://localhost:8080"

const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token") || ""
    }
    return ""
}

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
})

// ===================== AUTH =====================

export const registerUser = async (email) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (data.message === "User already exists") return "User already exists"
    return true
}

export const confirmcode = async (code) => {
    if (typeof window !== "undefined") {
        const pendingOtp = sessionStorage.getItem("pendingOtp")
        return code === pendingOtp
    }
    return false
}

export const createUser = async (email, password, username) => {
    const otp = typeof window !== "undefined" ? sessionStorage.getItem("pendingOtp") : ""
    const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp, email, password, username })
    })
    const data = await res.json()
    if (data.token && typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
        sessionStorage.removeItem("pendingOtp")
    }
    return data
}

export const verify = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) {
        return data.message || "Invalid email or password"
    }
    if (data.token && typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
    }
    return false
}

export const oauthLogin = async (email, name) => {
    const res = await fetch(`${BASE_URL}/api/auth/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
    })
    const data = await res.json()
    if (data.token && typeof window !== "undefined") {
        localStorage.setItem("token", data.token)
    }
    return data
}

export const resetPassword = async (email) => {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (data.message === "User don't exists") return "User don't exists"
    return true
}

export const sendotpforforgoting = async (email) => {
    await resetPassword(email)
}

export const updateProfile = async (email, password) => {
    // This is called after OTP confirm for reset password
    // We need the OTP from sessionStorage
    const otp = typeof window !== "undefined" ? sessionStorage.getItem("pendingOtp") : ""
    await fetch(`${BASE_URL}/api/auth/confirm-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp, email, newPassword: password })
    })
}

// ===================== PRODUCTS =====================

export const fetchfeatured = async () => {
    const res = await fetch(`${BASE_URL}/api/products/featured`)
    const data = await res.json()
    return JSON.stringify(data)
}

export const getproducts = async (slug) => {
    const res = await fetch(`${BASE_URL}/api/products?slug=${encodeURIComponent(slug)}`)
    const data = await res.json()
    if (!data || data.length === 0) return JSON.stringify([])
    return JSON.stringify(data)
}

export const fetchProduct = async (id) => {
    const res = await fetch(`${BASE_URL}/api/products/${id}`)
    const data = await res.json()
    return data
}

export const fetchProductbyid = async (productid) => {
    const ids = productid.map(item => item.product)
    const res = await fetch(`${BASE_URL}/api/products/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
    })
    const data = await res.json()
    return JSON.stringify(data)
}

export const fetchProductbyidforcheckout = async (productid) => {
    const res = await fetch(`${BASE_URL}/api/products/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: productid })
    })
    const data = await res.json()
    return JSON.stringify(data)
}

export const fetchProductforwishlist = async (productid) => {
    const res = await fetch(`${BASE_URL}/api/products/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: productid })
    })
    const data = await res.json()
    return JSON.stringify(data)
}

export const fetchProductfororder = async (orders, email) => {
    const userEmail = email || (typeof window !== "undefined" ? (localStorage.getItem("userEmail") || "") : "")
    const res = await fetch(`${BASE_URL}/api/user/orders?email=${encodeURIComponent(userEmail)}`, {
        headers: authHeaders()
    })
    const data = await res.json()
    return JSON.stringify(data)
}

export const initiate = async (ndata) => {
    await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(ndata)
    })
}

// ===================== USER =====================

export const fetchUser = async (email) => {
    const res = await fetch(`${BASE_URL}/api/user?email=${encodeURIComponent(email)}`, {
        headers: authHeaders()
    })
    if (!res.ok) return null
    const data = await res.json()
    return data
}

export const updateProfilefull = async (data) => {
    await fetch(`${BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data)
    })
}

// ===================== CART =====================

export const fetchCart = async (email) => {
    const res = await fetch(`${BASE_URL}/api/user/cart?email=${encodeURIComponent(email)}`, {
        headers: authHeaders()
    })
    const data = await res.json()
    return JSON.stringify(data)
}

export const updateCart = async (email, productId, quantity) => {
    await fetch(`${BASE_URL}/api/user/cart`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email, productId, quantity })
    })
}

export const removeproductfromcart = async (email, productid) => {
    const res = await fetch(`${BASE_URL}/api/user/cart/${productid}?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: authHeaders()
    })
    const data = await res.json()
    return JSON.stringify(data)
}

export const changequantityfromcart = async (cart, email) => {
    await fetch(`${BASE_URL}/api/user/cart`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ email, cart })
    })
}

export const checkcart = async (email, productid) => {
    const res = await fetch(`${BASE_URL}/api/user/cart/check?email=${encodeURIComponent(email)}&productId=${productid}`, {
        headers: authHeaders()
    })
    const data = await res.json()
    return data.inCart
}

// ===================== CHECKOUT =====================

export const fetchcheckout = async (email) => {
    const res = await fetch(`${BASE_URL}/api/user/checkout?email=${encodeURIComponent(email)}`, {
        headers: authHeaders()
    })
    const data = await res.json()
    return data
}

export const putcheckout = async (email, productid, quantity) => {
    const res = await fetch(`${BASE_URL}/api/user/checkout`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email, productId: productid, quantity })
    })
    const data = await res.json()
    return data
}

// ===================== WISHLIST =====================

export const updatewishlist = async (email, productid, color) => {
    if (color === "gray") {
        await fetch(`${BASE_URL}/api/user/wishlist`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ email, productId: productid, color })
        })
    } else {
        await fetch(`${BASE_URL}/api/user/wishlist/${productid}?email=${encodeURIComponent(email)}`, {
            method: "DELETE",
            headers: authHeaders()
        })
    }
}

export const removeproductfromwishlist = async (email, productid) => {
    const res = await fetch(`${BASE_URL}/api/user/wishlist/${productid}?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: authHeaders()
    })
    const user = await fetchUser(email)
    return JSON.stringify(user.wishlist || [])
}

// ===================== ORDERS =====================

export const decreaseproduct = async (cart, email, oid) => {
    await fetch(`${BASE_URL}/api/user/order/from-cart`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email, oid, cart })
    })
}

export const decreaseproductfromcheckout = async (email, oid) => {
    try {
        await fetch(`${BASE_URL}/api/user/order/from-checkout`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ email, oid })
        })
    } catch (e) {
        return { redirect: { destination: '/error?message=' + encodeURIComponent(e.message), permanent: false } }
    }
}

export const getorder = async (oid) => {
    const res = await fetch(`${BASE_URL}/api/payment/order/${oid}`, {
        headers: authHeaders()
    })
    const data = await res.json()
    return data
}

// ===================== PAYMENT =====================

export const initiatepayment = async (amount, email, form) => {
    const res = await fetch(`${BASE_URL}/api/payment/initiate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ amount, email, form })
    })
    const data = await res.json()
    return data
}

// ===================== REVIEWS =====================

export const saveReview = async (form) => {
    await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
    })
}

export const sendVerificationEmail = async (email) => {
    // OTP ab Java backend bhejta hai, seedha register call karo
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    // OTP session mein store karna padega (backend se nahi milta directly)
    // Java backend sends email directly, frontend just waits for user to enter OTP
    return true
}
