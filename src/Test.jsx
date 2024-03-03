import React from "react"
import { useState, useEffect } from "react"
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function Test() {
    const [amount, setAmount] = useState(1)
    const [fromCur, setFromCur] = useState("EUR")
    const [toCur, setToCur] = useState("USD")
    const [converted, setConverted] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(
        function () {
            async function convert() {
                setLoading(true)

                const res = await fetch(
                    `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur} `
                )
                const data = await res.json()
                console.log(data.rates[toCur])
                setConverted(data.rates[toCur])
                setLoading(false)
            }
            if (fromCur === toCur) {
                return setConverted(amount)
            }
            convert()
        },
        [amount, fromCur, toCur]
    )
    return (
        <div>
            <input
                type="text"
                onChange={(e) => setAmount(Number(e.target.value))}
                value={amount}
                disabled={loading}
            />
            <select
                value={fromCur}
                onChange={(e) => setFromCur(e.target.value)}
                disabled={loading}
            >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
                <option value="INR">INR</option>
            </select>
            <select
                value={toCur}
                onChange={(e) => setToCur(e.target.value)}
                disabled={loading}
            >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
                <option value="INR">INR</option>
            </select>
            <p>
                OUTPUT: {converted} {toCur}
            </p>
        </div>
    )
}
