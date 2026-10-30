import React, { useState } from 'react'
import "../style/login.scss"
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    async function handleSubmit(e) {
        e.preventDefault()

        await handleLogin({ email, password })
        navigate("/")
    }





    return (
        <main className='login-page'>
            <div className="form-contaier">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email" placeholder="Enter your Email"
                    />


                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password" placeholder="Enter your Password"
                    />


                    <button className='button' type='submit'>Login</button>
                </form>
                <p>Don't have a account? <Link to="/register">Register here</Link></p>
            </div>
        </main>
    )
}

export default Login
