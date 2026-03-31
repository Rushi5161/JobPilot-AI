import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { AuthNavbar } from '../components/AuthNavbar'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // if (!email.trim() || !password.trim()) {
        //     setError("Please enter both email and password.")
        //     return
        // }

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        // if (!emailRegex.test(email)) {
        //     setError("Please enter a valid email address.")
        //     return
        // }

        const success = await handleLogin({ email, password })
        if (success) {
            navigate('/interview')
        } else {
            setError("Login failed. Check your credentials and try again.")
        }
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }


    return (
        <>
            <AuthNavbar />
            <main>
            <div className="form-container">
                <h1>Login</h1>
                {error && <p style={{ color: '#ff6b6b', fontSize: '0.95rem', marginBottom: '0.7rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>
                    <button className='button primary-button' >Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
        </>
    )
}

export default Login