'use client'
import Authapi from "@/components/api/Authapi";
import { Loadingoverlay, NumberInput, Passwordinput, Textinput } from "@nayeshdaggula/tailify";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useEmployeDetails } from "@/components/zustand/useEmployeDetails";
import Errorpanel from "@/components/shared/Errorpanel";
import config from "@/config";
import { toast } from "react-toastify";

function Loginform() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const updateAuthDetails = useEmployeDetails(state => state.updateAuthDetails);

    const router = useRouter()
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!password) return "Password is required";
        if (!minLength) return "Password must be at least 8 characters long";
        if (!hasUppercase) return "Password must contain at least one uppercase letter";
        if (!hasLowercase) return "Password must contain at least one lowercase letter";
        if (!hasNumber) return "Password must contain at least one number";
        if (!hasSpecialChar) return "Password must contain at least one special character (!@#$%^&*)";

        return "";
    };

    let app_url = config.main_url;

    const handleSubmit = (e) => {
        setIsLoading(true)
        e.preventDefault();
        if (!email) {
            setIsLoading(false)
            setEmailError("Email is required");
            return false;
        }

        if (!validateEmail(email)) {
            setIsLoading(false)
            setEmailError("Invalid email format");
            return false;
        }

        const passwordValidationMsg = validatePassword(password);
        if (passwordValidationMsg) {
            setIsLoading(false)
            setPasswordError(passwordValidationMsg);
            return false;
        }

        // API call 
        Authapi.post('admin/login', {
            email: email,
            password: password
        }).then((response) => {
            const data = response.data;
            if (data.status === "error_user_not_found") {
                setIsLoading(false)
                let finalResponse = {
                    "message": data.message,
                    "server_res": data
                }
                setErrorMessage(finalResponse);
                return false;
            } else if (data.status === "error_invalid_password") {
                setIsLoading(false)
                let finalResponse = {
                    "message": data.message,
                    "server_res": data
                }
                setErrorMessage(finalResponse);
                return false;
            } else {
                updateAuthDetails(data.user_details, data.access_token);
                const url = new URL(`${app_url}/cookiesapi/admincookies/`);
                const params = new URLSearchParams({
                    adminaccessToken: data.access_token,
                    adminis_logged: true,
                    adminuuid: data.user_details.uuid,
                    adminuser_type: data.user_details.user_type,
                });

                url.search = params.toString();

                fetch(url.toString(), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.status === 'success') {
                            toast.success('Logged in Successfully', {
                                position: 'top-right',
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            setIsLoading(false);
                            router.push('/admin/dashboard')
                            return true;
                        } else {
                            let finalresponse = {
                                'status': 'error',
                                'message': data.message,
                                'server_res': null
                            }
                            console.log(finalresponse);
                            setIsLoading(false);
                            return false;
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                        setIsLoading(false);
                        return false;
                    });

                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
                return false;
            }
        })
            .catch((error) => {
                console.log(error)
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false;
            });
    }
    return (
        <>
            <form className="w-full flex flex-col space-y-4 relative" onSubmit={handleSubmit}>
                <>
                    <Textinput
                        label="Email Address"
                        placeholder="Enter Your Email"
                        inputClassName="w-full"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                        }}
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </>
                <>
                    <Passwordinput
                        label="Password"
                        placeholder="Enter Your Password"
                        inputClassName="w-full"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordError('');
                        }}
                    />
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </>
                <button type="button" className="text-blue-500 text-sm self-center cursor-pointer">
                    Forgot Password?
                </button>
                <button type="submit" className="w-full text-white py-2 rounded-lg hover:opacity-90 cursor-pointer" style={{ backgroundColor: "#044093" }}>
                    Login
                </button>
                {
                    isLoading &&
                    <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                        <Loadingoverlay visible={isLoading} overlayBg='' />
                    </div>
                }
                {
                    errorMessage !== '' &&
                    <Errorpanel
                        errorMessages={errorMessage}
                    />
                }
            </form>
        </>

    );
}

export default Loginform;
