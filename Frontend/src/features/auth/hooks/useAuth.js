import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, error, setError } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            // Store token in localStorage for persistence
            if (data.token) {
                localStorage.setItem("authToken", data.token)
            }
            return true
        } catch (err) {
            console.log(err);
            setError(err?.message || err)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            // Store token in localStorage for persistence
            if (data.token) {
                localStorage.setItem("authToken", data.token)
            }
            return true
        } catch (err) {
            console.log(err);
            setError(err?.message || err)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            await logout()
            setUser(null)
            // Clear token from localStorage
            localStorage.removeItem("authToken")
            return true
        } catch (err) {
            console.log(err);
            setError(err?.message || err)
            return false
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                setError(null)
                const data = await getMe()
                setUser(data.user)
                // Update stored token if provided in response
                if (data.token) {
                    localStorage.setItem("authToken", data.token)
                }
            } catch (err) {
                console.log(err);
                setUser(null)
                localStorage.removeItem("authToken")
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, error, handleRegister, handleLogin, handleLogout, setError }
}