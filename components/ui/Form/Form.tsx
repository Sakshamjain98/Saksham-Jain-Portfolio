import React, { useState, useEffect } from "react";
import "./Form.css"; // Assuming you have your CSS file in the same directory
import a from "./im.svg";
const Form: React.FC = () => {
  // State variables for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Effect to clear errors when email or password change
  useEffect(() => {
    setFormErrors({});
  }, [email, password]);

  // Form validation function
  const validateForm = (): boolean => {
    let errors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  // Form submission handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      // Replace with your actual form submission logic
      console.log("Form submitted:", { email, password });
      // Reset form fields after submission
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="container">
      <div className="left">
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-block">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input ${formErrors.email && "error"}`}
              placeholder=" "
            />
            <label>Email</label>
            {formErrors.email && (
              <span className="error-message">{formErrors.email}</span>
            )}
          </div>
          <div className="input-block">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input ${formErrors.password && "error"}`}
              placeholder=" "
            />
            <label>Password</label>
            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>
          <button type="submit">Login</button>
          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      </div>
      <div className="right">
        <div className="img">
          {/* Replace with your SVG or image */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 731.67004 550.61784"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M0,334.13393c0,.66003,.53003,1.19,1.19006,1.19H730.48004c.65997,0,1.19-.52997,1.19-1.19,0-.65997-.53003-1.19-1.19-1.19H1.19006c-.66003,0-1.19006,.53003-1.19006,1.19Z"
              fill="#3f3d56"
            />
            <polygon
              points="466.98463 81.60598 470.81118 130.55703 526.26809 107.39339 494.98463 57.60598 466.98463 81.60598"
              fill="#a0616a"
            />
            <circle cx="465.32321" cy="55.18079" r="41.33858" fill="#a0616a" />
            <polygon
              points="387.98463 440.60598 394.98463 503.39339 345.98463 496.60598 361.98463 438.60598 387.98463 440.60598"
              fill="#a0616a"
            />
            <polygon
              points="578.98463 449.60598 585.98463 512.39339 536.98463 505.60598 552.98463 447.60598 578.98463 449.60598"
              fill="#a0616a"
            />
            <path
              d="M462.48463,260.10598c-.66897,0-54.14584,2.68515-89.47714,4.46286-16.72275,.84141-29.45202,15.31527-28.15459,32.00884l12.63173,162.5283,36,1,.87795-131,71.12205,4-3-73Z"
              fill="#2f2e41"
            />
            <path
              d="M619.48463,259.10598s9,69,2,76c-7,7-226.5-5.5-226.5-5.5,0,0,48.15354-69.53704,56.82677-71.51852,8.67323-1.98148,146.67323-8.98148,146.67323-8.98148l21,10Z"
              fill="#2f2e41"
            />
            <path
              id="uuid-91047c5b-47d7-4179-8a16-40bd6d529b28-203"
              d="M335.12666,172.23337c-8.35907-11.69074-9.10267-25.48009-1.66174-30.79863,7.44093-5.31854,20.24665-.15219,28.60713,11.54383,3.40375,4.62627,5.65012,10.00041,6.55111,15.67279l34.79215,49.9814-19.8001,13.70807-35.7745-48.83421c-5.07753-2.68845-9.43721-6.55406-12.71405-11.27326Z"
              fill="#a0616a"
            />
            <path
              d="M464.98463,112.60598l51-21,96,148s-67,15-90,18c-23,3-49-9-49-9l-8-136Z"
              fill="#6c63ff"
            />
            <path
              d="M526.98463,137.60598l-18.5-57.70866,24,18.20866s68,45,68,64c0,19,21,77,21,77,0,0,23.5,19.5,15.5,37.5-8,18,10.5,15.5,12.5,28.5,2,13-28.5,30.5-28.5,30.5,0,0-7.5-73.5-31.5-73.5-24,0-62.5-124.5-62.5-124.5Z"
              fill="#3f3d56"
            />
            <path
              d="M468.56831,111.13035l-25.08368,9.97563s4,70,8,76c4,6,18,38,18,38v10.42913s-28,8.57087-27,13.57087c1,5,66,19,66,19,0,0-13-40-21-53-8-13-18.91632-113.97563-18.91632-113.97563Z"
              fill="#3f3d56"
            />
            <path
              d="M452.48463,121.10598s-29-4-34,30c-5,34-1.82283,38.5-1.82283,38.5l-8.17717,19.5-27-30-26,17s47,76,66,74c19-2,47-57,47-57l-16-92Z"
              fill="#3f3d56"
            />
            <path
              d="M597.32321,270.14478l-14.83858,209.96121-38.5-1.5s-8.5-198.5-8.5-201.5c0-3,4-20,29-21,25-1,32.83858,14.03879,32.83858,14.03879Z"
              fill="#2f2e41"
            />
            <path
              d="M541.48463,484.10598s20-6,23-2c3,4,20,6,20,6l5,49s-14,10-16,12-55,4-56-8c-1-12,14-27,14-27l10-30Z"
              fill="#2f2e41"
            />
            <path
              d="M394.48463,470.10598s6-5,8,9c2,14,9,37-1,40-10,3-110,4-110-5v-9l9-7,18.00394-2.869s34.99606-32.131,38.99606-32.131c4,0,17,13,17,13l20-6Z"
              fill="#2f2e41"
            />
            <path
              d="M505.98463,77.60598s-20-24-28-22-3,5-3,5l-20-22s-16-6-31,13c0,0-9-16,0-25,9-9,12-8,14-13,2-5,16-9,16-9,0,0-.80315-7.19685,3.59843-3.59843s15.3937,3.59843,15.3937,3.59843c0,0,.06299-4,4.53543,0,4.47244,4,9.47244,2,9.47244,2,0,0,0,6.92126,3.5,6.96063,3.5,.03937,9.5-4.96063,10.5-.96063,1,4,8,6,9,18,1,12-4,47-4,47Z"
              fill="#2f2e41"
            />
            <g>
              <path
                d="M342.99463,178.84874l-114.2362,78.82694c-3.94205,2.72015-9.36214,1.72624-12.08229-2.21581l-32.16176-46.60891c-2.72015-3.94205-1.7259-9.36208,2.21615-12.08223l114.2362-78.82694c3.94205-2.72015,9.36208-1.7259,12.08223,2.21615l32.16176,46.60891c2.72015,3.94205,1.72624,9.36214-2.21581,12.08229Z"
                fill="#a0616a"
              />
              <path
                d="M186.80821,147.9609l109.05458-75.17849c3.942,2.72019,4.93594,8.14028,2.21582,12.08228L267.4447,184.42249c-2.72015,3.94205-8.14024,4.93594-12.08229,2.21581l-109.05458-75.17849c-3.942-2.72019-4.93594-8.14028-2.21582-12.08228l32.16176-46.6089c2.72015-3.94205,8.14024-4.93594,12.08229-2.21581Z"
                fill="#2f2e41"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Form;
