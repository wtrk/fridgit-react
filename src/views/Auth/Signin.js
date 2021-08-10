import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
// import Layout from '../core/Layout';
import axios from 'axios';
import {authenticate,isAuth} from "components/auth/Helpers.js";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        buttonText: 'Signin'
    });

    const { email, password, buttonText } = values;

    const handleChange = name => event => {
        // console.log(event.target.value);
        setValues({ ...values, [name]: event.target.value });
    };

    const clickSubmit = event => {
        console.log("fffffffffffffff",email)
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' });
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_BASE_URL}/signin`,
            data: { email, password }
        })
            .then(response => {
                authenticate(response, ()=>{
                  console.log('SIGNIN SUCCESS', response);
                  setValues({ ...values, name: '', email: '', password: '', buttonText: 'Submitted' });
                //   toast.success(`Hey ${response.data.user.name}, Welcome back!`);
                })
                // save the response (user, token) localstorage/cookie
                // toast.success(`Hey ${response.data.user.name}, Welcome back!`);
            })
            .catch(error => {
                console.log('SIGNIN ERROR', error);
                setValues({ ...values, buttonText: 'Submit' });
                // toast.error(error.response.data.error);
            });
    };

    return (
        // <Layout>
        isAuth()?<Redirect to="/" />:<div className="signin-container">
                {/* <ToastContainer /> */}
                <img src={require("assets/img/logo.png")} alt="logo" className="signin-logo" />
                <h1 className="pt-3 pb-5 text-center">FridgeIt</h1>
                <form>
                    <div className="form-group">
                        <lable className="text-muted">Email</lable>
                        <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
                    </div>

                    <div className="form-group">
                        <lable className="text-muted">Password</lable>
                        <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
                    </div>
                    
                    <div>
                        <button className="btn btn-primary w-100" onClick={clickSubmit}>
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        // </Layout>
    );
};

export default Signin;